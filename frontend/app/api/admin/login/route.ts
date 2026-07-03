import { NextResponse } from 'next/server'
import { findActiveAdminPassword, rotateAdminPasswordEntry } from '../helpers'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const ADMIN_ID_MAP: Record<string, string> = {
      adminamenbank: 'b2e91d6d-d391-408a-a6bc-61f575eaf375', 
    }

    const userId = ADMIN_ID_MAP[username]
    if (!userId) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 401 })
    }

    const record = await findActiveAdminPassword(userId)

    if (!record) {
      return NextResponse.json({ error: 'No active password found. Please request a new one.' }, { status: 401 })
    }

    if (password !== record.plain_password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    await rotateAdminPasswordEntry(userId)

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'admin_session',
      value: 'true',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
    });

    return response

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}