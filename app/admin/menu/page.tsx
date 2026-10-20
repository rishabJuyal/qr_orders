'use client';

import { useEffect, useMemo, useState } from 'react';
import seed from '../../../data/menu.json';
import { enrichMenuItem, money } from '../../../lib/menu';
import { supabaseBrowser } from '../../../lib/supabase/client';
import { DEMO_MODE, DEMO_MENU_KEY } from '../../../lib/demo';
import AdminShell from '../../../components/AdminShell';

export default function ManageMenu() {
  const [items, setItems] = useState<any[]>(seed as any[]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    if (DEMO_MODE) {
      try {
        const saved = localStorage.getItem(DEMO_MENU_KEY);
        if (saved) setItems(JSON.parse(saved));
      } catch {
        /* keep seed */
      }
      return;
    }
    (async () => {
      const { data, error } = await supabaseBrowser()
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name');
      if (data?.length) setItems(data.map((x: any) => ({ ...x, available: x.is_available })));
      if (error) {
        setMsg(error.message);
        setMsgType('error');
      }
    })();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((x) => x.category)))],
    [items],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (x) =>
        (category === 'All' || x.category === category) &&
        (!q || String(x.name).toLowerCase().includes(q)),
    );
  }, [items, category, search]);

  const stats = useMemo(
    () => ({
      total: items.length,
      unavailable: items.filter((x) => !(x.available ?? x.is_available ?? true)).length,
      avg: items.length ? items.reduce((s, x) => s + Number(x.price || 0), 0) / items.length : 0,
    }),
    [items],
  );

  function patch(id: string, next: any) {
    setItems((list) => list.map((v) => (v.id === id ? { ...v, ...next } : v)));
  }

  async function save(x: any) {
    if (DEMO_MODE) {
      const updated = items.map((v) => (v.id === x.id ? { ...x, price: Number(x.price) } : v));
      setItems(updated);
      localStorage.setItem(DEMO_MENU_KEY, JSON.stringify(updated));
      setMsg(`Saved “${x.name}”.`);
      setMsgType('success');
      return;
    }
    const { error } = await supabaseBrowser().from('menu_items').upsert({
      id: String(x.id).startsWith('seed-') ? undefined : x.id,
      name: String(x.name).slice(0, 120),
      category: String(x.category).slice(0, 80),
      price: Number(x.price),
      is_available: x.available ?? x.is_available ?? true,
    });
    setMsg(error ? error.message : `Saved “${x.name}”.`);
    setMsgType(error ? 'error' : 'success');
  }

  return (
    <AdminShell
      title="Manage menu"
      subtitle="Edit names and prices, then save each row"
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Menu items', value: stats.total, tone: 'bg-[#f7efe1]' },
          { label: 'Categories', value: categories.length - 1, tone: 'bg-amber-50' },
          { label: 'Unavailable', value: stats.unavailable, tone: 'bg-rose-50' },
          { label: 'Average price', value: money(Math.round(stats.avg)), tone: 'bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a07d46]">{s.label}</p>
              <span className={`h-2.5 w-2.5 rounded-full ${s.tone}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-wine">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                category === c
                  ? 'bg-wine text-white shadow-lg shadow-wine/25'
                  : 'border border-[#e7d8bf] bg-white text-[#7a6157] hover:border-gold hover:text-wine'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes…"
            className="input pl-9"
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b9a795]">🔍</span>
        </div>
      </div>

      {msg && (
        <p
          role="status"
          className={`mb-4 animate-pop-in rounded-xl border p-3 text-sm ${
            msgType === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {msg}
        </p>
      )}

      <div className="space-y-2">
        {visible.map((x, i) => {
          const meta = enrichMenuItem(x);
          return (
            <div
              key={x.id}
              className="card animate-fade-up grid gap-2.5 p-3.5 sm:grid-cols-[auto_1fr_1fr_110px_auto] sm:items-center"
              style={{ animationDelay: `${Math.min(i, 10) * 25}ms` }}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-xl shadow-sm`}
              >
                {meta.emoji}
              </span>
              <input
                aria-label="Name"
                value={x.name}
                onChange={(e) => patch(x.id, { name: e.target.value })}
                className="input py-2 text-sm"
              />
              <input
                aria-label="Category"
                value={x.category}
                onChange={(e) => patch(x.id, { category: e.target.value })}
                className="input py-2 text-sm"
              />
              <input
                aria-label="Price"
                type="number"
                min="0"
                value={x.price}
                onChange={(e) => patch(x.id, { price: e.target.value })}
                className="input py-2 text-sm"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => patch(x.id, { available: !(x.available ?? x.is_available ?? true) })}
                  title="Toggle availability"
                  className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                    x.available ?? x.is_available ?? true
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {x.available ?? x.is_available ?? true ? 'Available' : 'Hidden'}
                </button>
                <button onClick={() => save(x)} className="btn-primary px-4 py-2 text-xs">
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="card mt-4 px-6 py-14 text-center text-sm text-[#8b7269]">
          No dishes match your search.
        </div>
      )}
    </AdminShell>
  );
}
