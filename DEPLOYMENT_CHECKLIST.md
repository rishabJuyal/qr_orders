# Go-live checklist

- [ ] Create Supabase project.
- [ ] Run `supabase/schema.sql` in SQL Editor.
- [ ] Create admin user in Supabase Authentication → Users.
- [ ] Copy `.env.example` to `.env.local` and set the three Supabase values.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the exact production origin (for example, `https://your-project.vercel.app`).
- [ ] Run `npm install` and `npm run dev`.
- [ ] Test one customer order and check that it appears in `/admin/orders`.
- [ ] Verify table QR codes open the correct `/menu/table-code` URL.
- [ ] Deploy to Vercel and configure all environment variables there.
- [ ] Download/print QR codes only after the production domain is final.
- [ ] Verify every item and price against the restaurant's source PDF before live use.

Security reminder: never expose or commit `SUPABASE_SERVICE_ROLE_KEY`.
