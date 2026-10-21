import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';

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

function sanitizeFileName(fileName: string): string {
  return fileName.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
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

export async function POST(request: NextRequest) {
  try {
    if (!(await assertAdmin(request)).authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    const category = String(formData.get('category') ?? '').trim();

    if (!(file instanceof File) || !category) {
      return NextResponse.json({ error: 'Missing file or category' }, { status: 400 });
    }
    if (file.type !== ALLOWED_MIME_TYPE || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10MB limit.' }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name.replace(/\.pdf$/i, ''));
    const storagePath = `${category}/${Date.now()}-${safeName}.pdf`;

    const supabaseAdmin = getSupabaseAdminClient();
    const { error: uploadError } = await supabaseAdmin.storage
      .from('access-info-documents')
      .upload(storagePath, file, { cacheControl: '3600', upsert: false, contentType: ALLOWED_MIME_TYPE });

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      file_path: storagePath,
      public_url: buildPublicUrl(storagePath),
      file_size_bytes: file.size,
      mime_type: file.type,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}