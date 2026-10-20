import seedMenu from '../data/menu.json';

export type DemoOrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type DemoOrderItem = {
  id: string;
  menu_item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type DemoOrder = {
  id: string;
  order_number: string;
  table_code: string;
  customer_name: string;
  customer_phone: string;
  status: DemoOrderStatus;
  total_amount: number;
  note?: string;
  created_at: string;
  customer_ref: string;
  order_items: DemoOrderItem[];
  /** Marks seeded sample orders so the customer view can label them clearly. */
  is_sample?: boolean;
};

type SeedOrder = {
  table: string;
  customer: string;
  phone: string;
  status: DemoOrderStatus;
  minsAgo: number;
  items: [string, number][];
  note?: string;
};

const MENU_BY_NAME = new Map<string, { id: string; price: number }>(
  (seedMenu as any[]).map((x) => [x.name, { id: x.id, price: Number(x.price) }]),
);

/**
 * A realistic spread of orders across the restaurant floor:
 * mix of statuses, table numbers, party sizes and timings.
 */
const SEEDS: SeedOrder[] = [
  {
    table: 'table-01',
    customer: 'Aarav Sharma',
    phone: '98290 11223',
    status: 'served',
    minsAgo: 188,
    items: [
      ['Paneer Tikka Platter', 1],
      ['Garlic Naan', 2],
      ['Paneer Butter Masala', 1],
      ['Veg Biryani', 1],
      ['Masala Pepsi', 2],
    ],
    note: 'Extra butter on the naan please.',
  },
  {
    table: 'table-03',
    customer: 'Priya Nair',
    phone: '97110 44890',
    status: 'served',
    minsAgo: 164,
    items: [
      ['Chole Bhature', 1],
      ['Chai', 2],
      ['Masala Papad', 1],
    ],
  },
  {
    table: 'table-02',
    customer: 'Rohit Verma',
    phone: '98760 55231',
    status: 'served',
    minsAgo: 132,
    items: [
      ['Nidhivan Special Thali', 2],
      ['Lassi', 2],
    ],
    note: 'One thali without onion and garlic, please.',
  },
  {
    table: 'table-05',
    customer: 'Neha Jain',
    phone: '99820 76104',
    status: 'served',
    minsAgo: 118,
    items: [
      ['Soya Chaap Platter', 1],
      ['Paneer 65', 1],
      ['Fried Rice', 1],
      ['Tawa Roti (Butter)', 4],
    ],
  },
  {
    table: 'table-04',
    customer: 'Vikram Singh',
    phone: '93140 22890',
    status: 'cancelled',
    minsAgo: 104,
    items: [
      ['Butter Naan', 3],
      ['Dal Makhani', 1],
      ['Kashmiri Dal', 1],
    ],
    note: 'Cancelled by customer — they left before the order was served.',
  },
  {
    table: 'table-01',
    customer: 'Ananya Gupta',
    phone: '88260 90112',
    status: 'served',
    minsAgo: 92,
    items: [
      ['Pav Bhaji', 2],
      ['Cold Coffee with Ice Cream', 2],
    ],
  },
  {
    table: 'table-06',
    customer: 'Karan Mehta',
    phone: '98110 33772',
    status: 'served',
    minsAgo: 74,
    items: [
      ['Hara-Bhara Kabab', 1],
      ['Paneer Do Pyaza', 1],
      ['Jeera Rice', 1],
      ['Garlic Lachha Paratha', 2],
    ],
  },
  {
    table: 'table-02',
    customer: 'Sneha Reddy',
    phone: '97400 61238',
    status: 'served',
    minsAgo: 61,
    items: [
      ['Malai Kabab', 2],
      ['Seekh Kabab', 1],
      ['Tandoori Roti (Butter)', 3],
    ],
  },
  {
    table: 'table-03',
    customer: 'Rahul Yadav',
    phone: '89550 47301',
    status: 'served',
    minsAgo: 48,
    items: [
      ['Maggie', 2],
      ['Spring Roll', 1],
      ['Schezwan Noodles', 1],
      ['Masala Pepsi', 2],
    ],
  },
  {
    table: 'table-07',
    customer: 'Ishita Bansal',
    phone: '90790 82560',
    status: 'served',
    minsAgo: 36,
    items: [
      ['Kashmiri Dum Aloo', 1],
      ['Malai Kofta (White)', 1],
      ['Missi Roti (Butter)', 3],
      ['Sweet Corn Soup', 2],
    ],
  },
  {
    table: 'table-04',
    customer: 'Manish Agarwal',
    phone: '96620 14905',
    status: 'served',
    minsAgo: 27,
    items: [
      ['Corn-Cheese Pizza', 1],
      ['Onion-Capsicum Pizza', 1],
      ['Garlic Bread (4 pcs.)', 1],
      ['Strawberry Shake', 2],
    ],
  },
  {
    table: 'table-05',
    customer: 'Divya Menon',
    phone: '94480 30219',
    status: 'accepted',
    minsAgo: 14,
    items: [
      ['Nidhivan Special Shyam Savera', 1],
      ['Paneer Tikka Lababdar', 1],
      ['Butter Naan', 3],
    ],
    note: 'Please make the gravy a little spicy.',
  },
  {
    table: 'table-02',
    customer: 'Aditya Kulkarni',
    phone: '90010 58774',
    status: 'accepted',
    minsAgo: 9,
    items: [
      ['Chole Kulche', 1],
      ['Puri Bhaji', 1],
      ['Buttermilk (Masala)', 2],
    ],
  },
  {
    table: 'table-08',
    customer: 'Sanjana Rao',
    phone: '98330 71048',
    status: 'preparing',
    minsAgo: 6,
    items: [
      ['Paneer Lababdar', 1],
      ['Mix Veg', 1],
      ['Lachha Paratha', 3],
      ['Kaju Curry (Red)', 1],
    ],
  },
  {
    table: 'table-06',
    customer: 'Yash Chauhan',
    phone: '91760 48302',
    status: 'preparing',
    minsAgo: 4,
    items: [
      ['Peri Peri Paneer Burrito', 2],
      ['French Fries', 1],
      ['Cheese Burger', 1],
    ],
  },
  {
    table: 'table-01',
    customer: 'Ritika Sharma',
    phone: '98870 22641',
    status: 'preparing',
    minsAgo: 3,
    items: [
      ['Paneer 65', 1],
      ['Hara-Bhara Kabab', 1],
      ['Fried Rice', 1],
      ['Masala Pepsi', 1],
    ],
  },
  {
    table: 'table-03',
    customer: 'Gaurav Mishra',
    phone: '96900 54183',
    status: 'new',
    minsAgo: 2,
    items: [
      ['Dal Makhani', 1],
      ['Palak Paneer', 1],
      ['Tandoori Roti (Butter)', 4],
    ],
    note: 'No chilli, my child is 4 years old.',
  },
  {
    table: 'table-07',
    customer: 'Pooja Soni',
    phone: '82330 90751',
    status: 'new',
    minsAgo: 1,
    items: [
      ['Afghani Momos', 1],
      ['Tandoori Momos', 1],
      ['Hakka Noodles', 1],
    ],
  },
  {
    table: 'table-04',
    customer: 'Harsh Vardhan',
    phone: '98110 36594',
    status: 'ready',
    minsAgo: 12,
    items: [
      ['Paneer Tikka Platter', 1],
      ['Maharaja Kabab Platter', 1],
      ['Tandoori Roti (Plain)', 4],
    ],
    note: 'Platters to share between four people.',
  },
  {
    table: 'table-08',
    customer: 'Meghna Joshi',
    phone: '93910 74520',
    status: 'ready',
    minsAgo: 10,
    items: [
      ['Masala Dosa', 2],
      ['Curd', 2],
      ['Chai', 2],
    ],
  },
];

function pad(n: number, size = 2) {
  return String(n).padStart(size, '0');
}

/** Builds the demo order list with timestamps relative to "now" so the demo always looks alive. */
export function buildDemoOrders(now: number = Date.now()): DemoOrder[] {
  return SEEDS.map((seed, index) => {
    const created = new Date(now - seed.minsAgo * 60_000);
    const orderItems: DemoOrderItem[] = seed.items.map(([itemName, qty], itemIndex) => {
      const meta = MENU_BY_NAME.get(itemName) ?? { id: `seed-${index + 1}`, price: 200 };
      const unit = Number(meta.price);
      return {
        id: `item-${index + 1}-${itemIndex + 1}`,
        menu_item_id: meta.id,
        item_name: itemName,
        unit_price: unit,
        quantity: qty,
        line_total: unit * qty,
      };
    });
    const total = orderItems.reduce((sum, i) => sum + i.line_total, 0);
    return {
      id: `order-${index + 1}`,
      order_number: `NID-${pad(index + 1, 2)}${pad(created.getTime() % 1000, 3)}`,
      table_code: seed.table,
      customer_name: seed.customer,
      customer_phone: seed.phone,
      status: seed.status,
      total_amount: total,
      note: seed.note,
      created_at: created.toISOString(),
      customer_ref: 'demo-sample',
      order_items: orderItems,
      is_sample: true,
    };
  });
}

export const DEMO_TABLES = [
  { id: 't1', table_code: 'table-01' },
  { id: 't2', table_code: 'table-02' },
  { id: 't3', table_code: 'table-03' },
  { id: 't4', table_code: 'table-04' },
  { id: 't5', table_code: 'table-05' },
  { id: 't6', table_code: 'table-06' },
  { id: 't7', table_code: 'table-07' },
  { id: 't8', table_code: 'table-08' },
];
