'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

type Language = 'fr' | 'ar' | 'en';

interface AdminLoginPageProps {
  params: Promise<{ lang: Language }>;
}

const ADMIN_EMAIL_MAP = {
  adminamenbank: 'adminamenbank@internal.amenbank',
};

export default function AdminLoginPage({ params }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );

    const email = ADMIN_EMAIL_MAP[username as keyof typeof ADMIN_EMAIL_MAP] ?? username;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/fr/admin/acces-information');
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-24">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-h2 text-ink">Admin access</h1>
        <p className="mt-3 text-ink-secondary">Sign in to manage access-to-information documents.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-ink">Username</label>
            <input
              id="username"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-2xl border border-border px-4 py-3"
              placeholder="adminamenbank"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-2xl border border-border px-4 py-3"
            />
          </div>
          {errorMessage && <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{errorMessage}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-ink px-4 py-3 font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
