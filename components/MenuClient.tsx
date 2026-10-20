'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { enrichMenuItem, fallbackMenu, money, MenuItem } from '../lib/menu';
import { DEMO_MODE, DEMO_ORDERS_KEY } from '../lib/demo';
import { ensureDemoOrders, readDemoOrders } from '../lib/demo-store';
import { getCustomerRef } from '../lib/customer';
import MenuItemCard from './MenuItemCard';
import CartSheet from './CartSheet';
import MyOrders, { MyOrder } from './MyOrders';
import Logo from './Logo';

const SAMPLE_REF = 'demo-sample';

export default function MenuClient({ tableId }: { tableId: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenu);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [tab, setTab] = useState<'menu' | 'orders'>('menu');
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const customerRef = useRef<string>('');

  /* ------------------------------- menu loading ------------------------------ */
  useEffect(() => {
    if (DEMO_MODE) {
      try {
        const saved = localStorage.getItem('nidhivan_demo_menu');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length) setMenuItems(parsed.map(enrichMenuItem));
        }
      } catch {
        /* keep the bundled menu */
      }
      return;
    }
    fetch('/api/menu')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.items) && d.items.length) {
          setMenuItems(
            d.items
              .map((x: any) => enrichMenuItem({ ...x, available: x.available ?? x.is_available ?? true }))
              .filter((x: any) => x.available),
          );
        }
      })
      .catch(() => {});
  }, []);

  /* ----------------------------- customer identity ---------------------------- */
  useEffect(() => {
    customerRef.current = getCustomerRef();
  }, []);

  /* -------------------------------- order history ----------------------------- */
  const loadOrders = useCallback(async () => {
    const ref = customerRef.current;
    if (DEMO_MODE) {
      const all = ensureDemoOrders();
      const mine = all.filter((o) => o.customer_ref === ref || o.customer_ref === SAMPLE_REF);
      setOrders(
        mine
          .slice()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((o) => ({ ...o, order_items: o.order_items || [] })) as MyOrder[],
      );
      setOrdersLoading(false);
      return;
    }
    if (!ref) {
      setOrdersLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders?ref=${encodeURIComponent(ref)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    if (DEMO_MODE) {
      const timer = window.setInterval(loadOrders, 4000);
      const onStorage = (e: StorageEvent) => {
        if (e.key === DEMO_ORDERS_KEY) loadOrders();
      };
      window.addEventListener('storage', onStorage);
      return () => {
        window.clearInterval(timer);
        window.removeEventListener('storage', onStorage);
      };
    }
    const timer = window.setInterval(loadOrders, 20000);
    return () => window.clearInterval(timer);
  }, [loadOrders]);

  /* ------------------------------------ toast --------------------------------- */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ----------------------------------- helpers -------------------------------- */
  const liveCategories = useMemo(
    () => ['All', ...Array.from(new Set(menuItems.map((x) => x.category)))],
    [menuItems],
  );

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menuItems.filter(
      (x) =>
        (category === 'All' || x.category === category) &&
        (!q || x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q)),
    );
  }, [menuItems, category, search]);

  const lines = useMemo(
    () =>
      menuItems
        .filter((x) => (cart[x.id] || 0) > 0)
        .map((item) => ({ item, qty: cart[item.id] })),
    [menuItems, cart],
  );

  const total = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);

  const change = (id: string, delta: number) => {
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  };

  const reorder = (order: MyOrder) => {
    setCart((c) => {
      const next = { ...c };
      for (const item of order.order_items || []) {
        const match = menuItems.find((m) => m.name === item.item_name);
        if (match) next[match.id] = (next[match.id] || 0) + item.quantity;
      }
      return next;
    });
    setTab('menu');
    setToast({ type: 'success', text: 'Items added back to your cart.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* --------------------------------- place order ------------------------------ */
  async function submit() {
    if (!lines.length) return;
    setBusy(true);
    setMessage(null);
    try {
      const ref = customerRef.current || getCustomerRef();
      customerRef.current = ref;

      if (DEMO_MODE) {
        const orderNumber = 'NID-' + Date.now().toString().slice(-6);
        const order = {
          id: `order-${Date.now()}`,
          order_number: orderNumber,
          table_code: tableId,
          customer_name: 'You',
          customer_phone: '',
          status: 'new',
          total_amount: total,
          note,
          created_at: new Date().toISOString(),
          customer_ref: ref,
          order_items: lines.map((l, i) => ({
            id: `item-${Date.now()}-${i}`,
            menu_item_id: l.item.id,
            item_name: l.item.name,
            unit_price: l.item.price,
            quantity: l.qty,
            line_total: l.item.price * l.qty,
          })),
        };
        const all = readDemoOrders();
        localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([order, ...all]));
        setLastOrderId(order.id);
        setCart({});
        setNote('');
        setCartOpen(false);
        setTab('orders');
        setToast({
          type: 'success',
          text: `Order placed! Your order number is ${orderNumber}. Please pay at the restaurant.`,
        });
        await loadOrders();
      } else {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tableId,
            items: lines.map((l) => ({ menuItemId: l.item.id, quantity: l.qty })),
            note,
            customerRef: ref,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not place order');
        setLastOrderId(data.orderId);
        setCart({});
        setNote('');
        setCartOpen(false);
        setTab('orders');
        setToast({
          type: 'success',
          text: `Order placed! Your order number is ${data.orderNumber}. Please pay at the restaurant.`,
        });
        await loadOrders();
      }
    } catch (e: any) {
      const text = e?.message || 'Order failed. Please try again.';
      setMessage({ type: 'error', text });
      setToast({ type: 'error', text });
    } finally {
      setBusy(false);
    }
  }

  const activeCategory = category === 'All' ? null : category;

  return (
    <main className="min-h-screen pb-32">
      {/* ------------------------------- hero header ------------------------------ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#3b0c13] via-wine to-[#6d1622] text-white">
        <div className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-16 h-48 w-48 rounded-full bg-[#d9b86c]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 texture-dots opacity-40" />

        <div className="relative mx-auto max-w-5xl px-4 pb-6 pt-6 sm:px-6 sm:pt-8">
          <div className="flex items-start justify-between gap-4">
            <Logo light />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-[3px] border border-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              100% Pure Veg
            </span>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Welcome to</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Nidhivan <span className="text-gold">Restaurant</span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Scan, explore the menu and order straight from your table.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/75">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
              📍 Jaipur Jhunjhunu Bypass, Sikar
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5 font-semibold text-gold">
              🍽 Table {tableId}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
              💳 Pay at restaurant
            </span>
          </div>

          {/* tabs */}
          <div className="mt-6 inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur">
            {(
              [
                { id: 'menu', label: 'Menu', count: null },
                { id: 'orders', label: 'My Orders', count: orders.length },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  tab === t.id ? 'bg-white text-wine shadow-lg' : 'text-white/80 hover:text-white'
                }`}
              >
                {t.label}
                {t.count !== null && t.count > 0 && (
                  <span
                    className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      tab === t.id ? 'bg-wine text-gold' : 'bg-gold text-wine'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ------------------------------ sticky toolbar ----------------------------- */}
      {tab === 'menu' && (
        <div className="sticky top-0 z-30 border-b border-[#f0e4d0] bg-cream/90 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b9a795]">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, kebabs, biryani…"
                className="input pl-11 pr-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 text-sm text-[#b9a795] hover:text-wine"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
              {liveCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    category === c
                      ? 'bg-wine text-white shadow-lg shadow-wine/25'
                      : 'border border-[#e7d8bf] bg-white text-[#7a6157] hover:border-gold hover:text-wine'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------- content --------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {tab === 'menu' ? (
          <>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Our menu</p>
                <h2 className="text-2xl font-bold text-wine">
                  {activeCategory ?? 'Popular choices'}
                </h2>
                {activeCategory && (
                  <p className="mt-0.5 text-xs text-[#9b8175]">
                    {items.length} dish{items.length === 1 ? '' : 'es'} in this category
                  </p>
                )}
              </div>
              <span className="rounded-full bg-[#f4ecdd] px-3 py-1 text-xs font-semibold text-[#8a6b45]">
                {items.length} items
              </span>
            </div>

            {items.length === 0 ? (
              <div className="card flex flex-col items-center px-6 py-14 text-center">
                <span className="text-4xl">🍽️</span>
                <p className="mt-3 text-lg font-bold text-wine">No dishes found</p>
                <p className="mt-1 text-sm text-[#8b7269]">Try a different search or category.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                  }}
                  className="btn-outline mt-4"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {items.map((x, i) => (
                  <MenuItemCard key={x.id} item={x} qty={cart[x.id] || 0} onChange={change} index={i} />
                ))}
              </div>
            )}
          </>
        ) : (
          <MyOrders orders={orders} loading={ordersLoading} onReorder={reorder} activeId={lastOrderId} />
        )}
      </section>

      <footer className="border-t border-[#f0e4d0] px-4 py-8 text-center">
        <Logo size="sm" />
        <p className="mt-3 text-xs text-[#9b8175]">
          For assistance call 967275 8135 · Payment collected at the restaurant
        </p>
        <p className="mt-1 text-[11px] text-[#b3a094]">© {new Date().getFullYear()} Nidhivan Restaurant, Sikar</p>
      </footer>

      {/* ------------------------------- floating cart ----------------------------- */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-up flex items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-white/95 p-3 shadow-[0_18px_50px_-20px_rgba(74,16,25,0.6)] backdrop-blur-xl">
              <div className="flex items-center gap-3 pl-1">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8c987] to-[#c9a253] text-lg shadow-md">
                  🧺
                </span>
                <div>
                  <p className="text-xs text-[#8b7269]">
                    {cartCount} item{cartCount === 1 ? '' : 's'} · Table {tableId}
                  </p>
                  <p className="text-lg font-bold leading-tight text-wine">{money(total)}</p>
                </div>
              </div>
              <button onClick={() => setCartOpen(true)} className="btn-primary px-5 py-3">
                View order
              </button>
            </div>
          </div>
        </div>
      )}

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={lines}
        total={total}
        note={note}
        onNoteChange={setNote}
        onChangeQty={change}
        onSubmit={submit}
        busy={busy}
        message={message}
        tableId={tableId}
      />

      {/* ---------------------------------- toast ---------------------------------- */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div
            role="status"
            className={`animate-pop-in pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                : 'border-rose-200 bg-rose-50/95 text-rose-800'
            }`}
          >
            <span className="text-lg leading-none">{toast.type === 'success' ? '✅' : '⚠️'}</span>
            <p className="text-sm font-medium leading-snug">{toast.text}</p>
          </div>
        </div>
      )}
    </main>
  );
}
