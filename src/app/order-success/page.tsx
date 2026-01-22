/**
 * Order Success Page
 * Validates: Requirements 2.3, 3.2, 4.1
 */

'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import styles from './order-success.module.css'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const orderId = searchParams.get('orderId')

  // Generate Telegram bot deep link with order number
  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'your_bot'
  const telegramLink = `https://t.me/${telegramBotUsername}?start=${orderNumber}`

  return (
    <main className={styles.successPage}>
      <div className={styles.background} aria-hidden="true" />
      
      <div className="container">
        <div className={styles.successCard}>
          <div className={styles.iconContainer}>
            <div className={styles.successIcon}>✓</div>
          </div>
          
          <h1 className={styles.title}>Заказ успешно создан!</h1>
          
          <div className={styles.orderInfo}>
            <p className={styles.orderLabel}>Ваш номер заказа:</p>
            <p className={styles.orderNumber}>{orderNumber}</p>
          </div>
          
          <p className={styles.description}>
            Сохраните этот номер. Он понадобится для отслеживания статуса заказа.
          </p>
          
          <div className={styles.nextSteps}>
            <h2 className={styles.nextStepsTitle}>Что дальше?</h2>
            <ol className={styles.stepsList}>
              <li>Перейдите в наш Telegram-бот по кнопке ниже</li>
              <li>Бот автоматически привяжет ваш аккаунт к заказу</li>
              <li>Вы будете получать уведомления о статусе заказа</li>
              <li>Когда песня будет готова, вы сможете её прослушать</li>
            </ol>
          </div>
          
          <div className={styles.buttonGroup}>
            <a 
              href={telegramLink}
              className={styles.telegramButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть Telegram-бот
            </a>
            
            <Link href="/" className={styles.homeButton}>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.successPage}>
        <div className="container">
          <div className={styles.successCard}>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
