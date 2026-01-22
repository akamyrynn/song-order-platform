/**
 * Multi-step Constructor Form Component
 * Validates: Requirements 2.1, 2.2, 2.3, 3.2, 3.3, 3.4, 4.1
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ConstructorForm.module.css'
import Step1BasicInfo from './steps/Step1BasicInfo'
import Step2MusicStyle from './steps/Step2MusicStyle'
import Step3Details from './steps/Step3Details'
import Step4Contact from './steps/Step4Contact'
import ProgressIndicator from './ProgressIndicator'
import type { FormData } from './types'

const initialFormData: FormData = {
  recipientName: '',
  relationship: '',
  occasion: '',
  musicalStyle: [],
  mood: '',
  tempo: '',
  specialRequests: '',
  phoneNumber: '',
}

export default function ConstructorForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 4

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при создании заказа')
      }

      const order = await response.json()
      
      // Redirect to success page with order number
      router.push(`/order-success?orderNumber=${order.orderNumber}&orderId=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className={styles.formContent}>
        {currentStep === 1 && (
          <Step1BasicInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <Step2MusicStyle
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <Step3Details
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 4 && (
          <Step4Contact
            data={formData}
            updateData={updateFormData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </div>
    </div>
  )
}
