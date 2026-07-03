'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Language = 'fr' | 'ar' | 'en';

interface AdminLoginPageProps {
  params: Promise<{ lang: Language }>;
}

// Hardcoded Admin UUID
const ADMIN_ID_MAP = {
  adminamenbank: 'b2e91d6d-d391-408a-a6bc-61f575eaf375', 
};

export default function AdminLoginPage({ params }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const router = useRouter();

  async function handleResetPassword() {
    setIsResetting(true);
    setErrorMessage(null);
    setRequestMessage(null);

    const userId = ADMIN_ID_MAP[username as keyof typeof ADMIN_ID_MAP];
    if (!userId) {
      setRequestMessage('Invalid username.');
      setIsResetting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/rotate-admin-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (res.ok) {
        setRequestMessage('Previous password invalidated. New password sent to thesg103@gmail.com!');
      } else {
        setRequestMessage('Failed to reset password.');
      }
    } catch {
      setRequestMessage('An error occurred.');
    } finally {
      setIsResetting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setRequestMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/fr/admin/acces-information');
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch {
      setErrorMessage('An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
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
            
            <div className="flex gap-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="flex-1 rounded-2xl border border-border px-4 py-3"
              />
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting || !username}
                className="whitespace-nowrap rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResetting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            {requestMessage && (
              <p className={`mt-2 rounded-2xl border p-3 text-sm ${
                requestMessage.includes('sent') 
                  ? 'border-green-200 bg-green-50 text-green-800' 
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                {requestMessage}
              </p>
            )}
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