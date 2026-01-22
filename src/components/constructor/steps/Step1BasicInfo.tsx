/**
 * Step 1: Basic Information
 * Validates: Requirements 2.1, 2.2
 */

'use client'

import { useState } from 'react'
import { FormData } from '../ConstructorForm'
import styles from './Step.module.css'

interface Step1Props {
  data: FormData
  updateData: (data: Partial<FormData>) => void
  onNext: () => void
}

export default function Step1BasicInfo({ data, updateData, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.recipientName.trim()) {
      newErrors.recipientName = 'Укажите имя получателя'
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
      <h2 className={styles.stepTitle}>Расскажите о получателе</h2>
      <p className={styles.stepDescription}>
        Для кого эта песня? Расскажите нам о человеке, которому она предназначена.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="recipientName" className={styles.label}>
          Имя получателя <span className={styles.required}>*</span>
        </label>
        <input
          id="recipientName"
          type="text"
          className={`${styles.input} ${errors.recipientName ? styles.inputError : ''}`}
          value={data.recipientName}
          onChange={(e) => updateData({ recipientName: e.target.value })}
          placeholder="Например: Анна"
        />
        {errors.recipientName && (
          <span className={styles.errorText}>{errors.recipientName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="relationship" className={styles.label}>
          Ваши отношения
        </label>
        <input
          id="relationship"
          type="text"
          className={styles.input}
          value={data.relationship}
          onChange={(e) => updateData({ relationship: e.target.value })}
          placeholder="Например: подруга, мама, коллега"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="occasion" className={styles.label}>
          Повод
        </label>
        <input
          id="occasion"
          type="text"
          className={styles.input}
          value={data.occasion}
          onChange={(e) => updateData({ occasion: e.target.value })}
          placeholder="Например: день рождения, свадьба, юбилей"
        />
      </div>

      <div className={styles.buttonGroup}>
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
