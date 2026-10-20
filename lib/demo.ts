export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
export const DEMO_ORDERS_KEY = 'nidhivan_demo_orders';
export const DEMO_MENU_KEY = 'nidhivan_demo_menu';
export const DEMO_TABLES_KEY = 'nidhivan_demo_tables';
export const DEMO_LOGIN_KEY = 'nidhivan_demo_logged_in';
export const DEMO_SEED_FLAG_KEY = 'nidhivan_demo_seeded_v1';

export const DEMO_ADMIN_EMAIL = 'admin@nidhivan.demo';
export const DEMO_ADMIN_PASSWORD = 'nidhivan123';

export const ORDER_STATUSES = ['new', 'accepted', 'preparing', 'ready', 'served', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
