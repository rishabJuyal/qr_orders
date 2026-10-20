'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DEMO_MODE, DEMO_ORDERS_KEY } from '../lib/demo';
import { ensureDemoOrders } from '../lib/demo-store';
import { formatTime, money, timeAgo } from '../lib/menu';
import OrderStatusBadge, { ORDER_FLOW, statusMeta } from './OrderStatusBadge';

type TrackedOrder = {
  id: string;
  order_number: string;
  table_code: string;
  status: string;
  total_amount: number;
  note?: string;
  created_at: string;
  order_items: { id: string; item_name: string; unit_price: number; quantity: number; line_total: number }[];
};

const FLOW_COPY: Record<string, { title: string; body: string }> = {
  new: { title: 'Order placed', body: 'We have received your order and sent it to the kitchen.' },
  accepted: { title: 'Order confirmed', body: 'The kitchen has accepted your order.' },
  preparing: { title: 'Cooking now', body: 'Your dishes are being prepared fresh.' },
  ready: { title: 'Ready to serve', body: 'Your food is plated and on its way to the table.' },
  served: { title: 'Served', body: 'Enjoy your meal! Pay at the counter when you are done.' },
};

export default function OrderTracker({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    try {
      if (DEMO_MODE) {
        const all = ensureDemoOrders();
        const found = all.find((o) => o.id === orderId || o.order_number === orderId);
        setOrder(found ? ({ ...found, order_items: found.order_items || [] } as TrackedOrder) : null);
        setMissing(!found);
      } else {
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        setOrder(data.order ?? null);
        setMissing(!data.order);
      }
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, DEMO_MODE ? 3000 : 8000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === DEMO_ORDERS_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('storage', onStorage);
    };
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="card h-64 animate-pulse bg-[#fdf8ef]" />
      </div>
    );
  }

  if (missing || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="card animate-fade-up px-6 py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f7efe1] text-4xl">
            🔍
          </div>
          <h1 className="mt-5 text-2xl font-bold text-wine">Order not found</h1>
          <p className="mt-2 text-sm text-[#8b7269]">
            We could not find order <span className="font-semibold text-wine">{orderId}</span> on this device.
          </p>
          <Link href="/" className="btn-primary mt-6">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const cancelled = order.status === 'cancelled';
  const currentIndex = cancelled ? -1 : ORDER_FLOW.indexOf(order.status as any);
  const meta = statusMeta(order.status);

  return (
    <main className="min-h-screen bg-cream pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3b0c13] via-wine to-[#6d1622] px-4 pb-14 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-lg text-center">
          <span
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-lg ${
              cancelled ? 'bg-rose-500/25' : 'bg-emerald-400/20'
            }`}
          >
            {cancelled ? '✖️' : meta.icon}
          </span>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            {cancelled ? 'Order cancelled' : FLOW_COPY[order.status]?.title ?? 'Order received'}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {cancelled
              ? 'This order was cancelled. Please speak to our team if you need help.'
              : FLOW_COPY[order.status]?.body ?? 'Please pay at the restaurant.'}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <span className="text-white/60">Order</span>
            <span className="font-bold text-gold">{order.order_number}</span>
          </p>
        </div>
      </div>

      <div className="relative mx-auto -mt-8 max-w-lg px-4 sm:px-6">
        <section className="card animate-fade-up p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Status</p>
              <p className="text-lg font-bold text-wine">
                {cancelled ? 'Cancelled' : meta.label}
              </p>
            </div>
            <OrderStatusBadge status={order.status} pulse={!cancelled && order.status !== 'served'} />
          </div>

          {!cancelled && (
            <ol className="mt-6 space-y-0">
              {ORDER_FLOW.map((step, index) => {
                const done = index < currentIndex;
                const active = index === currentIndex;
                const copy = FLOW_COPY[step];
                return (
                  <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < ORDER_FLOW.length - 1 && (
                      <span
                        className={`absolute left-[13px] top-7 h-[calc(100%-1rem)] w-0.5 rounded-full ${
                          done ? 'bg-emerald-400' : 'bg-[#eee0cc]'
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors ${
                        done
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : active
                          ? 'border-gold bg-gold text-wine shadow-lg shadow-gold/40'
                          : 'border-[#e7d8bf] bg-white text-[#c3b3a1]'
                      }`}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <div className="-mt-0.5">
                      <p
                        className={`text-sm font-semibold ${
                          active ? 'text-wine' : done ? 'text-emerald-700' : 'text-[#b3a094]'
                        }`}
                      >
                        {copy.title}
                      </p>
                      <p className={`mt-0.5 text-xs ${active ? 'text-[#7d655b]' : 'text-[#b3a094]'}`}>{copy.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-5 border-t border-[#f0e4d0] pt-4">
            <div className="flex items-center justify-between text-xs text-[#9b8175]">
              <span>Placed {formatTime(order.created_at)}</span>
              <span>{timeAgo(order.created_at)}</span>
            </div>
            <p className="mt-1 text-xs text-[#9b8175]">Table {order.table_code}</p>
          </div>
        </section>

        <section className="card animate-fade-up mt-4 p-5" style={{ animationDelay: '80ms' }}>
          <p className="eyebrow">Items</p>
          <ul className="mt-3 divide-y divide-[#f4ecdd]">
            {(order.order_items || []).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7efe1] text-xs font-bold text-[#a07d46]">
                    {item.quantity}×
                  </span>
                  <span className="truncate text-[#4a322c]">{item.item_name}</span>
                </span>
                <span className="shrink-0 font-medium text-[#7d655b]">{money(Number(item.line_total))}</span>
              </li>
            ))}
          </ul>
          {order.note && (
            <p className="mt-3 rounded-lg bg-[#fdf6e7] px-3 py-2 text-xs italic text-[#8a6b45]">Note: {order.note}</p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-[#f0e4d0] pt-3">
            <span className="text-sm font-semibold text-[#7d655b]">Total · pay at restaurant</span>
            <span className="text-xl font-bold text-wine">{money(Number(order.total_amount))}</span>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/" className="btn-outline flex-1">
            Back to menu
          </Link>
          <a href="tel:9672758135" className="btn-primary flex-1">
            📞 Call the restaurant
          </a>
        </div>
      </div>
    </main>
  );
}
