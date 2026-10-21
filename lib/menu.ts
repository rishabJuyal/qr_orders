import seedMenu from '../data/menu.json';

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  available: boolean;
  /** Marketing copy shown on the menu card. */
  description: string;
  /** Emoji used as the dish artwork. */
  emoji: string;
  /** Tailwind gradient classes for the artwork tile. */
  gradient: string;
  rating: number;
  reviews: number;
  /** 0 = mild, 3 = hot. */
  spicy: 0 | 1 | 2 | 3;
  tags: string[];
  popular: boolean;
  /** Approximate kitchen time in minutes. */
  prepMins: number;
  veg: boolean;
};

export const SPICE_LABELS = ['Mild', 'Medium', 'Spicy', 'Hot'];

export const CATEGORY_META: Record<string, { emoji: string; gradient: string; accent: string; blurb: string }> = {
  Starters: {
    emoji: '🥟',
    gradient: 'from-amber-400 to-orange-500',
    accent: 'text-amber-600',
    blurb: 'Small plates made to share',
  },
  'Indian Main Course': {
    emoji: '🍛',
    gradient: 'from-amber-500 to-rose-500',
    accent: 'text-amber-700',
    blurb: 'Slow cooked, served hot',
  },
  'Paneer Main Course': {
    emoji: '🧈',
    gradient: 'from-yellow-300 to-amber-500',
    accent: 'text-yellow-700',
    blurb: 'Our signature paneer dishes',
  },
  Rice: {
    emoji: '🍚',
    gradient: 'from-amber-300 to-yellow-500',
    accent: 'text-amber-600',
    blurb: 'Aromatic rice & biryani',
  },
  Breads: {
    emoji: '🫓',
    gradient: 'from-orange-300 to-amber-400',
    accent: 'text-orange-600',
    blurb: 'Baked fresh on the tandoor',
  },
  Soups: {
    emoji: '🥣',
    gradient: 'from-red-300 to-orange-400',
    accent: 'text-red-500',
    blurb: 'Hot & comforting bowls',
  },
  'Pizza & Breads': {
    emoji: '🍕',
    gradient: 'from-red-400 to-yellow-500',
    accent: 'text-red-600',
    blurb: 'Stone baked with a crisp crust',
  },
  'Fast Food': {
    emoji: '🍔',
    gradient: 'from-orange-400 to-rose-500',
    accent: 'text-orange-600',
    blurb: 'Quick cravings, made to order',
  },
  Breakfast: {
    emoji: '🍳',
    gradient: 'from-yellow-300 to-orange-400',
    accent: 'text-yellow-700',
    blurb: 'Start your morning right',
  },
  Sandwiches: {
    emoji: '🥪',
    gradient: 'from-lime-400 to-emerald-500',
    accent: 'text-emerald-600',
    blurb: 'Grilled to a golden crisp',
  },
  'Beverages & Ice Cream': {
    emoji: '🥤',
    gradient: 'from-sky-400 to-cyan-500',
    accent: 'text-sky-600',
    blurb: 'Chilled to perfection',
  },
  Salads: {
    emoji: '🥗',
    gradient: 'from-green-400 to-lime-500',
    accent: 'text-green-600',
    blurb: 'Fresh & crunchy',
  },
  'Indian Thali': {
    emoji: '🍱',
    gradient: 'from-purple-400 to-pink-500',
    accent: 'text-purple-600',
    blurb: 'A complete meal on one platter',
  },
};

export const FALLBACK_META = {
  emoji: '🍽️',
  gradient: 'from-wine to-[#7a1a2b]',
  accent: 'text-wine',
  blurb: 'Chef’s selection',
};

