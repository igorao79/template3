'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheck, 
  faSpinner, 
  faTruck, 
  faClockRotateLeft,
  faX
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface StatusNotificationProps {
  orderId: string
  oldStatus: string
  newStatus: string
}

export function StatusNotification({ orderId, oldStatus, newStatus }: StatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'В обработке':
        return faClockRotateLeft
      case 'Готовится':
        return faSpinner
      case 'В пути':
        return faTruck
      case 'Доставлен':
        return faCheck
      default:
        return faClockRotateLeft
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В обработке':
        return 'text-yellow-600'
      case 'Готовится':
        return 'text-blue-600'
      case 'В пути':
        return 'text-orange-600'
      case 'Доставлен':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'В обработке':
        return 'Ваш заказ принят в обработку'
      case 'Готовится':
        return 'Ваш заказ готовится'
      case 'В пути':
        return 'Ваш заказ в пути'
      case 'Доставлен':
        return 'Ваш заказ доставлен!'
      default:
        return 'Статус заказа изменен'
    }
  }

  // Автоматически скрываем через 8 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="relative max-w-sm bg-white rounded-lg shadow-xl border-2 border-orange-200 overflow-hidden"
    >
      {/* Orange Header */}
      <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-full bg-orange-50">
            {newStatus === 'Готовится' ? (
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            ) : (
              <FontAwesomeIcon 
                icon={getStatusIcon(newStatus)} 
                className={`h-5 w-5 ${getStatusColor(newStatus)}`}
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faX} className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Заказ #{orderId}
            </h3>
            <p className="text-orange-600 font-medium text-sm">
              {getStatusMessage(newStatus)}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            {oldStatus} → {newStatus}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StatusNotificationContainer() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    orderId: string
    oldStatus: string
    newStatus: string
  }>>([])

  const { user } = useAppStore()

  // Слушаем изменения статуса заказов
  useEffect(() => {
    if (!user?.orders) return

    // Здесь можно добавить логику отслеживания изменений статуса
    // Пока что уведомления будут добавляться через updateOrderStatus в store
  }, [user?.orders])

  // Добавим функцию для показа уведомления (можно вызывать из store)
  const showStatusNotification = (orderId: string, oldStatus: string, newStatus: string) => {
    const notification = {
      id: Date.now().toString(),
      orderId,
      oldStatus,
      newStatus
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Убираем уведомление через 8 секунд
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 8000)
  }

  // Добавляем функцию в глобальную область видимости для вызова из store
  useEffect(() => {
    // @ts-ignore
    window.showStatusNotification = showStatusNotification
  }, [])

  return (
    <div className="fixed bottom-20 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <StatusNotification
            key={notification.id}
            orderId={notification.orderId}
            oldStatus={notification.oldStatus}
            newStatus={notification.newStatus}
          />
        ))}
      </AnimatePresence>
    </div>
  )
} 