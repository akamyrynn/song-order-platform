/**
 * Admin Dashboard Page
 * Validates: Requirements 5.1, 11.3
 */

import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Админ-панель | Custom Song Platform',
  description: 'Управление заказами',
}

export default function AdminPage() {
  // Временно без аутентификации
  // TODO: Добавить проверку JWT токена
  
  return <AdminDashboard />
}
