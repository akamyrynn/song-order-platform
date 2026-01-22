/**
 * Step 2: Music Style Selection
 * Validates: Requirements 2.1, 2.2
 */

'use client'

import { useState } from 'react'
import type { FormData } from '../types'
import styles from './Step.module.css'

interface Step2Props {
  data: FormData
  updateData: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

const musicStyles = [
  'Поп', 'Рок', 'Джаз', 'Блюз', 'Кантри',
  'Рэп', 'R&B', 'Электронная', 'Классика', 'Фолк'
]

const moods = [
  'Веселое', 'Романтичное', 'Грустное', 'Энергичное',
  'Спокойное', 'Вдохновляющее', 'Ностальгическое'
]

const tempos = [
  'Медленный', 'Средний', 'Быстрый'
]

export default function Step2MusicStyle({ data, updateData, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleStyle = (style: string) => {
    const currentStyles = data.musicalStyle || []
    if (currentStyles.includes(style)) {
      updateData({ musicalStyle: currentStyles.filter(s => s !== style) })
    } else {
      updateData({ musicalStyle: [...currentStyles, style] })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.musicalStyle || data.musicalStyle.length === 0) {
      newErrors.musicalStyle = 'Выберите хотя бы один стиль'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Выберите музыкальный стиль</h2>
      <p className={styles.stepDescription}>
        Какая музыка подойдет лучше всего? Можно выбрать несколько стилей.
      </p>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Музыкальные стили <span className={styles.required}>*</span>
        </label>
        <div className={styles.chipGrid}>
          {musicStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`${styles.chip} ${data.musicalStyle?.includes(style) ? styles.chipActive : ''}`}
            >
              {style}
            </button>
          ))}
        </div>
        {errors.musicalStyle && (
          <span className={styles.errorText}>{errors.musicalStyle}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Настроение</label>
        <div className={styles.chipGrid}>
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => updateData({ mood })}
              className={`${styles.chip} ${data.mood === mood ? styles.chipActive : ''}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Темп</label>
        <div className={styles.chipGrid}>
          {tempos.map((tempo) => (
            <button
              key={tempo}
              type="button"
              onClick={() => updateData({ tempo })}
              className={`${styles.chip} ${data.tempo === tempo ? styles.chipActive : ''}`}
            >
              {tempo}
            </button>
          ))}
        </div>
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
          onClick={handleNext}
          className={styles.buttonPrimary}
        >
          Далее →
        </button>
      </div>
    </div>
  )
}
