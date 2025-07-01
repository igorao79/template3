'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faX, 
  faTruck, 
  faPercent, 
  faGift,
  faUserPlus,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface PromoNotificationProps {
  type: 'FREE_DELIVERY' | 'DISCOUNT_20' | 'FREE_ITEM'
  onLogin: () => void
}

export function PromoNotification({ type, onLogin }: PromoNotificationProps) {
  const [copied, setCopied] = useState(false)
  
  const getPromoData = () => {
    switch (type) {
      case 'FREE_DELIVERY':
        return {
          icon: faTruck,
          title: 'Бесплатная доставка!',
          description: 'Авторизируйтесь и получите бесплатную доставку на первый заказ',
          promoCode: 'FREEDEL',
          color: 'from-orange-500 to-amber-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        }
      case 'DISCOUNT_20':
        return {
          icon: faPercent,
          title: 'Скидка 20%!',
          description: 'Войдите в аккаунт и получите скидку 20% на весь заказ',
          promoCode: 'SAVE20',
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        }
      case 'FREE_ITEM':
        return {
          icon: faGift,
          title: 'Блюдо в подарок!',
          description: 'Авторизируйтесь и выберите любое блюдо в подарок к заказу',
          promoCode: 'FREEFOOD',
          color: 'from-orange-500 to-yellow-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        }
    }
  }

  const promoData = getPromoData()

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(promoData.promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy promo code:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="relative max-w-sm mx-auto bg-white rounded-lg shadow-xl border-2 border-gray-100 overflow-hidden"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${promoData.color}`} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-full ${promoData.bgColor}`}>
            <FontAwesomeIcon 
              icon={promoData.icon} 
              className={`h-5 w-5 ${promoData.textColor}`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {promoData.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {promoData.description}
            </p>
          </div>

          {/* Promo Code */}
          <div className={`p-3 ${promoData.bgColor} rounded-lg border border-dashed border-gray-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Промокод
                </p>
                <p className={`font-mono font-bold text-lg ${promoData.textColor}`}>
                  {promoData.promoCode}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPromoCode}
                className={`${promoData.textColor} hover:bg-white/80`}
              >
                <FontAwesomeIcon 
                  icon={copied ? faCheck : faCopy} 
                  className="h-4 w-4" 
                />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onLogin}
              className={`flex-1 bg-gradient-to-r ${promoData.color} hover:opacity-90 text-white font-medium`}
            >
              <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4 mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function PromoNotificationContainer() {
  const { 
    showPromoNotification, 
    promoNotificationType, 
    user,
    hidePromoNotification,
    showPromoNotificationAction
  } = useAppStore()
  
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  // Показываем уведомления для неавторизованных пользователей через случайные интервалы
  useEffect(() => {
    if (user?.isLoggedIn || showPromoNotification) return

    const showRandomPromo = () => {
      const promoTypes: Array<'FREE_DELIVERY' | 'DISCOUNT_20' | 'FREE_ITEM'> = [
        'FREE_DELIVERY', 
        'DISCOUNT_20', 
        'FREE_ITEM'
      ]
      const randomType = promoTypes[Math.floor(Math.random() * promoTypes.length)]
      showPromoNotificationAction(randomType)
    }

    // Показываем первое уведомление через 10 секунд
    const initialTimer = setTimeout(showRandomPromo, 10000)
    
    // Затем показываем случайные уведомления каждые 30-60 секунд
    const intervalTimer = setInterval(() => {
      if (!showPromoNotification) {
        showRandomPromo()
      }
    }, Math.random() * 30000 + 30000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    }
  }, [user?.isLoggedIn, showPromoNotification, showPromoNotificationAction])

  // Автоматически скрываем уведомление через 15 секунд
  useEffect(() => {
    if (!showPromoNotification) return

    const timer = setTimeout(() => {
      hidePromoNotification()
    }, 15000)

    return () => clearTimeout(timer)
  }, [showPromoNotification, hidePromoNotification])

  const handleLogin = () => {
    setProfileModalOpen(true)
    hidePromoNotification()
  }

  return (
    <>
      <AnimatePresence>
        {showPromoNotification && promoNotificationType && !user?.isLoggedIn && (
          <div className="fixed bottom-4 right-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PromoNotification 
                type={promoNotificationType} 
                onLogin={handleLogin}
              />
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={hidePromoNotification}
                className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-lg hover:bg-gray-50 rounded-full"
              >
                <FontAwesomeIcon icon={faX} className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal - placeholder, нужно интегрировать с существующей модалью */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Вход в систему</h3>
            <p className="text-gray-600 mb-4">
              Войдите, чтобы получить персональные предложения и отслеживать заказы
            </p>
            <Button 
              onClick={() => setProfileModalOpen(false)}
              className="w-full"
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 