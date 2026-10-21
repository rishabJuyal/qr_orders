'use client';

import { useEffect, useMemo, useState } from 'react';
import { enrichMenuItem, money } from '../lib/menu';

export type NewDish = {
  name: string;
  category: string;
  price: string;
  description: string;
  available: boolean;
};

const BLANK: NewDish = { name: '', category: '', price: '', description: '', available: true };

export default function AddDishModal({
  open,
  categories,
  onClose,
  onSave,
}: {
  open: boolean;
  categories: string[];
  onClose: () => void;
  onSave: (dish: NewDish) => void;
}) {
  const [dish, setDish] = useState<NewDish>(BLANK);
  const [newCategory, setNewCategory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setDish({ ...BLANK, category: categories[0] ?? '' });
    setNewCategory(false);
    setError('');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, categories, onClose]);

  const preview = useMemo(
    () =>
      enrichMenuItem({
        id: 'preview',
        name: dish.name || 'Your new dish',
        category: dish.category || 'Indian Main Course',
        price: Number(dish.price) || 0,
        description: dish.description,
        available: dish.available,
      }),
    [dish],
  );

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dish.name.trim()) {
      setError('Please enter the dish name.');
      return;
    }
    if (!dish.category.trim()) {
      setError('Please choose or type a category.');
      return;
    }
    const price = Number(dish.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    onSave({
      name: dish.name.trim(),
      category: dish.category.trim(),
      price: String(price),
      description: dish.description.trim(),
      available: dish.available,
    });
  }

  const field =
    'w-full rounded-xl border border-[#e7d8bf] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[#b9a795] focus:border-gold focus:ring-4 focus:ring-gold/15';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#2e0a10]/50 backdrop-blur-sm" />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Add a new dish"
        className="animate-slide-up relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:animate-pop-in sm:rounded-3xl"
      >
        <header className="relative overflow-hidden bg-gradient-to-r from-[#3b0c13] via-wine to-[#6d1622] px-6 py-5 text-white">
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 texture-dots opacity-30" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">New dish</p>
              <h2 className="mt-1 text-2xl font-bold">Add to the menu</h2>
              <p className="mt-1 text-xs text-white/65">
                It shows up instantly on the customer menu for every table.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="icon-btn bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </header>

        <form onSubmit={submit} className="flex-1 overflow-y-auto">
          <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1fr_260px]">
            {/* ------------------------------- form ------------------------------- */}
            <div className="space-y-4">
              <div>
                <label htmlFor="dish-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                  Dish name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="dish-name"
                  autoFocus
                  value={dish.name}
                  onChange={(e) => setDish({ ...dish, name: e.target.value })}
                  placeholder="e.g. Special Paneer Tikka Platter"
                  className={field}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dish-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  {newCategory ? (
                    <div className="flex gap-2">
                      <input
                        id="dish-category"
                        value={dish.category}
                        onChange={(e) => setDish({ ...dish, category: e.target.value })}
                        placeholder="e.g. Chaat"
                        className={field}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory(false);
                          setDish({ ...dish, category: categories[0] ?? '' });
                        }}
                        className="btn-outline shrink-0 px-3 text-xs"
                      >
                        Pick
                      </button>
                    </div>
                  ) : (
                    <select
                      id="dish-category"
                      value={dish.category}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setNewCategory(true);
                          setDish({ ...dish, category: '' });
                        } else {
                          setDish({ ...dish, category: e.target.value });
                        }
                      }}
                      className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237a6157%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_12px_center] bg-no-repeat pr-10`}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__new__">➕ New category…</option>
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="dish-price" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                    Price <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#a07d46]">
                      ₹
                    </span>
                    <input
                      id="dish-price"
                      type="number"
                      min="1"
                      step="1"
                      value={dish.price}
                      onChange={(e) => setDish({ ...dish, price: e.target.value })}
                      placeholder="250"
                      className={`${field} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="dish-desc" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
                  Description <span className="font-normal normal-case text-[#b3a094]">(optional)</span>
                </label>
                <textarea
                  id="dish-desc"
                  rows={3}
                  maxLength={220}
                  value={dish.description}
                  onChange={(e) => setDish({ ...dish, description: e.target.value })}
                  placeholder="Charred over live coals and finished with a smoky house masala."
                  className={`${field} resize-none`}
                />
                <p className="mt-1 text-[11px] text-[#b3a094]">
                  {dish.description.length}/220 · leave blank to auto-generate one
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDish({ ...dish, available: !dish.available })}
                className="flex w-full items-center justify-between rounded-xl border border-[#e7d8bf] bg-[#fdfaf4] px-4 py-3 text-left transition-colors hover:border-gold"
              >
                <span>
                  <span className="block text-sm font-semibold text-wine">Available right now</span>
                  <span className="block text-xs text-[#9b8175]">
                    Hide it later if the kitchen runs out.
                  </span>
                </span>
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    dish.available ? 'bg-emerald-500' : 'bg-[#d9cdba]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      dish.available ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>

              {error && (
                <p role="alert" className="animate-pop-in rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}
            </div>

            {/* ------------------------------ preview ------------------------------ */}
            <aside className="lg:border-l lg:border-[#f0e4d0] lg:pl-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#a07d46]">
                Live preview
              </p>
              <article className="card overflow-hidden">
                <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${preview.gradient} text-5xl`}>
                  <span className="drop-shadow-sm">{preview.emoji}</span>
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#3b2320]">
                      <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 bg-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <span className="truncate">{preview.name}</span>
                    </h3>
                    <span className="shrink-0 text-base font-bold text-wine">{money(preview.price)}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#7d655b]">
                    {preview.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#b3a094]">
                      {preview.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        dish.available ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {dish.available ? 'Available' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </article>
              <p className="mt-3 text-[11px] leading-relaxed text-[#a99a8d]">
                This is how the dish will look on the guest’s menu. Artwork and category styling are applied
                automatically.
              </p>
            </aside>
          </div>

          <footer className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-[#f0e4d0] bg-[#fdfaf4] px-6 py-4">
            <button type="button" onClick={onClose} className="btn-outline px-5">
              Cancel
            </button>
            <button type="submit" className="btn-gold px-6">
              ＋ Add dish
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
