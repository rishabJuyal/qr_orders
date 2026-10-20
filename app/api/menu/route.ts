
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import seed from '../../../data/menu.json';
export const dynamic='force-dynamic';
export async function GET(){
 try {
  const sb=supabaseAdmin();
  const {data,error}=await sb.from('menu_items').select('id,name,category,price,is_available').eq('is_available',true).order('category').order('name');
  if(error)throw error;
  return NextResponse.json({items:data?.length?data:seed.map(x=>({...x,is_available:true}))});
 } catch(e:any) { return NextResponse.json({items:seed.map(x=>({...x,is_available:true})),warning:'Database menu unavailable; showing bundled menu.'}); }
}
