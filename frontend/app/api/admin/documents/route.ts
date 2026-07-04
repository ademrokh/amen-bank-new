import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { CATEGORY_CONFIG, buildCategoryString, type CategoryKey } from '@/lib/document-categories';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPE = 'application/pdf';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('Supabase admin credentials are not configured.');
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isAuthorizedEmail(email: string | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

function buildPublicUrl(filePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${encodeURIComponent(filePath)}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function assertAdmin(request: NextRequest) {
  if (request.cookies.get('admin_session')?.value === 'true') return { authorized: true };
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.user?.email || !isAuthorizedEmail(session.user.email)) return { authorized: false };
  return { authorized: true };
}

export async function GET(request: NextRequest) {
  try {
    if (!(await assertAdmin(request)).authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get('category');
    const supabaseAdmin = getSupabaseAdminClient();
    let query = supabaseAdmin.from('info_access_documents').select('*').order('created_at', { ascending: false });
    if (categoryFilter) query = query.eq('category', categoryFilter);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
    return NextResponse.json({ documents: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await assertAdmin(request)).authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    const titleFr = String(formData.get('title_fr') ?? '').trim();
    const titleEn = String(formData.get('title_en') ?? '').trim();
    const titleAr = String(formData.get('title_ar') ?? '').trim();
    const baseCategory = String(formData.get('category') ?? '').trim() as CategoryKey;

    if (!(file instanceof File) || !titleFr || !titleEn || !titleAr || !baseCategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (file.type !== ALLOWED_MIME_TYPE || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10MB limit.' }, { status: 400 });
    }

    const filters: Record<string, string> = {};
    const config = CATEGORY_CONFIG[baseCategory];
    if (config) {
      config.filters.forEach(key => {
        const val = String(formData.get(`filter_${key}`) ?? '').trim();
        if (val) filters[key] = val;
      });
    }

    const finalCategoryString = buildCategoryString(baseCategory, filters);
    const safeName = sanitizeFileName(file.name.replace(/\.pdf$/i, ''));
    const storagePath = `${baseCategory}/${Date.now()}-${safeName}.pdf`;

    const supabaseAdmin = getSupabaseAdminClient();

    const { error: uploadError } = await supabaseAdmin.storage.from('access-info-documents').upload(storagePath, file, { cacheControl: '3600', upsert: false, contentType: ALLOWED_MIME_TYPE });
    if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

    const { data: insertedDocument, error: insertError } = await supabaseAdmin.from('info_access_documents').insert({
      title_fr: titleFr, title_en: titleEn, title_ar: titleAr,
      category: finalCategoryString, file_path: storagePath,
      file_size_bytes: file.size, mime_type: file.type,
      is_published: false, display_order: 0, published_at: new Date().toISOString(),
    }).select().single();

    if (insertError || !insertedDocument) return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });

    return NextResponse.json({ document: { ...insertedDocument, public_url: buildPublicUrl(storagePath) } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await assertAdmin(request)).authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id, is_published } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.from('info_access_documents').update({ is_published }).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    return NextResponse.json({ document: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await assertAdmin(request)).authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: doc } = await supabaseAdmin.from('info_access_documents').select('file_path').eq('id', id).single();
    if (doc) await supabaseAdmin.storage.from('access-info-documents').remove([doc.file_path]);
    const { error: deleteError } = await supabaseAdmin.from('info_access_documents').delete().eq('id', id);
    if (deleteError) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}