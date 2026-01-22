/**
 * Orders List Component with Filtering
 * Validates: Requirements 5.1, 5.4
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './OrdersList.module.css'

interface Order {
  id: string
  orderNumber: string
  recipientName: string
  status: string
  phoneNumber: string
  createdAt: string
  occasion?: string
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, statusFilter, searchQuery])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=100')
      const data = await response.json()
      
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.recipientName.toLowerCase().includes(query) ||
        order.phoneNumber.includes(query)
      )
    }

    setFilteredOrders(filtered)
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
      <div className={styles.ordersPage}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    )
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        <div>
          <Link href="/admin" className={styles.backButton}>
            ← Назад к дашборду
          </Link>
          <h1 className={styles.title}>Все заказы</h1>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Поиск по номеру заказа, имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.statusFilters}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`${styles.filterButton} ${statusFilter === 'all' ? styles.filterActive : ''}`}
          >
            Все ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`${styles.filterButton} ${statusFilter === 'new' ? styles.filterActive : ''}`}
          >
            Новые ({orders.filter(o => o.status === 'new').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`${styles.filterButton} ${statusFilter === 'in_progress' ? styles.filterActive : ''}`}
          >
            В работе ({orders.filter(o => o.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('ready')}
            className={`${styles.filterButton} ${statusFilter === 'ready' ? styles.filterActive : ''}`}
          >
            Готовы ({orders.filter(o => o.status === 'ready').length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`${styles.filterButton} ${statusFilter === 'paid' ? styles.filterActive : ''}`}
          >
            Оплачены ({orders.filter(o => o.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`${styles.filterButton} ${statusFilter === 'completed' ? styles.filterActive : ''}`}
          >
            Завершены ({orders.filter(o => o.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Заказы не найдены</p>
        </div>
      ) : (
        <div className={styles.ordersTable}>
          <table>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Получатель</th>
                <th>Повод</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderNumber}>{order.orderNumber}</td>
                  <td>{order.recipientName}</td>
                  <td>{order.occasion || '—'}</td>
                  <td className={styles.phone}>{order.phoneNumber}</td>
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
  )
}
