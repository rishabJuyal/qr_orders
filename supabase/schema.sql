
create extension if not exists pgcrypto;
create table if not exists public.menu_items (
 id text primary key, name text not null, category text not null,
 price numeric(10,2) not null check (price >= 0),
 is_available boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.restaurant_tables (
 id uuid primary key default gen_random_uuid(), table_code text unique not null,
 is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), order_number text unique not null,
 table_id uuid not null references public.restaurant_tables(id), table_code text not null,
 status text not null default 'new' check (status in ('new','accepted','preparing','ready','served','cancelled')),
 total_amount numeric(10,2) not null check (total_amount >= 0), note text, created_at timestamptz not null default now()
);
-- Guest tracking: ties an order to the device/browser that placed it so the
-- customer can see "My orders". Safe to re-run.
alter table public.orders add column if not exists customer_ref text;
create index if not exists orders_customer_ref_idx on public.orders(customer_ref);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 menu_item_id text not null, item_name text not null, unit_price numeric(10,2) not null check (unit_price >= 0),
 quantity integer not null check (quantity between 1 and 20), line_total numeric(10,2) not null check (line_total >= 0),
 created_at timestamptz not null default now()
);
insert into public.menu_items (id,name,category,price,is_available) values
('seed-1','Plain Rice','Rice',100,true),
('seed-2','Jeera Rice','Rice',120,true),
('seed-3','Pulao','Rice',150,true),
('seed-4','Fried Rice','Rice',160,true),
('seed-5','Schezwan Fried Rice','Rice',180,true),
('seed-6','Veg Biryani','Rice',220,true),
('seed-7','Paneer Biryani','Rice',250,true),
('seed-8','Paneer Tikka Platter','Starters',280,true),
('seed-9','Peshawali Paneer Tikka Platter','Starters',260,true),
('seed-10','Classic Paneer Tikka Platter','Starters',260,true),
('seed-11','Afghani Paneer Tikka Platter','Starters',270,true),
('seed-12','Soya Chaap Platter','Starters',260,true),
('seed-13','Peshawari Soya Chaap Platter','Starters',250,true),
('seed-14','Classic Soya Chaap Platter','Starters',250,true),
('seed-15','Afghani Soya Chaap Platter','Starters',260,true),
('seed-16','Platter from the Grill','Starters',300,true),
('seed-17','Hara-Bhara Kabab','Starters',240,true),
('seed-18','Dahi Kabab','Starters',260,true),
('seed-19','Seekh Kabab','Starters',250,true),
('seed-20','Malai Kabab','Starters',260,true),
('seed-21','Corn Cheese Kabab','Starters',260,true),
('seed-22','Maharaja Kabab Platter','Starters',300,true),
('seed-23','Tandoori Mushroom','Starters',280,true),
('seed-24','Crispy Stuffed Mushroom','Starters',340,true),
('seed-25','Chilli Paneer (Dry)','Starters',180,true),
('seed-26','Chilli Paneer (Gravy)','Starters',200,true),
('seed-27','Manchurian (Dry)','Starters',150,true),
('seed-28','Manchurian (Gravy)','Starters',180,true),
('seed-29','Honey Chilli Potato','Starters',160,true),
('seed-30','Crispy Chilli Mushroom','Starters',170,true),
('seed-31','Veg Pakoda','Starters',120,true),
('seed-32','Paneer Pakoda','Starters',150,true),
('seed-33','Paneer 65','Starters',240,true),
('seed-34','Paneer Masala Sandwich','Sandwiches',150,true),
('seed-35','Corn-Cheese Sandwich','Sandwiches',120,true),
('seed-36','Veg. Grilled Sandwich','Sandwiches',100,true),
('seed-37','Tomato Soup','Soups',100,true),
('seed-38','Tomato-Basil Soup','Soups',120,true),
('seed-39','Manchow Soup','Soups',120,true),
('seed-40','Lemon-Coriander Soup','Soups',100,true),
('seed-41','Sweet Corn Soup','Soups',120,true),
('seed-42','Margarita Pizza','Pizza & Breads',160,true),
('seed-43','Corn-Cheese Pizza','Pizza & Breads',180,true),
('seed-44','Onion-Capsicum Pizza','Pizza & Breads',180,true),
('seed-45','Paneer Pizza','Pizza & Breads',200,true),
('seed-46','Mix Veg. Pizza','Pizza & Breads',220,true),
('seed-47','Bread Pizza','Pizza & Breads',120,true),
('seed-48','Plain Bread & Butter (2 pcs.)','Pizza & Breads',60,true),
('seed-49','Butter Toast (4 pcs.)','Pizza & Breads',80,true),
('seed-50','Masala Toast (2 pcs.)','Pizza & Breads',60,true),
('seed-51','Garlic Bread (4 pcs.)','Pizza & Breads',120,true),
('seed-52','Dal Fry','Indian Main Course',150,true),
('seed-53','Dal Tadka','Indian Main Course',180,true),
('seed-54','Kashmiri Dal','Indian Main Course',170,true),
('seed-55','Dal Makhani','Indian Main Course',200,true),
('seed-56','Bhindi Masala','Indian Main Course',160,true),
('seed-57','Aloo Gobi','Indian Main Course',170,true),
('seed-58','Aloo Jeera','Indian Main Course',150,true),
('seed-59','Gobi Masala','Indian Main Course',160,true),
('seed-60','Kashmiri Dum Aloo','Indian Main Course',200,true),
('seed-61','Mix Veg','Indian Main Course',220,true),
('seed-62','Sev Bhaji','Indian Main Course',180,true),
('seed-63','Sev Tamatar','Indian Main Course',190,true),
('seed-64','Gatta Masala','Indian Main Course',150,true),
('seed-65','Kadhi Pakoda','Indian Main Course',160,true),
('seed-66','Veg. Makhan Wala','Indian Main Course',220,true),
('seed-67','Chana Masala','Indian Main Course',160,true),
('seed-68','Malai Kofta (Red)','Indian Main Course',200,true),
('seed-69','Malai Kofta (White)','Indian Main Course',220,true),
('seed-70','Kaju Curry (Red)','Indian Main Course',130,true),
('seed-71','Kaju Curry (White)','Indian Main Course',260,true),
('seed-72','Veg Jaipuri','Indian Main Course',220,true),
('seed-73','Nidhivan Special Shyam Savera','Indian Main Course',250,true),
('seed-74','Dahi Fry','Indian Main Course',150,true),
('seed-75','Soya Chaap Ki Sabzi','Indian Main Course',230,true),
('seed-76','Paneer Lababdar','Paneer Main Course',220,true),
('seed-77','Paneer Tikka Lababdar','Paneer Main Course',250,true),
('seed-78','Paneer Butter Masala','Paneer Main Course',200,true),
('seed-79','Kadhai Paneer','Paneer Main Course',240,true),
('seed-80','Paneer Bhurji','Paneer Main Course',230,true),
('seed-81','Tawa Paneer','Paneer Main Course',200,true),
('seed-82','Paneer Khurchan','Paneer Main Course',240,true),
('seed-83','Handi Paneer','Paneer Main Course',220,true),
('seed-84','Palak Paneer','Paneer Main Course',210,true),
('seed-85','Khoya Paneer','Paneer Main Course',230,true),
('seed-86','Matar Paneer','Paneer Main Course',200,true),
('seed-87','Khoya Matar Paneer','Paneer Main Course',230,true),
('seed-88','Paneer Do Pyaza','Paneer Main Course',250,true),
('seed-89','Lahsuni Methi Sahi Paneer','Paneer Main Course',200,true),
('seed-90','Tawa Roti (Plain)','Breads',15,true),
('seed-91','Tawa Roti (Butter)','Breads',18,true),
('seed-92','Tandoori Roti (Plain)','Breads',20,true),
('seed-93','Tandoori Roti (Butter)','Breads',25,true),
('seed-94','Missi Roti (Plain)','Breads',25,true),
('seed-95','Missi Roti (Butter)','Breads',30,true),
('seed-96','Lachha Paratha','Breads',30,true),
('seed-97','Garlic Lachha Paratha','Breads',40,true),
('seed-98','Butter Naan','Breads',30,true),
('seed-99','Garlic Naan','Breads',40,true),
('seed-100','Stuffed Naan','Breads',50,true),
('seed-101','Masala Pepsi','Beverages & Ice Cream',30,true),
('seed-102','Cold Coffee Without Ice Cream','Beverages & Ice Cream',80,true),
('seed-103','Cold Coffee with Ice Cream','Beverages & Ice Cream',100,true),
('seed-104','Vanilla Shake','Beverages & Ice Cream',120,true),
('seed-105','Strawberry Shake','Beverages & Ice Cream',130,true),
('seed-106','Chocolate Shake','Beverages & Ice Cream',130,true),
('seed-107','Mango Shake','Beverages & Ice Cream',120,true),
('seed-108','Oreo Shake','Beverages & Ice Cream',160,true),
('seed-109','Kitkat Shake','Beverages & Ice Cream',180,true),
('seed-110','Vanilla Ice Cream (1 Scoop)','Beverages & Ice Cream',30,true),
('seed-111','Butterscotch Ice Cream (1 Scoop)','Beverages & Ice Cream',40,true),
('seed-112','Strawberry Ice Cream (1 Scoop)','Beverages & Ice Cream',30,true),
('seed-113','Chocolate Ice Cream (1 Scoop)','Beverages & Ice Cream',40,true),
('seed-114','Chai','Breakfast',30,true),
('seed-115','Coffee','Breakfast',45,true),
('seed-116','Curd','Breakfast',30,true),
('seed-117','Buttermilk (Plain)','Breakfast',25,true),
('seed-118','Buttermilk (Masala)','Breakfast',30,true),
('seed-119','Lassi','Breakfast',60,true),
('seed-120','Bundi Raita','Breakfast',50,true),
('seed-121','Vegetable Raita','Breakfast',60,true),
('seed-122','Aloo Paratha','Breakfast',50,true),
('seed-123','Aloo Pyaaz Paratha','Breakfast',60,true),
('seed-124','Paneer Paratha','Breakfast',80,true),
('seed-125','Paneer Pyaaz Paratha','Breakfast',100,true),
('seed-126','Chole Bhature','Breakfast',150,true),
('seed-127','Bhature (2 pcs.)','Breakfast',40,true),
('seed-128','Chole Kulche','Breakfast',160,true),
('seed-129','Pav Bhaji','Breakfast',130,true),
('seed-130','Pav (2 pcs.)','Breakfast',40,true),
('seed-131','Puri Bhaji','Breakfast',100,true),
('seed-132','Plain Dosa','Breakfast',100,true),
('seed-133','Masala Dosa','Breakfast',120,true),
('seed-134','Maggie','Fast Food',80,true),
('seed-135','Veg Noodles','Fast Food',100,true),
('seed-136','Hakka Noodles','Fast Food',120,true),
('seed-137','Schezwan Noodles','Fast Food',130,true),
('seed-138','French Fries','Fast Food',100,true),
('seed-139','Spring Roll','Fast Food',150,true),
('seed-140','Peri Peri Paneer Burrito','Fast Food',120,true),
('seed-141','Veg Burger','Fast Food',80,true),
('seed-142','Paneer Burger','Fast Food',100,true),
('seed-143','Cheese Burger','Fast Food',120,true),
('seed-144','Paneer-Cheese Burger','Fast Food',140,true),
('seed-145','Steam Momos','Fast Food',80,true),
('seed-146','Fried Momos','Fast Food',100,true),
('seed-147','Paneer Momos','Fast Food',120,true),
('seed-148','Fried Paneer Momos','Fast Food',130,true),
('seed-149','Veg Cutlet','Fast Food',200,true),
('seed-150','Aloo Chaat','Fast Food',150,true),
('seed-151','Papdi Chaat','Fast Food',170,true),
('seed-152','Samosa Chaat','Fast Food',180,true),
('seed-153','Tandoori Momos','Fast Food',160,true),
('seed-154','Afghani Momos','Fast Food',200,true),
('seed-155','White Sauce Pasta','Fast Food',200,true),
('seed-156','Red Sauce Pasta','Fast Food',180,true),
('seed-157','Peanut Masala','Fast Food',100,true),
('seed-158','Masala Papad','Fast Food',80,true),
('seed-159','Mix Sauce Pasta','Fast Food',210,true),
('seed-160','Green Salad','Salads',50,true),
('seed-161','Kachumber Salad','Salads',80,true),
('seed-162','Deluxe Thali','Indian Thali',200,true),
('seed-163','Nidhivan Special Thali','Indian Thali',300,true)
on conflict (id) do nothing;
insert into public.restaurant_tables (table_code,is_active) values
('table-01',true),('table-02',true),('table-03',true),('table-04',true),('table-05',true)
on conflict (table_code) do nothing;