/** Stable, non-random hash so every item always gets the same metadata. */
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CATEGORY_COPY: Record<string, string[]> = {
  Starters: [
    'Charred over live coals and finished with a smoky house masala.',
    'Crisp outside, tender inside — served with fresh mint chutney.',
    'A sharing platter of our most-loved small plates for the table.',
    'Lightly spiced, tossed with fresh coriander and a squeeze of lemon.',
  ],
  'Indian Main Course': [
    'Slow-cooked in a traditional masala for a rich, homestyle flavour.',
    'Simmered for hours until the gravies turn silky and deep.',
    'A classic family recipe, finished with a generous knob of butter.',
    'Full of warming spices, served piping hot with fresh roti.',
  ],
  'Paneer Main Course': [
    'Soft cottage cheese simmered in a rich, gently spiced gravy.',
    'Everyday comfort food, cooked fresh to order.',
    'Creamy, mellow and perfectly balanced with warm bread.',
    'Our most ordered paneer dish — a house favourite since day one.',
  ],
  Rice: [
    'Fragrant long-grain rice layered with vegetables and aromatic spices.',
    'Sealed and slow-cooked so every grain stays separate and flavourful.',
    'Light, fragrant and pairs beautifully with any curry.',
    'Finished with fresh coriander and a drizzle of ghee.',
  ],
  Breads: [
    'Kneaded fresh every morning and baked straight from the tandoor.',
    'Flaky, warm and brushed with butter for the table.',
    'Light, soft and made to mop up every last drop of gravy.',
    'Rolled thin so it stays tender in the middle.',
  ],
  Soups: [
    'Hot, comforting and seasoned with a generous handful of herbs.',
    'Blended smooth and finished with a swirl of cream.',
    'Light on the stomach, full of warmth and flavour.',
    'The perfect way to begin a meal.',
  ],
  'Pizza & Breads': [
    'Stone-baked with a crisp, blistered crust and a generous cheese layer.',
    'Baked fresh to order with our signature house sauce.',
    'Cheesy, garlicky and served warm from the oven.',
    'A savoury classic done the way we like it.',
  ],
  'Fast Food': [
    'Made to order and served sizzling hot.',
    'Crunchy outside, soft inside, and loaded with flavour.',
    'The quickest way to satisfy a craving.',
    'A street-food favourite, upgraded for the tandoor.',
  ],
  Breakfast: [
    'A hearty morning classic to start the day right.',
    'Freshly prepared, filling and served hot.',
    'Simple, homestyle and made every morning.',
    'The comfort of a home-cooked breakfast.',
  ],
  Sandwiches: [
    'Grilled fresh with butter and served with mint chutney.',
    'Crunchy vegetables, soft bread and a tangy house filling.',
    'Pressed to order and toasted until golden.',
    'Quick, filling and full of flavour.',
  ],
  'Beverages & Ice Cream': [
    'Chilled to perfection and made with premium ingredients.',
    'Thick, creamy and topped with a generous scoop.',
    'Blended on demand — best enjoyed slowly.',
    'Sweet, cool and made with real fruit.',
  ],
  Salads: [
    'Fresh seasonal vegetables tossed in a house dressing.',
    'Crunchy, colourful and on the lighter side.',
    'A fresh reset between the heavier courses.',
    'Simple, crisp and very refreshing.',
  ],
  'Indian Thali': [
    'A complete platter — dal, curry, rice, breads, raita and a sweet.',
    'Nine accompaniments on one plate, served warm.',
    'Everything you need for a full, balanced meal.',
    'The best way to taste our kitchen in one go.',
  ],
};

const ITEM_COPY: Record<string, string> = {
  'Veg Biryani': 'Fragrant basmati layered with seasonal vegetables, slow-cooked under a sealed lid.',
  'Paneer Biryani': 'Aromatic basmati layered with soft paneer, mint and crisp fried onions.',
  'Nidhivan Special Thali': 'Nine accompaniments on one platter — dal, two curries, rice, breads, raita and a sweet.',
  'Deluxe Thali': 'A generous spread of dal, curry, rice, three breads, salad and dessert.',
  'Nidhivan Special Shyam Savera': 'Our signature preparation — paneer dumplings in a velvety, slow-cooked cashew gravy.',
  'Paneer Butter Masala': 'The classic favourite — paneer in a smooth, mildly sweet tomato gravy.',
  'Dal Makhani': 'Black lentils simmered overnight on slow coals, finished with butter and cream.',
  'Malai Kofta (Red)': 'Silky vegetable kofta in a rich cashew and tomato gravy.',
  'Malai Kofta (White)': 'Soft kofta in a delicate white makhani gravy, finished with cream.',
  'Palak Paneer': 'Cottage cheese simmered in a smooth, warmly spiced spinach gravy.',
  'Garlic Naan': 'Pulled fresh from the tandoor and brushed with garlic butter.',
  'Butter Naan': 'Soft, pillowy naan brushed with butter straight from the tandoor.',
  'Stuffed Naan': 'Naan stuffed with spiced potato and coriander, baked to order.',
  'Lachha Paratha': 'Layered, flaky and pulled apart by hand — best eaten warm.',
  'Paneer Tikka Platter': 'Charred paneer tikka, seekh kabab and malai kabab on one platter.',
  'Soya Chaap Platter': 'Smoky soya chaap in four house styles — the vegetarian kebab classic.',
  'Platter from the Grill': 'A mixed grill of kababs, tikka and paneer — built for sharing.',
  'Maharaja Kabab Platter': 'Our royal selection of grilled kebabs with dips and garnish.',
  'Malai Kabab': 'Silky, creamy and melt-in-the-mouth — our softest kebab.',
  'Chilli Paneer (Dry)': 'Paneer tossed with chilli, garlic and a glossy, fiery sauce.',
  'Paneer 65': 'Crisp-fried paneer with curry leaf, pepper and a kick of chilli.',
  'Hara-Bhara Kabab': 'Spinach and green pea patties, crisp outside and soft within.',
  'Chole Bhature': 'Tangy chickpeas served with two large, fluffy fried breads.',
  'Pav Bhaji': 'Buttery mashed vegetables served with soft toasted pav.',
  'Masala Dosa': 'A thin, crisp dosa folded over a spiced potato filling.',
  'Maggie': 'Classic masala noodles with a fiery Sichuan kick.',
  'Schezwan Fried Rice': 'Wok-tossed rice with vegetables in a bold Schezwan sauce.',
  'Cold Coffee with Ice Cream': 'Thick, blended coffee served with a cold scoop of vanilla.',
  'Oreo Shake': 'Blended Oreo and milk into the creamiest shake we make.',
  'Kitkat Shake': 'Chocolate, hazelnut and a generous helping of chopped Kitkat.',
  'Garlic Bread': 'Sourdough halves loaded with garlic butter and melted cheese.',
  'Curd': 'Thick, set dahi made fresh in-house every morning.',
  Lassi: 'Chilled, thick and sweet — whisked fresh with thick curd.',
};

