import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const neueMontreal = localFont({
  src: '../../public/fonts/NeueMontreal-Regular.otf',
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Персональные Песни | Custom Song Platform',
  description: 'Создайте уникальную песню для особенного человека. Профессиональное исполнение, индивидуальный подход.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={neueMontreal.variable}>
      <body>{children}</body>
    </html>
  )
}
