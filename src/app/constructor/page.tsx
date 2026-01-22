/**
 * Constructor Page
 * Validates: Requirements 2.1, 2.2, 2.3, 3.2, 3.3, 3.4, 4.1
 */

import ConstructorForm from '@/components/constructor/ConstructorForm'
import styles from './constructor.module.css'

export const dynamic = 'force-dynamic'

export default function ConstructorPage() {
  return (
    <main className={styles.constructorPage}>
      <div className={styles.background} aria-hidden="true" />
      
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Создайте вашу песню</h1>
          <p className={styles.subtitle}>
            Заполните параметры, и мы создадим уникальную композицию специально для вас
          </p>
        </div>
        
        <ConstructorForm />
      </div>
    </main>
  )
}