const POPULAR = new Set([
  'Paneer Tikka Platter',
  'Soya Chaap Platter',
  'Malai Kabab',
  'Paneer Butter Masala',
  'Dal Makhani',
  'Garlic Naan',
  'Veg Biryani',
  'Nidhivan Special Thali',
  'Chilli Paneer (Dry)',
  'Paneer 65',
  'Maggie',
  'Chole Bhature',
  'Pav Bhaji',
  'Kashmiri Dum Aloo',
]);

const NEW_ARRIVALS = new Set([
  'Crispy Stuffed Mushroom',
  'Corn Cheese Kabab',
  'Tandoori Mushroom',
  'Kashmiri Dum Aloo',
  'Lahsuni Methi Sahi Paneer',
  'Khoya Matar Paneer',
  'Paneer Do Pyaza',
]);

const SPICY_WORDS: [RegExp, 0 | 1 | 2 | 3][] = [
  [/chilli|chili|peri peri|schezwan|afghani/i, 3],
  [/paneer 65|butter masala|chole|momos|chaat/i, 2],
  [/momos|chaat|masala|coriander|green chilli/i, 1],
];

function spiceLevel(name: string): 0 | 1 | 2 | 3 {
  for (const [pattern, level] of SPICY_WORDS) {
    if (pattern.test(name)) return level;
  }
  return 0;
}

function buildTags(name: string, popular: boolean): string[] {
  const tags: string[] = [];
  if (popular) tags.push('Bestseller');
  if (NEW_ARRIVALS.has(name)) tags.push('New');
  if (/special/i.test(name)) tags.push("Chef's Special");
  if (/platter/i.test(name)) tags.push('Share');
  return tags;
}

function buildDescription(name: string, category: string): string {
  if (ITEM_COPY[name]) return ITEM_COPY[name];
  const pool = CATEGORY_COPY[category] ?? CATEGORY_COPY['Indian Main Course'];
  return pool[hash(name) % pool.length];
}

/** Adds presentation metadata to a raw menu row coming from the database or seed file. */
export function enrichMenuItem(raw: any): MenuItem {
  const name = String(raw?.name ?? 'Dish');
  const category = String(raw?.category ?? 'Indian Main Course');
  const meta = CATEGORY_META[category] ?? FALLBACK_META;
  const h = hash(name);
  const popular = POPULAR.has(name);
  return {
    id: String(raw?.id ?? `menu-${h}`),
    category,
    name,
    price: Number(raw?.price ?? 0),
    available: raw?.available ?? raw?.is_available ?? true,
    description: raw?.description
      ? String(raw.description).slice(0, 220)
      : buildDescription(name, category),
    emoji: meta.emoji,
    gradient: meta.gradient,
    rating: Number((3.9 + (h % 11) / 10).toFixed(1)),
    reviews: 12 + (h % 180),
    spicy: spiceLevel(name),
    tags: buildTags(name, popular),
    popular,
    prepMins: 10 + (h % 25),
    veg: true,
  };
}

const seedItems = (seedMenu as any[]).map(enrichMenuItem);

export const fallbackMenu: MenuItem[] = seedItems;
export const categories = Array.from(new Set(fallbackMenu.map((x) => x.category)));
export const money = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then || Number.isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr${hr > 1 ? 's' : ''} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
