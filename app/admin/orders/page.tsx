'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../../lib/supabase/client';
import { money, timeAgo, formatTime } from '../../../lib/menu';
import { DEMO_MODE, DEMO_LOGIN_KEY, DEMO_ORDERS_KEY } from '../../../lib/demo';
import { ensureDemoOrders, readDemoOrders, resetDemoOrders, writeDemoOrders } from '../../../lib/demo-store';
import AdminShell from '../../../components/AdminShell';
import OrderStatusBadge, { ORDER_FLOW } from '../../../components/OrderStatusBadge';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Served' },
  { id: 'cancelled', label: 'Cancelled' },
];

function StatCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  tone: string;
}) {
  return (
    <div className="card animate-fade-up p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a07d46]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone} text-sm`}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-wine">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-[#9b8175]">{sub}</p>}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const router = useRouter();

  async function load() {
    if (DEMO_MODE) {
      const all = ensureDemoOrders();
      setOrders(all.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLastSync(new Date());
      setLoading(false);
      return;
    }
    try {
      const sb = supabaseBrowser();
      const { data, error: err } = await sb
        .from('orders')
        .select('*,order_items(*)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (err) setError(err.message);
      else setOrders(data || []);
    } catch (e: any) {
      setError(e?.message || 'Could not load orders.');
    } finally {
      setLastSync(new Date());
      setLoading(false);
    }
  }

  useEffect(() => {
    if (DEMO_MODE) {
      if (localStorage.getItem(DEMO_LOGIN_KEY) !== 'true') {
        router.replace('/admin/login');
        return;
      }
      load();
      const onStorage = () => load();
      window.addEventListener('storage', onStorage);
      const timer = window.setInterval(load, 2000);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.clearInterval(timer);
      };
    }
    load();
    const sb = supabaseBrowser();
    const ch = sb
      .channel('orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, []);

  async function update(id: string, status: string) {
    if (DEMO_MODE) {
      const next = readDemoOrders().map((o) => (o.id === id ? { ...o, status } : o));
      writeDemoOrders(next as any);
      setOrders(next.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      return;
    }
    const { error: err } = await supabaseBrowser().from('orders').update({ status }).eq('id', id);
    if (err) setError(err.message);
    else load();
  }

  function reseed() {
    const fresh = resetDemoOrders();
    setOrders(fresh.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  }

  async function logout() {
    if (DEMO_MODE) localStorage.removeItem(DEMO_LOGIN_KEY);
    else await supabaseBrowser().auth.signOut();
    router.push('/admin/login');
  }

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todays = orders.filter((o) => new Date(o.created_at).getTime() >= today.getTime());
    return {
      total: orders.length,
      today: todays.length,
      new: orders.filter((o) => o.status === 'new').length,
      kitchen: orders.filter((o) => o.status === 'preparing' || o.status === 'accepted').length,
      revenue: orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((s, o) => s + Number(o.total_amount || 0), 0),
    };
  }, [orders]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const statusOk = filter === 'all' || o.status === filter;
      const searchOk =
        !q ||
        String(o.order_number || '').toLowerCase().includes(q) ||
        String(o.table_code || '').toLowerCase().includes(q) ||
        String(o.customer_name || '').toLowerCase().includes(q) ||
        (o.order_items || []).some((i: any) => String(i.item_name).toLowerCase().includes(q));
      return statusOk && searchOk;
    });
  }, [orders, filter, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    for (const o of orders) map[o.status] = (map[o.status] || 0) + 1;
    return map;
  }, [orders]);

  return (
    <AdminShell
      title="Orders dashboard"
      subtitle={
        DEMO_MODE
          ? 'Demo mode · live sample orders stored in this browser'
          : 'Live orders from every table, updated in real time'
      }
      actions={
        <>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {lastSync ? `Synced ${lastSync.toLocaleTimeString()}` : 'Connecting…'}
          </span>
          {DEMO_MODE && (
            <button
              onClick={reseed}
              className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              ↻ Reset sample data
            </button>
          )}
          <button
            onClick={logout}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-wine transition-colors hover:bg-gold"
          >
            Sign out
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total orders" value={stats.total} sub={`${stats.today} today`} icon="🧾" tone="bg-[#f7efe1]" />
        <StatCard label="New" value={stats.new} sub="Waiting to be accepted" icon="🆕" tone="bg-sky-50" />
        <StatCard label="In the kitchen" value={stats.kitchen} sub="Accepted + preparing" icon="👨‍🍳" tone="bg-amber-50" />
        <StatCard label="Served" value={counts.served || 0} sub="Completed orders" icon="✅" tone="bg-emerald-50" />
        <StatCard label="Revenue" value={money(stats.revenue)} sub="Excludes cancelled" icon="💰" tone="bg-rose-50" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filter === f.id
                  ? 'bg-wine text-white shadow-lg shadow-wine/25'
                  : 'border border-[#e7d8bf] bg-white text-[#7a6157] hover:border-gold hover:text-wine'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">{counts[f.id] || 0}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, table, dish…"
            className="input pl-9"
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b9a795]">🔍</span>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      )}

      <p className="mb-4 rounded-xl border border-[#f0e4d0] bg-[#fdf8ef] p-3 text-sm text-[#7a6157]">
        Sample orders are pre-loaded so the dashboard looks alive. Place an order from the customer menu in
        another tab — it appears here instantly.
      </p>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card h-56 animate-pulse bg-[#fdf8ef]" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <span className="text-4xl">🍽️</span>
          <p className="mt-3 text-lg font-bold text-wine">No orders here</p>
          <p className="mt-1 text-sm text-[#8b7269]">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((o, index) => {
            const flowIndex = ORDER_FLOW.indexOf(o.status);
            const nextStatus = flowIndex >= 0 && flowIndex < ORDER_FLOW.length - 1 ? ORDER_FLOW[flowIndex + 1] : null;
            return (
              <article
                key={o.id}
                className="card animate-fade-up overflow-hidden"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <header className="flex items-start justify-between gap-3 border-b border-[#f4ecdd] bg-gradient-to-r from-[#fdf8ef] to-white px-4 py-3.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-wine">{o.order_number}</span>
                      {o.is_sample && (
                        <span className="rounded-full bg-[#f3ecff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                          Sample
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#9b8175]">
                      Table {o.table_code} · {formatTime(o.created_at)} · {timeAgo(o.created_at)}
                    </p>
                    {o.customer_name && (
                      <p className="mt-1 text-xs font-medium text-[#7a6157]">
                        👤 {o.customer_name}
                        {o.customer_phone ? ` · ${o.customer_phone}` : ''}
                      </p>
                    )}
                  </div>
                  <OrderStatusBadge status={o.status} pulse={o.status !== 'served' && o.status !== 'cancelled'} />
                </header>

                <div className="px-4 py-3">
                  <ul className="divide-y divide-[#f4ecdd]">
                    {(o.order_items || []).map((i: any) => (
                      <li key={i.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7efe1] text-xs font-bold text-[#a07d46]">
                            {i.quantity}×
                          </span>
                          <span className="truncate text-[#4a322c]">{i.item_name}</span>
                        </span>
                        <span className="shrink-0 font-medium text-[#7d655b]">{money(Number(i.line_total))}</span>
                      </li>
                    ))}
                  </ul>

                  {o.note && (
                    <p className="mt-3 rounded-lg bg-[#fdf6e7] px-3 py-2 text-xs italic text-[#8a6b45]">
                      Note: {o.note}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-[#f0e4d0] pt-3">
                    <span className="text-sm font-semibold text-[#7d655b]">Total</span>
                    <span className="text-lg font-bold text-wine">{money(Number(o.total_amount))}</span>
                  </div>
                </div>

                <footer className="flex flex-wrap items-center gap-2 border-t border-[#f4ecdd] bg-[#fdfaf4] px-4 py-3">
                  {nextStatus && (
                    <button onClick={() => update(o.id, nextStatus)} className="btn-primary px-3 py-2 text-xs">
                      Mark {nextStatus} →
                    </button>
                  )}
                  {o.status !== 'served' && o.status !== 'cancelled' && (
                    <button
                      onClick={() => update(o.id, 'cancelled')}
                      className="btn-outline px-3 py-2 text-xs hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    >
                      Cancel
                    </button>
                  )}
                  {o.status === 'served' && (
                    <button onClick={() => update(o.id, 'cancelled')} className="btn-ghost px-3 py-2 text-xs">
                      Refund / void
                    </button>
                  )}
                  <a
                    href={`/order/${encodeURIComponent(o.id)}`}
                    className="ml-auto text-xs font-semibold text-wine underline-offset-4 hover:underline"
                  >
                    Guest view →
                  </a>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
