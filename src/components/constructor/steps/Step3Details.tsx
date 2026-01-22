/**
 * Step 3: Special Details and Requests
 * Validates: Requirements 2.1, 2.2
 */

'use client'

import type { FormData } from '../types'
import styles from './Step.module.css'

interface Step3Props {
  data: FormData
  updateData: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Details({ data, updateData, onNext, onBack }: Step3Props) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Особые пожелания</h2>
      <p className={styles.stepDescription}>
        Расскажите подробнее о том, что хотите услышать в песне. Это может быть история, 
        конкретные слова, воспоминания или любые другие детали.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="specialRequests" className={styles.label}>
          Ваши пожелания
        </label>
        <textarea
          id="specialRequests"
          className={styles.textarea}
          value={data.specialRequests}
          onChange={(e) => updateData({ specialRequests: e.target.value })}
          placeholder="Например: Хочу, чтобы в песне упоминалось наше первое путешествие в горы, где мы встретили рассвет..."
          rows={8}
        />
        <span className={styles.helperText}>
          Чем больше деталей вы предоставите, тем более персонализированной будет песня
        </span>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onBack}
          className={styles.buttonSecondary}
        >
          ← Назад
        </button>
        <button
          type="button"
          onClick={onNext}
          className={styles.buttonPrimary}
        >
          Далее →
        </button>
      </div>
    </div>
  )
}
