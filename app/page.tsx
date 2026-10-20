import Link from 'next/link';
import Logo from '../components/Logo';

const HIGHLIGHTS = [
  { title: 'Starters', emoji: '🥟', gradient: 'from-amber-400 to-orange-500', blurb: 'Kebabs, tikka & chaat' },
  { title: 'Paneer Main Course', emoji: '🧈', gradient: 'from-yellow-300 to-amber-500', blurb: 'Rich, melt-in-mouth gravies' },
  { title: 'Rice', emoji: '🍚', gradient: 'from-amber-300 to-yellow-500', blurb: 'Biryani & pulao' },
  { title: 'Indian Thali', emoji: '🍱', gradient: 'from-purple-400 to-pink-500', blurb: 'A complete meal' },
  { title: 'Fast Food', emoji: '🍔', gradient: 'from-orange-400 to-rose-500', blurb: 'Burgers, momos & pasta' },
  { title: 'Beverages & Ice Cream', emoji: '🥤', gradient: 'from-sky-400 to-cyan-500', blurb: 'Shakes & cold coffee' },
];

const FEATURES = [
  { icon: '🌿', label: '100% Pure Veg' },
  { icon: '⚡', label: 'Instant QR ordering' },
  { icon: '📡', label: 'Live order tracking' },
  { icon: '💳', label: 'Pay at counter' },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#2e0a10] via-wine to-[#6d1622] text-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-24 h-80 w-80 animate-float rounded-full bg-[#d9b86c]/10 blur-3xl [animation-delay:2s]" />
      <div className="pointer-events-none absolute inset-0 texture-dots opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        <header className="flex items-center justify-between gap-4">
          <Logo light />
          <Link
            href="/admin/login"
            className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white/85 transition-all hover:border-gold hover:text-gold"
          >
            Admin
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-14 text-center">
          <span className="animate-fade-up rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Scan · Choose · Enjoy
          </span>
          <h1
            className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl"
            style={{ animationDelay: '60ms' }}
          >
            The flavour of <span className="text-gold">Nidhivan</span>,
            <br className="hidden sm:block" /> now on your phone.
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-base text-white/70 sm:text-lg"
            style={{ animationDelay: '120ms' }}
          >
            A pure vegetarian kitchen on Jaipur Jhunjhunu Bypass, Sikar. Scan the table QR, browse the full
            menu and order in seconds — then track your food from the kitchen to your table.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '180ms' }}
          >
            <Link href="/menu/table-01" className="btn-gold px-8 py-4 text-base shadow-2xl shadow-[#c9a253]/30">
              🍽️ Preview the menu
            </Link>
            <Link
              href="/admin/login"
              className="rounded-xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-gold hover:bg-white/5"
            >
              Restaurant dashboard
            </Link>
          </div>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-2.5"
            style={{ animationDelay: '240ms' }}
          >
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-medium text-white/85 backdrop-blur"
              >
                <span>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </section>

        <section className="animate-fade-up pb-4" style={{ animationDelay: '300ms' }}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">From the kitchen</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Explore by category</h2>
            </div>
            <Link href="/menu/table-01" className="hidden text-sm font-semibold text-gold hover:underline sm:block">
              View full menu →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {HIGHLIGHTS.map((h) => (
              <Link
                key={h.title}
                href="/menu/table-01"
                className="group rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/[0.12]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${h.gradient} text-xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {h.emoji}
                </span>
                <p className="mt-3 text-sm font-semibold leading-tight">{h.title}</p>
                <p className="mt-1 text-[11px] text-white/55">{h.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Nidhivan Restaurant · Jaipur Jhunjhunu Bypass, Sikar</p>
          <p>
            Assistance:{' '}
            <a href="tel:9672758135" className="font-semibold text-white/70 hover:text-gold">
              967275 8135
            </a>{' '}
            · Payment at the restaurant
          </p>
        </footer>
      </div>
    </main>
  );
}
