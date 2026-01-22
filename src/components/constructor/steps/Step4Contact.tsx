/**
 * Step 4: Contact Information and Submission
 * Validates: Requirements 2.3, 3.2, 3.3, 3.4, 4.1
 */

'use client'

import { useState } from 'react'
import { FormData } from '../ConstructorForm'
import styles from './Step.module.css'

interface Step4Props {
  data: FormData
  updateData: (data: Partial<FormData>) => void
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error: string | null
}

export default function Step4Contact({ 
  data, 
  updateData, 
  onBack, 
  onSubmit, 
  isSubmitting,
  error 
}: Step4Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string) => {
    // Basic international phone validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ''))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Укажите номер телефона'
    } else if (!validatePhone(data.phoneNumber)) {
      newErrors.phoneNumber = 'Неверный формат номера. Используйте международный формат (например: +79991234567)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit()
    }
  }

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Контактная информация</h2>
      <p className={styles.stepDescription}>
        Укажите ваш номер телефона. После создания заказа вы будете перенаправлены в Telegram-бот 
        для получения уведомлений и общения с нами.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber" className={styles.label}>
          Номер телефона <span className={styles.required}>*</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
          value={data.phoneNumber}
          onChange={(e) => updateData({ phoneNumber: e.target.value })}
          placeholder="+79991234567"
        />
        {errors.phoneNumber && (
          <span className={styles.errorText}>{errors.phoneNumber}</span>
        )}
        <span className={styles.helperText}>
          Используйте международный формат с кодом страны
        </span>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>Что дальше?</h3>
        <ol className={styles.infoList}>
          <li>Вы получите уникальный номер заказа</li>
          <li>Вас перенаправит в Telegram-бот</li>
          <li>Мы начнем работу над вашей песней</li>
          <li>Вы получите уведомление, когда песня будет готова</li>
        </ol>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onBack}
          className={styles.buttonSecondary}
          disabled={isSubmitting}
        >
          ← Назад
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.buttonPrimary}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание заказа...' : 'Создать заказ'}
        </button>
      </div>
    </div>
  )
}
