import { NextResponse } from 'next/server';
import { findActiveAdminPassword, rotateAdminPasswordEntry } from '../helpers';

const ADMIN_ID_MAP: Record<string, string> = {
  adminamenbank: 'b2e91d6d-d391-408a-a6bc-61f575eaf375',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Accept either an explicit username or default to the only admin
    const username: string = body.username ?? 'adminamenbank';
    const password: string = body.password ?? '';

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const userId = ADMIN_ID_MAP[username];
    if (!userId) {
      // Return the same message to avoid username enumeration
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const record = await findActiveAdminPassword(userId);

    if (!record) {
      return NextResponse.json(
        { error: 'No active password found. Click "Send me a new password" to get one.' },
        { status: 401 }
      );
    }

    if (password !== record.plain_password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Mark password as used (one-time use)
    await rotateAdminPasswordEntry(userId).catch((err) => {
      console.warn('Failed to mark password as used — login still succeeds:', err);
    });

    const response = NextResponse.json({ success: true });
    
    // FIX: Next.js 15/16 requires positional arguments for cookies.set
    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}