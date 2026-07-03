import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, getSupabaseAdminClient } from '../helpers';

const ICON_KEYS = ['governance', 'results', 'profit', 'markets', 'esg', 'card', 'home', 'mobile', 'approval', 'report'] as const;
type IconKey = (typeof ICON_KEYS)[number];

function normalizeIcon(value: unknown): IconKey {
  if (typeof value !== 'string') {
    return 'governance';
  }
  return ICON_KEYS.includes(value as IconKey) ? (value as IconKey) : 'governance';
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
    .from('press_articles')
    .select('*')
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Failed to load press articles', error);
    return NextResponse.json({ error: 'Failed to load press articles' }, { status: 500 });
  }

  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const titleFr = String(formData.get('title_fr') ?? '').trim();
  const titleEn = String(formData.get('title_en') ?? '').trim();
  const titleAr = String(formData.get('title_ar') ?? '').trim();
  const excerptFr = String(formData.get('excerpt_fr') ?? '').trim();
  const excerptEn = String(formData.get('excerpt_en') ?? '').trim();
  const excerptAr = String(formData.get('excerpt_ar') ?? '').trim();
  const bodyFr = String(formData.get('body_fr') ?? '').trim();
  const bodyEn = String(formData.get('body_en') ?? '').trim();
  const bodyAr = String(formData.get('body_ar') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const icon = normalizeIcon(formData.get('icon'));
  const isPublished = String(formData.get('is_published') ?? 'false') === 'true';
  const displayOrder = Number(formData.get('display_order') ?? 0) || 0;

  if (!titleFr || !titleEn || !titleAr || !excerptFr || !excerptEn || !excerptAr || !bodyFr || !bodyEn || !bodyAr || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { data: insertedArticle, error } = await supabaseAdmin
    .from('press_articles')
    .insert({
      title_fr: titleFr,
      title_en: titleEn,
      title_ar: titleAr,
      excerpt_fr: excerptFr,
      excerpt_en: excerptEn,
      excerpt_ar: excerptAr,
      body_fr: bodyFr,
      body_en: bodyEn,
      body_ar: bodyAr,
      category,
      icon,
      is_published: isPublished,
      display_order: displayOrder,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !insertedArticle) {
    console.error('Failed to create press article', error);
    return NextResponse.json({ error: 'Failed to save press article' }, { status: 500 });
  }

  return NextResponse.json({ article: insertedArticle });
}

export async function PATCH(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, is_published, display_order } = body as { id?: string; is_published?: boolean; display_order?: number };

  if (!id) {
    return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};
  if (typeof is_published === 'boolean') updatePayload.is_published = is_published;
  if (typeof display_order === 'number') updatePayload.display_order = display_order;

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('press_articles')
    .update({ ...updatePayload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update press article', error);
    return NextResponse.json({ error: 'Failed to update press article' }, { status: 500 });
  }

  return NextResponse.json({ article: data });
}

export async function DELETE(request: NextRequest) {
  const auth = await assertAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body as { id?: string };

  if (!id) {
    return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase admin configuration', error);
    return NextResponse.json({ error: 'Admin configuration is unavailable' }, { status: 500 });
  }

  const { error } = await supabaseAdmin.from('press_articles').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete press article', error);
    return NextResponse.json({ error: 'Failed to delete press article' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
