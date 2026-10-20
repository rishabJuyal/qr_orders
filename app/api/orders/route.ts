import { NextResponse } from 'next/server';
import { hasSupabaseConfig, supabaseAdmin } from '../../../lib/supabase/server';
export const dynamic = 'force-dynamic';

/** GET /api/orders?ref=<customer token>  ->  the guest's own orders
 *  GET /api/orders?id=<order id or number>  ->  a single order (live tracking) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ref = (url.searchParams.get('ref') || '').trim();
    const id = (url.searchParams.get('id') || '').trim();

    if (!hasSupabaseConfig()) {
      return NextResponse.json(
        { orders: [], order: null, warning: 'Supabase is not configured, so live order history is unavailable.' },
        { status: 200 },
      );
    }

    const supabase = supabaseAdmin();

    if (id) {
      const byNumber = /^[A-Za-z0-9-]{1,40}$/.test(id);
      const query = supabase
        .from('orders')
        .select('*,order_items(*)')
        .eq(byNumber ? 'order_number' : 'id', id)
        .maybeSingle();
      const { data, error } = await query;
      if (error) throw error;
      if (!data) return NextResponse.json({ order: null }, { status: 404 });
      return NextResponse.json({ order: data });
    }

    if (!ref) return NextResponse.json({ error: 'Missing customer reference.' }, { status: 400 });

    const { data, error } = await supabase
      .from('orders')
      .select('*,order_items(*)')
      .eq('customer_ref', ref)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      // The customer_ref column may not exist yet on an older database.
      console.warn('customer_ref lookup failed:', error.message);
      return NextResponse.json({ orders: [], warning: 'Order history is unavailable until the database is updated.' });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || 'Could not load orders.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
   const body=await req.json(); const tableId=String(body.tableId||'').trim();
   if(!tableId || tableId.length>30) return NextResponse.json({error:'Invalid table.'},{status:400});
   if(!Array.isArray(body.items)||body.items.length===0||body.items.length>50) return NextResponse.json({error:'Add at least one menu item.'},{status:400});
   const quantities=new Map<string,number>();
   for(const row of body.items){const id=String(row.menuItemId||'');const q=Number(row.quantity);if(!Number.isInteger(q)||q<1||q>20)return NextResponse.json({error:'Invalid item quantity.'},{status:400});quantities.set(id,(quantities.get(id)||0)+q);}
   const customerRef=String(body.customerRef||'').trim().slice(0,64);
   const supabase=supabaseAdmin();
   const ids=[...quantities.keys()];
   const {data:dbItems,error:menuError}=await supabase.from('menu_items').select('id,name,price,is_available').in('id',ids);
   if(menuError)throw menuError;
   const validated=[...quantities.entries()].map(([id,quantity])=>{const item=(dbItems||[]).find((x:any)=>x.id===id);if(!item||!item.is_available)throw new Error('A selected item is unavailable. Refresh the menu and try again.');return {menu_item_id:id,item_name:item.name,unit_price:Number(item.price),quantity,line_total:Number(item.price)*quantity};});
   const total=validated.reduce((s,x)=>s+x.line_total,0);
   const {data:table,error:tableErr}=await supabase.from('restaurant_tables').select('id,table_code').eq('table_code',tableId).eq('is_active',true).maybeSingle();
   if(tableErr) throw tableErr;
   if(!table) return NextResponse.json({error:'This table QR is not registered. Please ask staff for help.'},{status:400});
   const orderNumber='NID-'+Date.now().toString().slice(-7);
   const payload={order_number:orderNumber,table_id:table.id,table_code:table.table_code,status:'new',total_amount:total,note:String(body.note||'').slice(0,300)};
   let order:any=null; let error:any=null;
   ({data:order,error}=await supabase.from('orders').insert({...payload,customer_ref:customerRef||null}).select('id,order_number').single());
   if(error&&/customer_ref/i.test(error.message||'')){
     // Older databases without the customer_ref column still accept the order.
     ({data:order,error}=await supabase.from('orders').insert(payload).select('id,order_number').single());
   }
   if(error)throw error;
   const {error:itemsError}=await supabase.from('order_items').insert(validated.map(x=>({...x,order_id:order.id})));
   if(itemsError){await supabase.from('orders').delete().eq('id',order.id);throw itemsError;}
   return NextResponse.json({orderNumber:order.order_number,orderId:order.id});
  } catch(e:any){console.error(e);return NextResponse.json({error:e.message||'Order could not be placed.'},{status:500});}
 }
