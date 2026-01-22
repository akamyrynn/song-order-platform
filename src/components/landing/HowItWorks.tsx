/**
 * How It Works Section Component
 * Validates: Requirements 1.1, 12.2, 12.4
 */

'use client'

import styles from './HowItWorks.module.css'

const steps = [
  {
    number: '01',
    title: 'Заполните конструктор',
    description: 'Расскажите о получателе, выберите стиль музыки и настроение песни'
  },
  {
    number: '02',
    title: 'Мы создаем песню',
    description: 'Наши музыканты работают над вашим заказом'
  },
  {
    number: '03',
    title: 'Прослушайте результат',
    description: 'Получите уведомление в Telegram и прослушайте готовую песню'
  },
  {
    number: '04',
    title: 'Выберите тариф',
    description: 'Оплатите и получите файл песни в высоком качестве'
  }
]

export default function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          Как это работает
        </h2>
        
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.step} stagger-item`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
