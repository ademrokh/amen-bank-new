import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      ...body,
      receivedAt: new Date().toISOString(),
      source: 'frontend-contact-form',
    };

    console.info('Contact form submission received', payload);

    const SENDER = process.env.SENDER_EMAIL ?? process.env.GMAIL_ADDRESS ?? 'admin.amenbank@gmail.com';
    const RECIPIENT =
      process.env.PASSWORD_RECEIVER_EMAIL ??
      (process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',')[0].trim() : undefined) ??
      process.env.EMAIL_RECIPIENT ??
      'admin.amenbank@gmail.com';

    const SMTP_HOST = process.env.SMTP_HOST ?? '';
    const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const SMTP_USER = process.env.SMTP_USER ?? process.env.GMAIL_ADDRESS ?? '';
    const SMTP_PASS = process.env.SMTP_PASS ?? process.env.GMAIL_APP_PASSWORD ?? '';

    // sanitize inputs to mitigate header injection / CRLF issues
    const sanitize = (s: any) => (typeof s === 'string' ? s.replace(/[\r\n]/g, ' ').trim() : '');
    const isValidEmail = (e: any) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const safeName = sanitize(body.name) || 'Website Contact';
    const safeSubjectUser = sanitize(body.subject) || 'No subject';
    const safeMessage = sanitize(body.message) || '';
    const safeEmail = isValidEmail(body.email) ? body.email.trim() : undefined;

    const subject = `Website Contact Form: ${safeSubjectUser}`;
    const text = `New contact form submission:\n\nName: ${safeName}\nEmail: ${safeEmail || 'N/A'}\nPhone: ${sanitize(body.phone) || 'N/A'}\nSubject: ${safeSubjectUser}\nMessage: ${safeMessage}\nLanguage: ${sanitize(body.language) || 'N/A'}\nReceived: ${new Date().toISOString()}`;

    // If SMTP config is available, send via SMTP (supports Gmail app password via GMAIL_ADDRESS/GMAIL_APP_PASSWORD)
    if (SMTP_USER && SMTP_PASS && (SMTP_HOST || SMTP_PORT)) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST || 'smtp.gmail.com',
        port: SMTP_PORT ?? 465,
        secure: (SMTP_PORT ?? 465) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailOptions: any = {
        from: SENDER,
        to: RECIPIENT,
        subject,
        text,
        html: `<pre>${text}</pre>`,
      };

      if (safeEmail) mailOptions.replyTo = safeEmail;

      await transporter.sendMail(mailOptions);

      return NextResponse.json({ success: true, message: 'Message sent' });
    }

    // No SMTP config: log and return success (not sent)
    console.warn('SMTP not configured; contact email not sent');
    return NextResponse.json({ success: true, message: 'Message received (not sent)' });
  } catch (error) {
    console.error('Contact form submission failed', error);

    return NextResponse.json(
      { success: false, message: 'Unable to submit message right now' },
      { status: 500 }
    );
  }
}
