/**
 * Admin Orders List Page
 * Validates: Requirements 5.1, 5.4
 */

import OrdersList from '@/components/admin/OrdersList'

export const metadata = {
  title: 'Все заказы | Админ-панель',
  description: 'Список всех заказов с фильтрацией',
}

export default function AdminOrdersPage() {
  return <OrdersList />
}
