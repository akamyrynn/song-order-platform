/**
 * Admin Order Detail Page
 * Validates: Requirements 5.2, 11.4, 11.5
 */

import OrderDetail from '@/components/admin/OrderDetail'

export const metadata = {
  title: 'Детали заказа | Админ-панель',
  description: 'Просмотр и управление заказом',
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderDetail orderId={id} />
}
