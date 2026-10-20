'use client';

import { OrderStatus } from '../lib/demo';

const STATUS_META: Record<string, { label: string; className: string; dot: string; icon: string }> = {
  new: {
    label: 'New',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    icon: '🆕',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    icon: '👍',
  },
  preparing: {
    label: 'Preparing',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: '👨‍🍳',
  },
  ready: {
    label: 'Ready',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '🔔',
  },
  served: {
    label: 'Served',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
    dot: 'bg-stone-400',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: '✖️',
  },
};

export function statusMeta(status: string) {
  return STATUS_META[status] ?? STATUS_META.new;
}

export default function OrderStatusBadge({
  status,
  size = 'md',
  pulse = false,
}: {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}) {
  const meta = statusMeta(status);
  const sizing = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${meta.className} ${sizing}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {meta.label}
    </span>
  );
}

export const ORDER_FLOW: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready', 'served'];
