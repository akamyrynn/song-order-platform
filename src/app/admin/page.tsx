/**
 * Admin Dashboard Page
 * Validates: Requirements 5.1, 11.3
 */

import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель | Custom Song Platform',
  description: 'Управление заказами',
}

export default function AdminPage() {
  // Временно без аутентификации
  // TODO: Добавить проверку JWT токена
  
  return <AdminDashboard />
}
