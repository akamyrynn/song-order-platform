/**
 * Admin Order Detail Page
 * Validates: Requirements 5.2, 11.4, 11.5
 */

import OrderDetail from '@/components/admin/OrderDetail'

export const metadata = {
  title: 'Детали заказа | Админ-панель',
  description: 'Просмотр и управление заказом',
}

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetail orderId={params.id} />
}
