/**
 * Admin Dashboard Component
 * Validates: Requirements 5.1, 11.3
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './AdminDashboard.module.css'

interface OrderStats {
  total: number
  new: number
  inProgress: number
  ready: number
  paid: number
  completed: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  recipientName: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    ready: 0,
    paid: 0,
    completed: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all orders
      const response = await fetch('/api/orders?limit=100')
      const data = await response.json()
      
      if (data.orders) {
        // Calculate stats
        const orders = data.orders
        const newStats: OrderStats = {
          total: orders.length,
          new: orders.filter((o: any) => o.status === 'new').length,
          inProgress: orders.filter((o: any) => o.status === 'in_progress').length,
          ready: orders.filter((o: any) => o.status === 'ready').length,
          paid: orders.filter((o: any) => o.status === 'paid').length,
          completed: orders.filter((o: any) => o.status === 'completed').length
        }
        setStats(newStats)
        
        // Get recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новый',
      in_progress: 'В работе',
      ready: 'Готов',
      paid: 'Оплачен',
      completed: 'Завершен'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: styles.statusNew,
      in_progress: styles.statusInProgress,
      ready: styles.statusReady,
      paid: styles.statusPaid,
      completed: styles.statusCompleted
    }
    return colors[status] || ''
  }

  if (loading) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    )
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Админ-панель</h1>
        <Link href="/admin/orders" className={styles.viewAllButton}>
          Все заказы →
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Всего заказов</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.new}</div>
            <div className={styles.statLabel}>Новые</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.inProgress}</div>
            <div className={styles.statLabel}>В работе</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.ready}</div>
            <div className={styles.statLabel}>Готовы</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.paid}</div>
            <div className={styles.statLabel}>Оплачены</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Завершены</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={styles.recentOrders}>
        <h2 className={styles.sectionTitle}>Последние заказы</h2>
        
        {recentOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Пока нет заказов</p>
          </div>
        ) : (
          <div className={styles.ordersTable}>
            <table>
              <thead>
                <tr>
                  <th>Номер заказа</th>
                  <th>Получатель</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderNumber}>{order.orderNumber}</td>
                    <td>{order.recipientName}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <Link href={`/admin/orders/${order.id}`} className={styles.viewButton}>
                        Просмотр
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
