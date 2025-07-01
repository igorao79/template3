'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faX, 
  faShoppingCart, 
  faPlus, 
  faMinus, 
  faTrash,
  faUtensils,
  faTruck,
  faStore
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/lib/store'
import { mockRestaurants } from '@/lib/data'
import { useCallback, useMemo, useState } from 'react'
import { ProfileModal } from '@/components/profile/ProfileModal'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const cart = useAppStore((state) => state.cart)
  const cartTotal = useAppStore((state) => state.cartTotal)
  const user = useAppStore((state) => state.user)
  const updateCartItemQuantity = useAppStore((state) => state.updateCartItemQuantity)
  const removeFromCart = useAppStore((state) => state.removeFromCart)
  const clearCart = useAppStore((state) => state.clearCart)
  const isOrderModalOpen = useAppStore((state) => state.isOrderModalOpen)
  const setOrderModalOpen = useAppStore((state) => state.setOrderModalOpen)
  const setOrderStep = useAppStore((state) => state.setOrderStep)

  // Мемоизируем группировку товаров по ресторанам
  const restaurantGroups = useMemo(() => {
    return cart.reduce((groups, item) => {
      const restaurantId = item.restaurant_id
      if (!groups[restaurantId]) {
        const restaurant = mockRestaurants.find(r => r.id === restaurantId)
        groups[restaurantId] = {
          restaurant,
          items: []
        }
      }
      groups[restaurantId].items.push(item)
      return groups
    }, {} as Record<string, { restaurant: any, items: typeof cart }>)
  }, [cart])

  const deliveryFee = useMemo(() => Object.keys(restaurantGroups).length * 150, [restaurantGroups])
  const total = useMemo(() => cartTotal + deliveryFee, [cartTotal, deliveryFee])

  // Мемоизируем обработчики для предотвращения пересоздания
  const handleItemDecrease = useCallback((itemId: string, quantity: number) => {
    if (quantity === 1) {
      removeFromCart(itemId)
    } else {
      updateCartItemQuantity(itemId, quantity - 1)
    }
  }, [removeFromCart, updateCartItemQuantity])

  const handleItemIncrease = useCallback((itemId: string, quantity: number) => {
    updateCartItemQuantity(itemId, quantity + 1)
  }, [updateCartItemQuantity])

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleOrder = useCallback(() => {
    if (!user?.isLoggedIn) {
      setIsProfileModalOpen(true)
      return
    }
    setOrderStep(1)
    setOrderModalOpen(true)
    onClose()
  }, [user?.isLoggedIn, setOrderStep, setOrderModalOpen, onClose])

  const handleClearCart = useCallback(() => {
    clearCart()
  }, [clearCart])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5 text-orange-500" />
                    <h2 className="text-lg font-semibold">Корзина</h2>
                    {cart.length > 0 && (
                      <Badge className="bg-orange-500">{cart.length}</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <FontAwesomeIcon icon={faX} className="h-4 w-4" />
                  </Button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="rounded-full bg-gray-100 p-6 mb-4">
                        <FontAwesomeIcon icon={faShoppingCart} className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Корзина пуста
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Добавьте блюда из ресторанов
                      </p>
                      <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
                        <FontAwesomeIcon icon={faUtensils} className="h-4 w-4 mr-2" />
                        Выбрать блюда
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-6">
                        {Object.entries(restaurantGroups).map(([restaurantId, { restaurant, items }]) => (
                          <motion.div
                            key={restaurantId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            {/* Название ресторана */}
                            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                              <FontAwesomeIcon icon={faStore} className="h-4 w-4 text-gray-500" />
                              <h3 className="font-medium text-gray-900">{restaurant?.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {items.length} {items.length === 1 ? 'позиция' : 'позиции'}
                              </Badge>
                            </div>

                            {/* Товары из ресторана */}
                            <div className="space-y-3">
                              {items.map((item) => (
                                <motion.div
                                  key={item.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex items-center space-x-3 rounded-lg border p-3 hover:shadow-md transition-shadow"
                                >
                                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                                    <Image
                                      src={item.item.image}
                                      alt={item.item.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                      {item.item.name}
                                    </h4>
                                    <p className="text-orange-500 font-semibold text-sm">
                                      {item.item.price} ₽
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleItemDecrease(item.id, item.quantity)}
                                    >
                                      {item.quantity === 1 ? (
                                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                                      ) : (
                                        <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                                      )}
                                    </Button>

                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleItemIncrease(item.id, item.quantity)}
                                    >
                                      <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Доставка для ресторана */}
                            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faTruck} className="h-3 w-3" />
                                <span>Доставка из {restaurant?.name}</span>
                              </div>
                              <span className="font-medium">150 ₽</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="border-t bg-white p-4 space-y-4">
                    {/* Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Сумма заказа</span>
                        <span>{cartTotal} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Доставка ({Object.keys(restaurantGroups).length} ресторан{Object.keys(restaurantGroups).length > 1 ? 'а' : ''})</span>
                        <span>{deliveryFee} ₽</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Итого</span>
                        <span>{total} ₽</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        onClick={handleOrder}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        size="lg"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 mr-2" />
                        Оформить заказ
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleClearCart}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-2" />
                        Очистить корзину
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  )
} 