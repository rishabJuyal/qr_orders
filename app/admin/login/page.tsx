'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../../lib/supabase/client';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, DEMO_LOGIN_KEY, DEMO_MODE } from '../../../lib/demo';
import Logo from '../../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState(DEMO_MODE ? DEMO_ADMIN_EMAIL : '');
  const [password, setPassword] = useState(DEMO_MODE ? DEMO_ADMIN_PASSWORD : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (DEMO_MODE) {
        if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
          localStorage.setItem(DEMO_LOGIN_KEY, 'true');
          router.push('/admin/orders');
          return;
        }
        throw new Error('Incorrect email or password.');
      }
      const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/admin/orders');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#2e0a10] via-wine to-[#6d1622] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 animate-float rounded-full bg-gold/10 blur-3xl [animation-delay:2.5s]" />
        <div className="pointer-events-none absolute inset-0 texture-dots opacity-30" />

        <div className="relative">
          <Logo light size="lg" />
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight">
            Every order, <span className="text-gold">one screen.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Track live kitchen orders, update statuses in a tap, edit your menu and print table QR codes — all
            from a single dashboard.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: '🧾', title: 'Live orders', body: 'Auto-refreshing kitchen queue' },
              { icon: '🍽️', title: 'Menu control', body: 'Prices & availability in seconds' },
              { icon: '📷', title: 'QR codes', body: 'Download ready-to-print PNGs' },
              { icon: '📊', title: 'Daily totals', body: 'Revenue and order insights' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur">
                <span className="text-xl">{f.icon}</span>
                <p className="mt-2 text-sm font-semibold">{f.title}</p>
                <p className="mt-0.5 text-[11px] text-white/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          Nidhivan Restaurant · Jaipur Jhunjhunu Bypass, Sikar · 967275 8135
        </p>
      </section>

      {/* form panel */}
      <section className="flex items-center justify-center bg-cream px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <p className="eyebrow">Staff access</p>
          <h1 className="mt-1 text-3xl font-bold text-wine">Admin login</h1>
          <p className="mt-2 text-sm text-[#8b7269]">
            Sign in to manage orders, the menu and your table QR codes.
          </p>

          {DEMO_MODE && (
            <div className="mt-6 rounded-2xl border border-gold/40 bg-[#fdf6e7] p-4 text-sm">
              <p className="font-semibold text-wine">Demo credentials</p>
              <p className="mt-1.5 text-[#7a6157]">
                Email: <span className="font-mono font-semibold">{DEMO_ADMIN_EMAIL}</span>
              </p>
              <p className="text-[#7a6157]">
                Password: <span className="font-mono font-semibold">{DEMO_ADMIN_PASSWORD}</span>
              </p>
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@restaurant.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  required
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b9a795] transition-colors hover:text-wine"
                >
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="animate-pop-in rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button disabled={busy} className="btn-primary w-full py-3.5 text-base">
              {busy ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-wine underline-offset-4 hover:underline"
          >
            ← Back to the restaurant home
          </a>

          <p className="mt-6 text-xs leading-relaxed text-[#a99a8d]">
            Authorised staff only. Contact the restaurant owner if you need an account.
          </p>
        </div>
      </section>
    </main>
  );
}
