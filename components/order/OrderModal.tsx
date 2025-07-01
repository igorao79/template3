'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faX, 
  faMapMarkerAlt, 
  faPhone, 
  faUser, 
  faCreditCard, 
  faCheck, 
  faArrowLeft, 
  faArrowRight,
  faTag,
  faPercent,
  faGift,
  faTruck
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { Order } from '@/lib/store'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const cart = useAppStore((state) => state.cart)
  const cartTotal = useAppStore((state) => state.cartTotal)
  const orderStep = useAppStore((state) => state.orderStep)
  const orderFormData = useAppStore((state) => state.orderFormData)
  const user = useAppStore((state) => state.user)
  const setOrderStep = useAppStore((state) => state.setOrderStep)
  const updateOrderFormData = useAppStore((state) => state.updateOrderFormData)
  const addOrder = useAppStore((state) => state.addOrder)
  const clearCart = useAppStore((state) => state.clearCart)
  const applyPromoCode = useAppStore((state) => state.applyPromoCode)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useOtherContact, setUseOtherContact] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [promoCode, setPromoCode] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedFreeItem, setSelectedFreeItem] = useState<any>(null)

  // Автоматически заполняем данные пользователя
  useEffect(() => {
    if (user && isOpen && !useOtherContact) {
      updateOrderFormData({ 
        name: user.name || '', 
        phone: user.phone || '' 
      })
    }
  }, [user, isOpen, useOtherContact, updateOrderFormData])

  // Рассчитываем стоимость с учетом промокодов
  const baseDeliveryFee = 150
  const actualDeliveryFee = useMemo(() => orderFormData.freeDelivery ? 0 : baseDeliveryFee, [orderFormData.freeDelivery])
  const discountAmount = useMemo(() => 
    orderFormData.discount ? (cartTotal * orderFormData.discount / 100) : 0,
    [orderFormData.discount, cartTotal]
  )
  const total = useMemo(() => cartTotal + actualDeliveryFee - discountAmount, [cartTotal, actualDeliveryFee, discountAmount])

  const validateStep = useCallback((step: number, updateErrors = true) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!orderFormData.address.trim()) {
          newErrors.address = 'Адрес обязателен'
        } else if (orderFormData.address.length < 10) {
          newErrors.address = 'Введите полный адрес'
        }
        break

      case 2:
        if (!orderFormData.name.trim()) {
          newErrors.name = 'Имя обязательно'
        } else if (orderFormData.name.length < 2) {
          newErrors.name = 'Имя должно быть длиннее 2 символов'
        }

        if (!orderFormData.phone.trim()) {
          newErrors.phone = 'Телефон обязателен'
        } else if (!/^\+?[7-8][\d\s\-\(\)]{10,}$/.test(orderFormData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Неверный формат телефона'
        }
        break

      case 3:
        if (!orderFormData.paymentMethod) {
          newErrors.paymentMethod = 'Выберите способ оплаты'
        }
        break
    }

    if (updateErrors) {
      setErrors(newErrors)
    }
    return Object.keys(newErrors).length === 0
  }, [orderFormData])

  // Мемоизируем результат проверки для текущего шага
  const isCurrentStepValid = useMemo(() => {
    return validateStep(orderStep, false)
  }, [validateStep, orderStep])

  const handleNextStep = useCallback(() => {
    if (validateStep(orderStep, true) && orderStep < 3) {
      setOrderStep(orderStep + 1)
    }
  }, [validateStep, orderStep, setOrderStep])

  const handlePrevStep = useCallback(() => {
    if (orderStep > 1) {
      setOrderStep(orderStep - 1)
    }
  }, [orderStep, setOrderStep])

  const handleApplyPromoCode = useCallback(() => {
    const success = applyPromoCode(promoCode.trim().toUpperCase())
    
    if (success) {
      setErrors(prev => ({ ...prev, promo: '' }))
      setPromoCode('')
    } else {
      setErrors(prev => ({ ...prev, promo: 'Неверный промокод или уже использован' }))
    }
  }, [promoCode, applyPromoCode])

  const handleSubmitOrder = useCallback(async () => {
    if (!validateStep(orderStep, true)) return
    
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const restaurantGroups = cart.reduce((groups, item) => {
      const restaurantId = item.restaurant_id
      if (!groups[restaurantId]) {
        groups[restaurantId] = []
      }
      groups[restaurantId].push(item)
      return groups
    }, {} as Record<string, typeof cart>)

    const newOrder: Order = {
      id: Date.now().toString(),
      items: cart,
      total,
      deliveryFee: actualDeliveryFee,
      address: orderFormData.address,
      phone: orderFormData.phone,
      date: new Date().toLocaleDateString('ru-RU') + ' в ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'В обработке',
      restaurants: Object.keys(restaurantGroups),
    }

    addOrder(newOrder)
    clearCart()
    setIsSubmitting(false)
    setOrderStep(4)
  }, [validateStep, orderStep, cart, total, actualDeliveryFee, orderFormData, addOrder, clearCart, setOrderStep])

  // Мемоизированные обработчики полей ввода
  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateOrderFormData({ address: e.target.value })
    setErrors(prev => ({ ...prev, address: '' }))
  }, [updateOrderFormData])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateOrderFormData({ name: e.target.value })
    setErrors(prev => ({ ...prev, name: '' }))
  }, [updateOrderFormData])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateOrderFormData({ phone: e.target.value })
    setErrors(prev => ({ ...prev, phone: '' }))
  }, [updateOrderFormData])

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateOrderFormData({ notes: e.target.value })
  }, [updateOrderFormData])

  const handlePaymentChange = useCallback((value: string) => {
    updateOrderFormData({ paymentMethod: value })
    setErrors(prev => ({ ...prev, paymentMethod: '' }))
  }, [updateOrderFormData])

  const handlePromoCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase())
    setErrors(prev => ({ ...prev, promo: '' }))
  }, [])

  const promoInfo = useMemo(() => {
    if (orderFormData.freeDelivery) {
      return { type: 'delivery', icon: faTruck, text: 'Бесплатная доставка', color: 'text-blue-600' }
    }
    if (orderFormData.discount) {
      return { type: 'discount', icon: faPercent, text: `Скидка ${orderFormData.discount}%`, color: 'text-orange-600' }
    }
    if (orderFormData.freeItem) {
      return { type: 'item', icon: faGift, text: 'Блюдо в подарок', color: 'text-purple-600' }
    }
    return null
  }, [orderFormData.freeDelivery, orderFormData.discount, orderFormData.freeItem])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl h-[80vh]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
                <h2 className="text-lg font-semibold">Оформление заказа</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <FontAwesomeIcon icon={faX} className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              {orderStep <= 3 && (
                <div className="px-4 py-3 border-b flex-shrink-0">
                  <div className="flex justify-between mb-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          step <= orderStep
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(orderStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {orderStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8 text-orange-500 mb-2" />
                      <h3 className="text-lg font-semibold">Адрес доставки</h3>
                      <p className="text-gray-600 text-sm">Укажите точный адрес доставки</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Адрес</label>
                      <Input
                        placeholder="ул. Пример, д. 1, кв. 1"
                        value={orderFormData.address}
                        onChange={handleAddressChange}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {orderStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-orange-500 mb-2" />
                      <h3 className="text-lg font-semibold">Контактная информация</h3>
                      <p className="text-gray-600 text-sm">Как с вами связаться</p>
                    </div>

                    {!useOtherContact && user ? (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Контактные данные</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUseOtherContact(true)}
                          >
                            Изменить
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-500">Имя</p>
                            <p className="font-medium">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Телефон</p>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Имя</label>
                          <Input
                            placeholder="Ваше имя"
                            value={orderFormData.name}
                            onChange={handleNameChange}
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Телефон</label>
                          <Input
                            placeholder="+7 (999) 123-45-67"
                            value={orderFormData.phone}
                            onChange={handlePhoneChange}
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                          )}
                        </div>
                        
                        {user && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUseOtherContact(false)
                              updateOrderFormData({ name: user.name || '', phone: user.phone || '' })
                            }}
                          >
                            Использовать мои данные
                          </Button>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Комментарий к заказу</label>
                      <Textarea
                        placeholder="Дополнительные пожелания..."
                        value={orderFormData.notes || ''}
                        onChange={handleNotesChange}
                        rows={3}
                      />
                    </div>
                  </motion.div>
                )}

                {orderStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <FontAwesomeIcon icon={faCreditCard} className="h-8 w-8 text-orange-500 mb-2" />
                      <h3 className="text-lg font-semibold">Способ оплаты</h3>
                      <p className="text-gray-600 text-sm">Выберите удобный способ</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Способ оплаты</label>
                      <Select
                        value={orderFormData.paymentMethod}
                        onValueChange={handlePaymentChange}
                      >
                        <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Выберите способ оплаты" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Наличными при получении</SelectItem>
                          <SelectItem value="card">Картой при получении</SelectItem>
                          <SelectItem value="online">Онлайн оплата</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.paymentMethod && (
                        <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
                      )}
                    </div>

                    {/* Форма карты для онлайн оплаты */}
                    {orderFormData.paymentMethod === 'online' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border rounded-lg p-3 space-y-3 bg-blue-50 overflow-hidden"
                      >
                        <h4 className="font-medium text-blue-900 text-sm">Данные карты</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <Input placeholder="1234 5678 9012 3456" className="bg-white text-sm h-8" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="12/25" className="bg-white text-sm h-8" />
                            <Input placeholder="123" className="bg-white text-sm h-8" />
                          </div>
                          <div>
                            <Input placeholder="IVAN PETROV" className="bg-white text-sm h-8" />
                          </div>
                        </div>
                        <p className="text-xs text-blue-700">
                          🔒 Защищенное соединение
                        </p>
                      </motion.div>
                    )}

                    {/* Промокод */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faTag} className="h-4 w-4 text-orange-500" />
                        <h4 className="font-medium">Промокод</h4>
                      </div>
                      
                      {promoInfo ? (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={promoInfo.icon} className={`h-4 w-4 ${promoInfo.color}`} />
                              <span className="font-medium text-green-800">{promoInfo.text}</span>
                            </div>
                          </div>
                          
                          {orderFormData.freeItem && promoInfo.type === 'item' && (
                            <div className="border rounded-lg p-3 bg-purple-50">
                              <h5 className="font-medium text-sm mb-2">Выберите бесплатное блюдо:</h5>
                              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                                {cart.slice(0, 5).map((cartItem) => (
                                  <button
                                    key={cartItem.id}
                                    onClick={() => setSelectedFreeItem(cartItem.item)}
                                    className={`text-left p-2 rounded border text-xs ${
                                      selectedFreeItem?.id === cartItem.item.id
                                        ? 'border-purple-500 bg-purple-100'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                  >
                                    <div className="font-medium">{cartItem.item.name}</div>
                                    <div className="text-gray-500">{cartItem.item.price} ₽</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Введите промокод"
                            value={promoCode}
                            onChange={handlePromoCodeChange}
                            className={errors.promo ? 'border-red-500' : ''}
                          />
                          <Button
                            onClick={handleApplyPromoCode}
                            disabled={!promoCode.trim()}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Применить
                          </Button>
                        </div>
                      )}
                      
                      {errors.promo && (
                        <p className="text-red-500 text-xs">{errors.promo}</p>
                      )}
                    </div>

                    {/* Итого */}
                    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                      <h4 className="font-medium">Итого к оплате</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Сумма заказа:</span>
                          <span>{cartTotal} ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Доставка:</span>
                          <span className={orderFormData.freeDelivery ? 'text-green-600' : ''}>
                            {orderFormData.freeDelivery ? 'Бесплатно' : `${baseDeliveryFee} ₽`}
                          </span>
                        </div>
                        {orderFormData.discount && (
                          <div className="flex justify-between text-orange-600">
                            <span>Скидка {orderFormData.discount}%:</span>
                            <span>-{Math.round(discountAmount)} ₽</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                          <span>К оплате:</span>
                          <span className="text-orange-500">{Math.round(total)} ₽</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {orderStep === 4 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="bg-green-100 rounded-full h-16 w-16 mx-auto flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Заказ оформлен!</h3>
                    <p className="text-gray-600 mb-6">
                      Ваш заказ принят в обработку. Мы свяжемся с вами в ближайшее время.
                    </p>
                    <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
                      Закрыть
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {orderStep <= 3 && (
                <div className="border-t bg-white p-4">
                  <div className="flex justify-between space-x-3">
                    {orderStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
                        Назад
                      </Button>
                    )}
                    
                    {orderStep < 3 ? (
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        disabled={!isCurrentStepValid}
                      >
                        Далее
                        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitOrder}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting || !isCurrentStepValid}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Оформляем...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2" />
                            Оформить заказ
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 