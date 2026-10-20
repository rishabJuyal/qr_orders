'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const NAV = [
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
  { href: '/admin/menu', label: 'Menu', icon: '🍽️' },
  { href: '/admin/tables', label: 'Tables & QR', icon: '📷' },
];

export default function AdminShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#3b0c13] via-wine to-[#6d1622] text-white">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo light />
            <nav className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white/10 p-1.5 backdrop-blur">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                      active ? 'bg-white text-wine shadow-lg' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">{n.icon}</span>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Nidhivan Restaurant</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-white/65">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
