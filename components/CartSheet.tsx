'use client';

import { useEffect } from 'react';
import { MenuItem, money } from '../lib/menu';

export type CartLine = { item: MenuItem; qty: number };

export default function CartSheet({
  open,
  onClose,
  lines,
  total,
  note,
  onNoteChange,
  onChangeQty,
  onSubmit,
  busy,
  message,
  tableId,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  total: number;
  note: string;
  onNoteChange: (value: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSubmit: () => void;
  busy: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  tableId: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-[#2e0a10]/45 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="animate-slide-up relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:animate-pop-in sm:rounded-3xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#f0e4d0] bg-gradient-to-r from-wine to-[#6d1622] px-5 py-4 text-white">
          <div>
            <h2 className="text-lg font-bold">Your order</h2>
            <p className="text-xs text-white/70">
              {itemCount} item{itemCount === 1 ? '' : 's'} · Table {tableId}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="icon-btn bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#9b8175]">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-xl`}
                  >
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#3b2320]">{item.name}</p>
                    <p className="text-xs text-[#9b8175]">
                      {money(item.price)} · {money(item.price * qty)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-xl border border-gold/60 bg-[#fdf6e7] p-1">
                    <button
                      onClick={() => onChangeQty(item.id, -1)}
                      aria-label={`Remove one ${item.name}`}
                      className="h-7 w-7 rounded-lg text-base font-bold leading-none text-wine hover:bg-gold/25"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-sm font-bold text-wine">{qty}</span>
                    <button
                      onClick={() => onChangeQty(item.id, 1)}
                      aria-label={`Add one ${item.name}`}
                      className="h-7 w-7 rounded-lg bg-wine text-sm font-bold leading-none text-white hover:bg-[#5c1621]"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <label htmlFor="order-note" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
              Note for the kitchen
            </label>
            <textarea
              id="order-note"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="e.g. less spicy, Jain preparation, extra chutney"
              className="input resize-none"
            />
          </div>

          {message && (
            <div
              role="status"
              className={`mt-4 animate-pop-in rounded-xl border p-3 text-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <footer className="border-t border-[#f0e4d0] bg-[#fdfaf4] px-5 py-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#a07d46]">Total payable</p>
              <p className="text-2xl font-bold text-wine">{money(total)}</p>
            </div>
            <p className="text-right text-[11px] leading-tight text-[#9b8175]">
              Pay at the
              <br />
              restaurant counter
            </p>
          </div>
          <button disabled={busy || lines.length === 0} onClick={onSubmit} className="btn-gold w-full py-3.5 text-base">
            {busy ? 'Placing your order…' : `Place order · ${money(total)}`}
          </button>
        </footer>
      </section>
    </div>
  );
}
