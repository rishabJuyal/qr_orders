'use client';

import Link from 'next/link';
import { money, timeAgo, formatTime } from '../lib/menu';
import OrderStatusBadge from './OrderStatusBadge';

export type MyOrder = {
  id: string;
  order_number: string;
  table_code: string;
  status: string;
  total_amount: number;
  note?: string;
  created_at: string;
  is_sample?: boolean;
  order_items: { id: string; item_name: string; unit_price: number; quantity: number; line_total: number }[];
};

function EmptyState() {
  return (
    <div className="card animate-fade-up flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#fdf1dc] to-[#f6e3c2] text-4xl shadow-inner">
        🧾
      </div>
      <h3 className="mt-5 text-lg font-bold text-wine">No orders yet</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#8b7269]">
        Place your first order from the menu and it will show up here with live status updates.
      </p>
    </div>
  );
}

export default function MyOrders({
  orders,
  loading,
  onReorder,
  activeId,
}: {
  orders: MyOrder[];
  loading: boolean;
  onReorder: (order: MyOrder) => void;
  activeId?: string;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-40 animate-pulse bg-[#fdf8ef]" />
        ))}
      </div>
    );
  }

  if (!orders.length) return <EmptyState />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Order history</p>
          <h2 className="text-xl font-bold text-wine">Your orders</h2>
        </div>
        <span className="rounded-full bg-[#f4ecdd] px-3 py-1 text-xs font-semibold text-[#8a6b45]">
          {orders.length} order{orders.length === 1 ? '' : 's'}
        </span>
      </div>

      {orders.map((order, index) => (
        <article
          key={order.id}
          className={`card animate-fade-up overflow-hidden ${
            activeId === order.id ? 'ring-2 ring-gold' : ''
          }`}
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
        >
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f4ecdd] bg-gradient-to-r from-[#fdf8ef] to-white px-4 py-3.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-wine">{order.order_number}</span>
                {order.is_sample && (
                  <span className="rounded-full bg-[#f3ecff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                    Sample
                  </span>
                )}
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <p className="mt-1 text-xs text-[#9b8175]">
                {formatTime(order.created_at)} · {timeAgo(order.created_at)} · Table {order.table_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-[#a07d46]">Total</p>
              <p className="text-lg font-bold text-wine">{money(Number(order.total_amount))}</p>
            </div>
          </header>

          <div className="px-4 py-3">
            <ul className="divide-y divide-[#f4ecdd]">
              {(order.order_items || []).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
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
              <p className="mt-3 rounded-lg bg-[#fdf6e7] px-3 py-2 text-xs italic text-[#8a6b45]">
                Note: {order.note}
              </p>
            )}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f4ecdd] bg-[#fdfaf4] px-4 py-3">
            <Link
              href={`/order/${encodeURIComponent(order.id)}`}
              className="text-xs font-semibold text-wine underline-offset-4 hover:underline"
            >
              Track order →
            </Link>
            <button onClick={() => onReorder(order)} className="btn-outline px-3 py-2 text-xs">
              ↻ Reorder
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
