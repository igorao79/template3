'use client'

import { useEffect } from 'react'
import { startOrderStatusUpdater } from '@/lib/store'

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    // Запускаем автоматическое обновление статусов заказов
    startOrderStatusUpdater()
  }, [])

  return <>{children}</>
} 