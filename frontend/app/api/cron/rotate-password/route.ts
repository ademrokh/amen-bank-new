import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/rotate-admin-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      // Hardcoded directly to your UUID
      body: JSON.stringify({ user_id: 'b2e91d6d-d391-408a-a6bc-61f575eaf375' }) 
    })

    return NextResponse.json({ success: true, message: 'Password rotated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger rotation' }, { status: 500 })
  }
}