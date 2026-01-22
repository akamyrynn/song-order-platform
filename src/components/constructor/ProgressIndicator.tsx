/**
 * Progress Indicator Component
 * Shows current step in the multi-step form
 */

'use client'

import styles from './ProgressIndicator.module.css'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = [
  'Основная информация',
  'Музыкальный стиль',
  'Детали',
  'Контакты'
]

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className={styles.steps}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div 
            key={step} 
            className={`${styles.step} ${step === currentStep ? styles.active : ''} ${step < currentStep ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>
              {step < currentStep ? '✓' : step}
            </div>
            <div className={styles.stepLabel}>{stepLabels[step - 1]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
