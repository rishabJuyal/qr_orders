import {
  DEMO_ORDERS_KEY,
  DEMO_SEED_FLAG_KEY,
  DEMO_TABLES_KEY,
} from './demo';
import { DEMO_TABLES, buildDemoOrders, DemoOrder } from '../data/demo-orders';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Reads every demo order stored in this browser. */
export function readDemoOrders(): DemoOrder[] {
  if (!isBrowser()) return [];
  return safeParse<DemoOrder[]>(window.localStorage.getItem(DEMO_ORDERS_KEY), []);
}

/** Persists the demo order list back to localStorage. */
export function writeDemoOrders(orders: DemoOrder[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Makes sure the demo always has a rich, believable order history.
 * Seeding happens once per browser; afterwards the staff/admin edits are preserved.
 */
export function ensureDemoOrders(): DemoOrder[] {
  if (!isBrowser()) return [];
  const seeded = window.localStorage.getItem(DEMO_SEED_FLAG_KEY) === 'true';
  const existing = readDemoOrders();
  if (seeded && existing.length) return existing;

  const samples = buildDemoOrders();
  // Keep any orders the guest already placed in this browser.
  const userOrders = existing.filter((o) => !o.is_sample);
  const merged = [...userOrders, ...samples];
  writeDemoOrders(merged);
  window.localStorage.setItem(DEMO_SEED_FLAG_KEY, 'true');
  return merged;
}

/** Wipes the demo data and re-seeds it from scratch. */
export function resetDemoOrders(): DemoOrder[] {
  if (!isBrowser()) return [];
  window.localStorage.removeItem(DEMO_ORDERS_KEY);
  window.localStorage.removeItem(DEMO_SEED_FLAG_KEY);
  return ensureDemoOrders();
}

/** Ensures the demo table list exists. */
export function ensureDemoTables() {
  if (!isBrowser()) return DEMO_TABLES;
  const saved = safeParse<any[]>(window.localStorage.getItem(DEMO_TABLES_KEY), []);
  if (saved.length) return saved;
  window.localStorage.setItem(DEMO_TABLES_KEY, JSON.stringify(DEMO_TABLES));
  return DEMO_TABLES;
}
