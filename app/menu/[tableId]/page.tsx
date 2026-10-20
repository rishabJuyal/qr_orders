
import MenuClient from '../../../components/MenuClient';
export default async function MenuPage({ params }: { params: Promise<{tableId:string}> }) {
 const {tableId}=await params;
 const safeTable=decodeURIComponent(tableId).replace(/[^a-zA-Z0-9-]/g,'').slice(0,20);
 return <MenuClient tableId={safeTable || 'Unassigned'} />;
}
