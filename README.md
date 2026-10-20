# Nidhivan Restaurant QR Menu

A mobile-first QR menu and table ordering website built with Next.js, Tailwind CSS and Supabase. Menu data is prefilled from the provided Nidhivan Restaurant PDF.

## Features
- Customer menu with category filters, search, quantity controls and a slide-up cart
- **"My Orders" tab** — every guest sees their own order history with live status, items and a one-tap *Reorder*
- **Order tracking page** at `/order/<id>` with a visual status timeline (placed → accepted → preparing → ready → served)
- Dish cards with artwork, ratings, spice level, prep time, tags (Bestseller / New / Chef's Special) and descriptions
- Separate table URL, e.g. `/menu/table-01`
- Orders saved to Supabase with item/price snapshots and payment-at-restaurant flow
- Admin login using Supabase Auth
- Live orders dashboard with revenue/kitchen stats, status filters, search and one-tap status updates
- Menu editing (price, category, availability) and table QR PNG downloads with on-screen previews

## Requirements
- Node.js 20+
- Supabase project

## Run locally without Supabase
The project defaults to `NEXT_PUBLIC_DEMO_MODE=true`. Copy `.env.example` to `.env.local`, then run `npm install` and `npm run dev`. Open `/menu/table-01` to place a test order and `/admin/login` to view it.

Local admin credentials:
- Email: `admin@nidhivan.demo`
- Password: `nidhivan123`

### Demo sample data
On first load the demo seeds **20 realistic sample orders** across 8 tables and every order status
(`new`, `accepted`, `preparing`, `ready`, `served`, `cancelled`) with real menu items, prices, customer
names, phone numbers and kitchen notes. This makes the admin dashboard and the guest "My Orders" tab look
alive straight away.

- Sample orders are regenerated relative to the current time, so they always look fresh.
- Use **↻ Reset sample data** in the admin header to re-seed them.
- Newly placed guest orders are tagged separately from the samples.

While this mode is on, orders, menu edits and the table list are stored in the current browser's localStorage only. They do not sync between different devices/browsers and may be cleared by the browser. Switch to the database before using it for real restaurant orders. QR codes generated on localhost are only for testing.

## Supabase setup for production
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`.
3. In Supabase Dashboard → SQL Editor, run the complete `supabase/schema.sql`.
   (It is safe to re-run — it adds the `orders.customer_ref` column and its index, which powers "My orders".)
4. In Supabase Dashboard → Authentication → Users, create an admin user with email/password.
5. Set `NEXT_PUBLIC_DEMO_MODE=false` and fill `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (server only; NEVER prefix it with NEXT_PUBLIC or commit it)
   - `NEXT_PUBLIC_SITE_URL`: your deployed website origin, e.g. `https://your-domain.vercel.app` (add this before generating/printing QR codes)
6. Run locally: `npm run dev`, then open `http://localhost:3000`.
7. Deploy to Vercel and set the same environment variables in Project Settings → Environment Variables.

## First run
- Preview customer menu: `/menu/table-01`
- Admin login: `/admin/login`
- Admin orders: `/admin/orders`
- Menu editor: `/admin/menu`
- Table QR codes: `/admin/tables`
- Guest order tracking: `/order/<order id>` (linked from "My Orders")

SQL seeds five starter tables (`table-01` through `table-05`). Add more in Admin → Table QR codes.
The admin dashboard uses Supabase Auth. Only create trusted staff/admin accounts in Supabase Auth.

## How "My Orders" works
Each browser gets a random `customer_ref` token (stored in `localStorage` under `nidhivan_customer_ref`).
The token is sent with every order and stored in `orders.customer_ref`, so the order history endpoint
(`/api/orders?ref=<token>`) can return only that guest's orders. No guest accounts or passwords are needed.

## Notes
- QR codes must point to the production website URL before you print them.
- Orders require a registered active table code.
- Payment is collected at the restaurant; no payment gateway is included.
- Review all item names/prices against the source PDF before production. Some printed menu headings/words are unclear or inconsistent.
- This project is a starter implementation, not a managed hosting service. Configure backups and test the deployed workflow before using it for live restaurant operations.
