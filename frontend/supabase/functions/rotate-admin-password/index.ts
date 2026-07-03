import { createClient } from 'jsr:@supabase/supabase-js@2.110.0'
import nodemailer from 'npm:nodemailer@6.10.0'

const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || 'https://afjtwgekoqzfwmgoiwoy.supabase.co'
const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Deno.env.get('GMAIL_ADDRESS'),
    pass: Deno.env.get('GMAIL_APP_PASSWORD'),
  },
})

Deno.serve(async (req) => {
  if (!req) {
    return new Response(JSON.stringify({ error: 'Request is undefined' }), { status: 500 })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const { user_id, pre_generated_password } = await req.json()

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 })
    }

    // Use pre-generated password if provided, otherwise generate new one
    const newPassword = pre_generated_password || Math.random().toString(36).slice(-8)

    // Only try to invalidate old passwords if not using pre-generated password
    if (!pre_generated_password) {
      try {
        await supabase
          .from('temp_admin_passwords')
          .update({ is_used: true })
          .eq('user_id', user_id)
          .eq('is_used', false)
      } catch (err) {
        console.warn('Failed to invalidate old passwords:', err)
      }
    }

    // Get user email from Auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id)
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // Send email with the fancy template, icon, and new name
    await transporter.sendMail({
      from: `"Amen Bank Admin Password System" <${Deno.env.get('GMAIL_ADDRESS')}>`,
      to: userData.user.email,
      subject: '🔐 Here is your new access password',
      html: `
        <div style="background-color: #0f172a; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <!-- CONTAINER -->
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            
            <!-- HEADER with your icon -->
            <div style="background-color: #2563eb; padding: 30px 40px; text-align: center;">
              <!-- YOUR ICON IS HERE -->
              <img src="https://play-lh.googleusercontent.com/x72cxitewrG-e8cxDIYLKL6Ti39eTq7IWZ4XMCwn-YsoNHbA_jUTZGIn95UcImI5oBKq78SMB5FVxDmrutJfIQ" alt="Amen Bank Icon" style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
                Security Update
              </h1>
              <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">
                Your temporary credentials are ready
              </p>
            </div>

            <!-- BODY -->
            <div style="padding: 40px;">
              <p style="color: #334155; font-size: 16px; line-height: 1.5; margin: 0 0 25px 0;">
                Hello, your system access password has been rotated. Use the code below to log in. 
                <strong>This password will expire immediately after one use.</strong>
              </p>

              <!-- THE PASSWORD BOX -->
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px 0; font-weight: bold;">
                  One-Time Password
                </p>
                <p style="color: #0f172a; font-size: 32px; font-weight: 800; letter-spacing: 4px; margin: 0; font-family: 'Courier New', Courier, monospace;">
                  ${newPassword}
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
                If you did not commit this login attempt, check the safety of your account.<br>
                © ${new Date().getFullYear()} Amen Bank.
              </p>
            </div>

          </div>
        </div>
      `
    })

    // Try to save to DB, but don't fail if RLS blocks it
    if (!pre_generated_password) {
      try {
        await supabase
          .from('temp_admin_passwords')
          .insert({ user_id: user_id, plain_password: newPassword, is_used: false })
      } catch (err) {
        console.warn('Failed to save password to database:', err)
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})