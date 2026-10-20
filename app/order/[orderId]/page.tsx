import OrderTracker from '../../../components/OrderTracker';

export const metadata = { title: 'Track your order' };

export default async function OrderStatus({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const safeId = decodeURIComponent(orderId).slice(0, 60);
  return <OrderTracker orderId={safeId} />;
}