alter table public.menu_items enable row level security;
alter table public.restaurant_tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Anyone can view available menu" on public.menu_items;
create policy "Anyone can view available menu" on public.menu_items for select to anon, authenticated using (is_available = true);
drop policy if exists "Authenticated staff can manage menu" on public.menu_items;
create policy "Authenticated staff can manage menu" on public.menu_items for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated staff can view tables" on public.restaurant_tables;
create policy "Authenticated staff can view tables" on public.restaurant_tables for select to authenticated using (auth.uid() is not null);
drop policy if exists "Authenticated staff can manage tables" on public.restaurant_tables;
create policy "Authenticated staff can manage tables" on public.restaurant_tables for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated staff can view orders" on public.orders;
create policy "Authenticated staff can view orders" on public.orders for select to authenticated using (auth.uid() is not null);
drop policy if exists "Authenticated staff can update orders" on public.orders;
create policy "Authenticated staff can update orders" on public.orders for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated staff can insert orders" on public.orders;
create policy "Authenticated staff can insert orders" on public.orders for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "Authenticated staff can view order items" on public.order_items;
create policy "Authenticated staff can view order items" on public.order_items for select to authenticated using (auth.uid() is not null);
drop policy if exists "Authenticated staff can manage order items" on public.order_items;
create policy "Authenticated staff can manage order items" on public.order_items for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

do $$ begin
 alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null; when undefined_object then null;
end $$;
