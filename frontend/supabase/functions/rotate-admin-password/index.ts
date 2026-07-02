import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function generatePassword(length = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((n) => chars[n % chars.length])
    .join("");
}

Deno.serve(async () => {
  const newPassword = generatePassword();
  const adminUserId = Deno.env.get("ADMIN_USER_ID")!;

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    adminUserId,
    { password: newPassword }
  );
  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Amen Bank Admin <noreply@yourverifieddomain.com>",
      to: Deno.env.get("NOTIFY_EMAIL"),
      subject: "Nouveau mot de passe administrateur — Accès à l'information",
      text: `Nom d'utilisateur : adminamenbank\nMot de passe du jour : ${newPassword}`,
    }),
  });

  if (!emailRes.ok) {
    return new Response(JSON.stringify({ error: "Email send failed" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});