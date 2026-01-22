/**
 * Features Section Component
 * Validates: Requirements 1.1, 12.2, 12.3
 */

'use client'

import styles from './Features.module.css'

const features = [
  {
    icon: '🎵',
    title: 'Уникальная композиция',
    description: 'Каждая песня создается с нуля специально для вас. Никаких шаблонов.'
  },
  {
    icon: '🎤',
    title: 'Профессиональное исполнение',
    description: 'Опытные музыканты и вокалисты воплотят вашу идею в жизнь.'
  },
  {
    icon: '💝',
    title: 'Идеальный подарок',
    description: 'Удивите близкого человека песней, которую он не забудет никогда.'
  },
  {
    icon: '⚡',
    title: 'Быстрое создание',
    description: 'Получите готовую песню в течение нескольких дней.'
  }
]

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          Почему выбирают нас
        </h2>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.featureCard} stagger-item`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
