export const CUSTOMER_REF_KEY = 'nidhivan_customer_ref';

/**
 * A random, device-scoped token that ties orders to the guest who placed them.
 * It is stored in localStorage so "My orders" keeps working after a refresh.
 */
export function getCustomerRef(): string {
  if (typeof window === 'undefined' || !window.localStorage) return '';
  try {
    const existing = window.localStorage.getItem(CUSTOMER_REF_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(CUSTOMER_REF_KEY, generated);
    return generated;
  } catch {
    return '';
  }
}
