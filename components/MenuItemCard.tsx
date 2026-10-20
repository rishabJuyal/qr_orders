'use client';

import { MenuItem, money, SPICE_LABELS } from '../lib/menu';

function SpiceMeter({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-0.5" title={`Spice level: ${SPICE_LABELS[level]}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`text-[11px] ${i <= level ? 'opacity-100' : 'opacity-25'}`}>
          🌶️
        </span>
      ))}
      <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-[#a98d7f]">
        {SPICE_LABELS[level]}
      </span>
    </span>
  );
}

function Stepper({
  qty,
  onChange,
  id,
  name,
}: {
  qty: number;
  onChange: (id: string, delta: number) => void;
  id: string;
  name: string;
}) {
  if (qty <= 0) {
    return (
      <button
        onClick={() => onChange(id, 1)}
        aria-label={`Add ${name} to cart`}
        className="group inline-flex h-9 shrink-0 items-center gap-1 rounded-xl bg-wine px-3 text-[13px] font-bold text-white shadow-lg shadow-wine/25 transition-all duration-200 hover:bg-[#5c1621] active:scale-95 sm:h-10 sm:gap-1.5 sm:px-3.5 sm:text-sm"
      >
        <span className="text-base leading-none transition-transform duration-200 group-hover:rotate-90">
          +
        </span>
        Add
      </button>
    );
  }
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-gold/60 bg-[#fdf6e7] p-1">
      <button
        onClick={() => onChange(id, -1)}
        aria-label={`Remove one ${name}`}
        className="h-8 w-8 rounded-lg text-lg font-bold leading-none text-wine transition-colors hover:bg-gold/25"
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-wine">{qty}</span>
      <button
        onClick={() => onChange(id, 1)}
        aria-label={`Add one ${name}`}
        className="h-8 w-8 rounded-lg bg-wine text-base font-bold leading-none text-white transition-colors hover:bg-[#5c1621]"
      >
        +
      </button>
    </div>
  );
}

export default function MenuItemCard({
  item,
  qty,
  onChange,
  index = 0,
}: {
  item: MenuItem;
  qty: number;
  onChange: (id: string, delta: number) => void;
  index?: number;
}) {
  return (
    <article
      className="card card-hover animate-fade-up group relative flex w-full min-w-0 gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4"
      style={{ animationDelay: `${Math.min(index, 11) * 35}ms` }}
    >
      <div
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-2xl shadow-lg shadow-black/10 sm:h-24 sm:w-24 sm:text-4xl`}
      >
        <span className="drop-shadow-sm transition-transform duration-300 group-hover:scale-110">{item.emoji}</span>
        {item.popular && (
          <span className="absolute -right-1.5 -top-1.5 rounded-full bg-wine px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold shadow-md">
            ★ Popular
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-[15px] font-semibold leading-snug text-[#3b2320] sm:text-base">
              <span
                className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 bg-white"
                title="Pure vegetarian"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
              <span className="min-w-0 truncate">{item.name}</span>
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#9b8175]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#b8863f]">
                ★ {item.rating.toFixed(1)}
                <span className="font-normal text-[#b3a094]">({item.reviews})</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-[#ddc9b4]" />
              <span>{item.prepMins} min</span>
              {item.spicy > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#ddc9b4]" />
                  <SpiceMeter level={item.spicy} />
                </>
              )}
            </div>
          </div>
          <p className="shrink-0 text-base font-bold text-wine sm:text-lg">{money(item.price)}</p>
        </div>

        <p className="mt-1.5 w-full min-w-0 line-clamp-2 break-words text-[13px] leading-relaxed text-[#7d655b]">
          {item.description}
        </p>

        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  tag === 'Bestseller'
                    ? 'bg-[#fdf1dc] text-[#a97c2c]'
                    : tag === 'New'
                    ? 'bg-emerald-50 text-emerald-700'
                    : tag === "Chef's Special"
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-[#f4f0ea] text-[#8a7269]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#b3a094]">{item.category}</span>
          <span className="ml-auto shrink-0">
            <Stepper qty={qty} onChange={onChange} id={item.id} name={item.name} />
          </span>
        </div>
      </div>
    </article>
  );
}
