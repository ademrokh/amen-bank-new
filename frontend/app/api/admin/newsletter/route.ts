import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

type Language = 'fr' | 'en' | 'ar';

interface Article {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_ar: string;
  category: string;
  published_at: string;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, { auth: { persistSession: false } });
}

function getTransporter() {
  const host = process.env.SMTP_HOST ?? 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER ?? process.env.GMAIL_ADDRESS ?? '';
  const pass = process.env.SMTP_PASS ?? process.env.GMAIL_APP_PASSWORD ?? '';

  if (!user || !pass) throw new Error('SMTP credentials not configured');

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildEmailHtml(article: Article, lang: Language): string {
  const title =
    lang === 'en' ? article.title_en :
    lang === 'ar' ? article.title_ar :
    article.title_fr;

  const excerpt =
    lang === 'en' ? article.excerpt_en :
    lang === 'ar' ? article.excerpt_ar :
    article.excerpt_fr;

  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const labels = {
    fr: { greeting: 'Bonjour,', cta: "Lire l'article", footer: "Vous recevez cet email car vous êtes abonné à la newsletter Amen Bank.", news: 'Actualités', category: 'Catégorie' },
    en: { greeting: 'Hello,', cta: 'Read the article', footer: 'You are receiving this email because you subscribed to the Amen Bank newsletter.', news: 'News', category: 'Category' },
    ar: { greeting: 'مرحباً،', cta: 'اقرأ المقال', footer: 'تلقيت هذا البريد لأنك مشترك في نشرة بنك آمن الإخبارية.', news: 'أخبار', category: 'الفئة' },
  };

  const l = labels[lang];

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#003DA5;padding:28px 40px;" dir="${dir}">
              <span style="color:#ffffff;font-size:22px;font-weight:700;">Amen Bank</span>
              <span style="display:block;color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px;">${l.news}</span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 0;" dir="${dir}">
              <span style="display:inline-block;background:rgba(0,61,165,0.1);color:#003DA5;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;border-radius:999px;">
                ${l.category}: ${article.category}
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 0;" dir="${dir}">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#0f172a;line-height:1.35;">${title}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 0;" dir="${dir}">
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.7;">${excerpt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px;" dir="${dir}">
              <a href="https://amenbank.com.tn/${lang}/actualites"
                style="display:inline-block;background:#006B3C;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:999px;">
                ${l.cta}
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;" dir="${dir}">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">${l.footer}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// POST /api/admin/newsletter/notify
// Body: { articleId: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articleId: string = typeof body.articleId === 'string' ? body.articleId.trim() : '';

    if (!articleId) {
      return NextResponse.json({ success: false, message: 'articleId is required.' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Fetch the article
    const { data: article, error: artError } = await supabase
      .from('press_articles')
      .select('id, title_fr, title_en, title_ar, excerpt_fr, excerpt_en, excerpt_ar, category, published_at')
      .eq('id', articleId)
      .eq('is_published', true)
      .single();

    if (artError || !article) {
      return NextResponse.json({ success: false, message: 'Article not found or not published.' }, { status: 404 });
    }

    // Fetch all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, language')
      .eq('is_active', true);

    if (subError) {
      console.error('[notify] subscribers fetch error:', subError);
      return NextResponse.json({ success: false, message: 'Failed to fetch subscribers.' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'No active subscribers.' });
    }

    const transporter = getTransporter();
    const sender = process.env.SENDER_EMAIL ?? process.env.GMAIL_ADDRESS ?? 'admin.amenbank@gmail.com';

    const subjectByLang: Record<Language, string> = {
      fr: `Amen Bank Actualités — ${article.title_fr}`,
      en: `Amen Bank News — ${article.title_en}`,
      ar: `أخبار بنك آمن — ${article.title_ar}`,
    };

    let sent = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      const lang: Language = (['fr', 'en', 'ar'].includes(sub.language) ? sub.language : 'fr') as Language;
      try {
        await transporter.sendMail({
          from: sender,
          to: sub.email,
          subject: subjectByLang[lang],
          html: buildEmailHtml(article as Article, lang),
        });
        sent++;
      } catch (e) {
        errors.push(`${sub.email}: ${(e as Error).message}`);
      }
    }

    console.log(`[notify] Sent: ${sent}, Errors: ${errors.length}`);

    return NextResponse.json({
      success: true,
      sent,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('[notify] Fatal error:', err);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}