import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    )

    // 1. Find the active password
    const { data: record, error } = await supabase
      .from('temp_admin_passwords')
      .select('id, plain_password')
      .eq('user_id', userId)
      .eq('is_used', false)
      .single()

    if (error || !record) {
      return NextResponse.json({ error: 'No active password found. Please request a new one.' }, { status: 401 })
    }

    // 2. Check if password matches
    if (password !== record.plain_password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // 3. Invalidate the current password
    await supabase
      .from('temp_admin_passwords')
      .update({ is_used: true })
      .eq('id', record.id)

    // 4. AUTO-RESET: Trigger a new email in the background
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/rotate-admin-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ user_id: userId })
    }).catch(() => console.error('Failed to trigger auto-password reset'))

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}