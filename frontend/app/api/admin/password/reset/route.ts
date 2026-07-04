import { NextResponse } from 'next/server';
import { resolveAdminUserId, rotateAdminPassword } from './service';

async function sendPasswordResetEmail(userId: string, plainPassword: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      console.error('Missing env vars:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!anonKey,
      });
      return;
    }

    const res = await fetch(`${supabaseUrl}/functions/v1/rotate-admin-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ 
        user_id: userId, 
        pre_generated_password: plainPassword 
      }),
    });

    if (!res.ok) {
      const error = await res.text().catch(() => 'Unknown error');
      console.error(`Email function failed: ${res.status}`, error);
    } else {
      console.log('Password email sent successfully');
    }
  } catch (error) {
    console.error('Error triggering password reset email:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const userId = resolveAdminUserId(username);

    if (!userId) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const result = await rotateAdminPassword(userId);

    await sendPasswordResetEmail(userId, result.password);

    return NextResponse.json({
      success: true,
      message: `New temporary password has been generated.`,
      password: result.password,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reset password';
    console.error('Reset password error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}