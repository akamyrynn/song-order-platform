/**
 * Order Detail Component
 * Validates: Requirements 5.2, 11.4, 11.5
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './OrderDetail.module.css'

interface Order {
  id: string
  orderNumber: string
  status: string
  recipientName: string
  relationship?: string
  occasion?: string
  musicalStyle?: string[]
  mood?: string
  tempo?: string
  specialRequests?: string
  phoneNumber: string
  telegramUserId?: string
  telegramUsername?: string
  selectedTier?: string
  songFileUrl?: string
  songFileName?: string
  createdAt: string
  updatedAt: string
  readyAt?: string
  paidAt?: string
  completedAt?: string
  messages?: any[]
  payments?: any[]
}

export default function OrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        setSelectedStatus(data.status)
      } else {
        console.error('Order not found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        await fetchOrder()
        alert('Статус успешно обновлен')
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error || 'Не удалось обновить статус'}`)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Произошла ошибка при обновлении статуса')
    } finally {
      setUpdating(false)
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

  if (loading) {
    return (
      <div className={styles.orderDetailPage}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <div className={styles.error}>Заказ не найден</div>
      </div>
    )
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/orders" className={styles.backButton}>
            ← Назад к списку
          </Link>
          <h1 className={styles.title}>Заказ {order.orderNumber}</h1>
        </div>
      </div>

      <div className={styles.content}>
        {/* Status Management */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Управление статусом</h2>
          <div className={styles.statusControl}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="new">Новый</option>
              <option value="in_progress">В работе</option>
              <option value="ready">Готов</option>
              <option value="paid">Оплачен</option>
              <option value="completed">Завершен</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === order.status}
              className={styles.updateButton}
            >
              {updating ? 'Обновление...' : 'Обновить статус'}
            </button>
          </div>
        </div>

        {/* Order Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Информация о заказе</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Номер заказа:</span>
              <span className={styles.infoValue}>{order.orderNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Статус:</span>
              <span className={styles.infoValue}>{getStatusLabel(order.status)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Дата создания:</span>
              <span className={styles.infoValue}>
                {new Date(order.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Последнее обновление:</span>
              <span className={styles.infoValue}>
                {new Date(order.updatedAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Информация о получателе</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Имя:</span>
              <span className={styles.infoValue}>{order.recipientName}</span>
            </div>
            {order.relationship && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Отношения:</span>
                <span className={styles.infoValue}>{order.relationship}</span>
              </div>
            )}
            {order.occasion && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Повод:</span>
                <span className={styles.infoValue}>{order.occasion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Musical Preferences */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Музыкальные предпочтения</h2>
          <div className={styles.infoGrid}>
            {order.musicalStyle && order.musicalStyle.length > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Стили:</span>
                <span className={styles.infoValue}>
                  {order.musicalStyle.join(', ')}
                </span>
              </div>
            )}
            {order.mood && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Настроение:</span>
                <span className={styles.infoValue}>{order.mood}</span>
              </div>
            )}
            {order.tempo && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Темп:</span>
                <span className={styles.infoValue}>{order.tempo}</span>
              </div>
            )}
          </div>
          {order.specialRequests && (
            <div className={styles.specialRequests}>
              <h3 className={styles.subsectionTitle}>Особые пожелания:</h3>
              <p className={styles.requestsText}>{order.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Контактная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Телефон:</span>
              <span className={styles.infoValue}>{order.phoneNumber}</span>
            </div>
            {order.telegramUserId && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telegram ID:</span>
                <span className={styles.infoValue}>{order.telegramUserId}</span>
              </div>
            )}
            {order.telegramUsername && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telegram Username:</span>
                <span className={styles.infoValue}>@{order.telegramUsername}</span>
              </div>
            )}
          </div>
        </div>

        {/* File Information */}
        {order.songFileUrl && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Файл песни</h2>
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{order.songFileName || 'song.mp3'}</p>
              <a href={order.songFileUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
                Скачать файл
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
