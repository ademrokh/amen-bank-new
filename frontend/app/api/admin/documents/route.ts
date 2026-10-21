import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { CATEGORY_CONFIG, buildCategoryString, type CategoryKey } from '@/lib/document-categories';

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
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${encodedPath}`;
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

    const body = await request.json();
    const {
      title_fr, title_en, title_ar,
      category: baseCategory,
      file_path, file_size_bytes, mime_type,
    } = body as {
      title_fr: string; title_en: string; title_ar: string;
      category: CategoryKey;
      file_path: string; file_size_bytes: number; mime_type: string;
      [key: string]: unknown;
    };

    if (!title_fr?.trim() || !title_en?.trim() || !title_ar?.trim() || !baseCategory || !file_path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const filters: Record<string, string> = {};
    const config = CATEGORY_CONFIG[baseCategory];
    if (config) {
      config.filters.forEach(key => {
        const val = String(body[`filter_${key}`] ?? '').trim();
        if (val) filters[key] = val;
      });
    }

    const finalCategoryString = buildCategoryString(baseCategory, filters);
    const supabaseAdmin = getSupabaseAdminClient();

    const { data: insertedDocument, error: insertError } = await supabaseAdmin.from('info_access_documents').insert({
      title_fr: title_fr.trim(),
      title_en: title_en.trim(),
      title_ar: title_ar.trim(),
      category: finalCategoryString,
      file_path,
      file_size_bytes: file_size_bytes ?? null,
      mime_type: mime_type ?? ALLOWED_MIME_TYPE,
      is_published: true,
      display_order: 0,
      published_at: new Date().toISOString(),
    }).select().single();

    if (insertError || !insertedDocument) {
      return NextResponse.json({ error: insertError?.message ?? 'Failed to save metadata' }, { status: 500 });
    }

    return NextResponse.json({ document: { ...insertedDocument, public_url: buildPublicUrl(file_path) } });
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