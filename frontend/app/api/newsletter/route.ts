import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: string = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const language: string = typeof body.language === 'string' ? body.language.trim() : 'fr';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, language });

    if (error) {
      // Postgres unique violation code
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Cet email est déjà inscrit.' },
          { status: 409 }
        );
      }
      console.error('[newsletter] Supabase insert error:', error);
      return NextResponse.json(
        { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Inscription réussie.' });
  } catch (err) {
    console.error('[newsletter] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}