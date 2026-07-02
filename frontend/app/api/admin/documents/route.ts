import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPE = 'application/pdf';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin credentials are not configured.');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isAuthorizedEmail(email: string | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

function buildPublicUrl(filePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${encodeURIComponent(filePath)}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function assertAdmin(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user?.email) {
    return { authorized: false, session: null as null, error: 'Unauthorized' };
  }

  if (!isAuthorizedEmail(session.user.email)) {
    return { authorized: false, session: null as null, error: 'Unauthorized' };
  }

  return { authorized: true, session, error: null };
}

export async function GET(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('info_access_documents')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load admin documents', error);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }

  return NextResponse.json({ documents: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const titleFr = String(formData.get('title_fr') ?? '').trim();
  const titleEn = String(formData.get('title_en') ?? '').trim();
  const titleAr = String(formData.get('title_ar') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();

  if (!(file instanceof File) || !titleFr || !titleEn || !titleAr || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fileName = file.name ?? 'document.pdf';
  const extension = fileName.toLowerCase().endsWith('.pdf') ? '.pdf' : '';
  if (file.type !== ALLOWED_MIME_TYPE || extension !== '.pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'File exceeds the maximum size limit.' }, { status: 400 });
  }

  const safeName = sanitizeFileName(fileName.replace(/\.pdf$/i, ''));
  const storagePath = `${category}/${Date.now()}-${safeName}.pdf`;

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { error: uploadError } = await supabaseAdmin.storage.from('access-info-documents').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: ALLOWED_MIME_TYPE,
  });

  if (uploadError) {
    console.error('Failed to upload access info document', uploadError);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  const { data: insertedDocument, error: insertError } = await supabaseAdmin.from('info_access_documents').insert({
    title_fr: titleFr,
    title_en: titleEn,
    title_ar: titleAr,
    category,
    file_path: storagePath,
    file_size_bytes: file.size,
    mime_type: file.type,
    is_published: false,
    display_order: 0,
    published_at: new Date().toISOString(),
  }).select().single();

  if (insertError || !insertedDocument) {
    console.error('Failed to insert document metadata', insertError);
    return NextResponse.json({ error: 'Failed to save document metadata' }, { status: 500 });
  }

  return NextResponse.json({
    document: {
      ...insertedDocument,
      public_url: buildPublicUrl(storagePath),
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, is_published } = body as { id?: string; is_published?: boolean };

  if (!id) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('info_access_documents')
    .update({ is_published })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update document status', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }

  return NextResponse.json({ document: data });
}

export async function DELETE(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body as { id?: string };

  if (!id) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { data: document, error: fetchError } = await supabaseAdmin
    .from('info_access_documents')
    .select('file_path')
    .eq('id', id)
    .single();

  if (fetchError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const { error: storageError } = await supabaseAdmin.storage.from('access-info-documents').remove([document.file_path]);
  if (storageError) {
    console.error('Failed to delete storage object', storageError);
  }

  const { error: deleteError } = await supabaseAdmin.from('info_access_documents').delete().eq('id', id);
  if (deleteError) {
    console.error('Failed to delete document record', deleteError);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
