'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, RefreshCw, LogIn, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

// The only admin user — username is fixed, never shown to the user
const ADMIN_USERNAME = 'adminamenbank';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const locale = (params as { lang?: string })?.lang ?? 'fr';

  async function handleResetPassword() {
    setIsResetting(true);
    setResetStatus(null);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ADMIN_USERNAME }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setResetStatus({
          type: 'success',
          message: 'A new temporary password has been sent to the admin email address.',
        });
      } else {
        setResetStatus({
          type: 'error',
          message: data.error || 'Failed to send reset email. Check Supabase edge function logs.',
        });
      }
    } catch {
      setResetStatus({
        type: 'error',
        message: 'Network error — could not reach the server.',
      });
    } finally {
      setIsResetting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setLoginError(null);
    setResetStatus(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ADMIN_USERNAME, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push(`/${locale}/admin/acces-information`);
      } else {
        setLoginError(data.error || 'Invalid password. Request a new one below.');
        setPassword('');
      }
    } catch {
      setLoginError('Network error — could not reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#f8fafc' }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* ── Logo / Brand ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#0f172a',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Lock size={22} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.375rem' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Amen Bank — restricted access
          </p>
        </div>

        {/* ── Card ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 16px -4px rgba(15,23,42,0.08)',
          }}
        >
          <form onSubmit={handleSubmit}>

            {/* Password field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}
              >
                One-time password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your temporary password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: `1px solid ${loginError ? '#fca5a5' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    color: '#0f172a',
                    outline: 'none',
                    background: loginError ? '#fef2f2' : '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {loginError && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertCircle size={14} /> {loginError}
                </p>
              )}
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              style={{
                width: '100%',
                padding: '0.8125rem',
                background: isSubmitting || !password.trim() ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: isSubmitting || !password.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
                transition: 'background 0.15s ease',
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '1.5rem 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
              no password?
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Request new password */}
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isResetting}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              color: isResetting ? '#94a3b8' : '#003DA5',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isResetting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isResetting) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#003DA5';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
            }}
          >
            {isResetting ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Sending…
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Send me a new password
              </>
            )}
          </button>

          {/* Reset status */}
          {resetStatus && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                background: resetStatus.type === 'success' ? '#f0fdf4' : resetStatus.type === 'error' ? '#fef2f2' : '#eff6ff',
                border: `1px solid ${resetStatus.type === 'success' ? '#bbf7d0' : resetStatus.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
              }}
            >
              {resetStatus.type === 'success' ? (
                <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
              ) : (
                <AlertCircle size={16} color={resetStatus.type === 'error' ? '#dc2626' : '#2563eb'} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
              )}
              <p style={{
                fontSize: '0.8125rem',
                color: resetStatus.type === 'success' ? '#166534' : resetStatus.type === 'error' ? '#991b1b' : '#1e40af',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {resetStatus.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>
          Passwords are single-use and expire after login.
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}