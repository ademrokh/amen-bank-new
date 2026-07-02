import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminMatch = pathname.match(/^\/(fr|en|ar)\/admin\/(login|acces-information)(?:\/|$)/);

  if (!adminMatch) {
    return NextResponse.next();
  }

  const [, locale, route] = adminMatch;

  if (route === 'login') {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op for read-only middleware checks.
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user?.email) {
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    const loginUrl = new URL(`/${locale}/admin/login?error=unauthorized`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/:locale/admin/:path*'],
};
