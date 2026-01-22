/**
 * Hero Section Component
 * Validates: Requirements 1.1, 1.2, 12.1, 12.2, 12.3, 12.5, 12.7
 */

'use client'

import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Atmospheric background - Requirement 12.5 */}
      <div className={styles.backgroundMesh} aria-hidden="true" />
      
      <div className={`container ${styles.heroContent}`}>
        {/* Main heading with distinctive typography - Requirement 12.1 */}
        <h1 className={`${styles.title} stagger-item`}>
          Создайте песню,
          <br />
          <span className={styles.titleAccent}>которая запомнится</span>
          <br />
          навсегда
        </h1>
        
        {/* Subtitle */}
        <p className={`${styles.subtitle} stagger-item`}>
          Профессиональная персонализированная песня для особенного человека.
          <br />
          Уникальная музыка, созданная специально для вас.
        </p>
        
        {/* CTA Button with animation - Requirements 12.3, 12.7 */}
        <div className={`${styles.ctaContainer} stagger-item`}>
          <Link href="/constructor" className={styles.ctaButton}>
            <span className={styles.ctaText}>Создать песню</span>
            <span className={styles.ctaIcon} aria-hidden="true">→</span>
          </Link>
          
          <p className={styles.ctaHint}>
            Заполните параметры • Получите уникальную песню
          </p>
        </div>
      </div>
    </section>
  )
}
