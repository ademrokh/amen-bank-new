import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_SESSION_COOKIE = 'admin_session';
const PASSWORD_STORE_PATH = path.join(process.cwd(), '.admin-password-store.json');

type AdminPasswordRecord = {
  id: string;
  user_id: string;
  plain_password: string;
  is_used: boolean;
};

type PasswordStore = Record<string, AdminPasswordRecord[]>;

async function readPasswordStore(): Promise<PasswordStore> {
  try {
    const raw = await fs.readFile(PASSWORD_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return {};
    }

    console.error('Failed to read admin password store', error);
    return {};
  }
}

async function writePasswordStore(store: PasswordStore): Promise<void> {
  await fs.mkdir(path.dirname(PASSWORD_STORE_PATH), { recursive: true });
  await fs.writeFile(PASSWORD_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role key is not configured.');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function findActiveAdminPassword(userId: string): Promise<AdminPasswordRecord | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    try {
      const supabase = createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await supabase
        .from('temp_admin_passwords')
        .select('id, user_id, plain_password, is_used')
        .eq('user_id', userId)
        .eq('is_used', false)
        .maybeSingle();

      if (!error && data) {
        return data as AdminPasswordRecord;
      }
    } catch (error) {
      console.error('Supabase password lookup failed', error);
    }
  }

  const store = await readPasswordStore();
  return store[userId]?.find((entry) => !entry.is_used) ?? null;
}

export async function rotateAdminPasswordEntry(userId: string): Promise<string> {
  const plainPassword = Math.random().toString(36).slice(-8);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    try {
      const supabase = createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      await supabase
        .from('temp_admin_passwords')
        .update({ is_used: true })
        .eq('user_id', userId)
        .eq('is_used', false);

      const { error: dbError } = await supabase
        .from('temp_admin_passwords')
        .insert({ user_id: userId, plain_password: plainPassword, is_used: false });

      if (!dbError) {
        return plainPassword;
      }
    } catch (error) {
      console.error('Supabase password rotation failed', error);
    }
  }

  const store = await readPasswordStore();
  const existingEntries = store[userId] ?? [];
  store[userId] = [
    ...existingEntries.map((entry) => ({ ...entry, is_used: true })),
    {
      id: `${userId}-${Date.now()}`,
      user_id: userId,
      plain_password: plainPassword,
      is_used: false,
    },
  ];

  await writePasswordStore(store);
  return plainPassword;
}

export function isAuthorizedEmail(email?: string): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

export async function assertAdmin(request: NextRequest) {
  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === 'true';
  if (adminSession) {
    return { authorized: true, session: null as null, error: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user?.email) {
    return { authorized: false, session: null as null, error: 'Unauthorized' };
  }

  if (!isAuthorizedEmail(session.user.email)) {
    return { authorized: false, session: null as null, error: 'Unauthorized' };
  }

  return { authorized: true, session, error: null };
}

export function buildPublicUrl(filePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${encodeURIComponent(filePath)}`;
}

export async function checkAdminStatus(request: Request): Promise<boolean> {
  // Standard Request object doesn't have .cookies, so we parse the Cookie header directly
  const cookieHeader = request.headers.get('cookie') ?? '';
  return cookieHeader.includes('admin_session=true');
}