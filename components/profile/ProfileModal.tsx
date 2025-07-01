'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faX, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faHistory, 
  faSignOutAlt,
  faSignInAlt,
  faClockRotateLeft,
  faTruck,
  faCheck,
  faSpinner,
  faCalendar,
  faMapMarkerAlt,
  faRuble,
  faClock,
  faUtensils
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/lib/store'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'В обработке':
      return faClock
    case 'Готовится':
      return faUtensils
    case 'В пути':
      return faTruck
    case 'Доставлен':
      return faCheck
    default:
      return faClock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'В обработке':
      return 'text-yellow-600 bg-yellow-100'
    case 'Готовится':
      return 'text-blue-600 bg-blue-100'
    case 'В пути':
      return 'text-orange-600 bg-orange-100'
    case 'Доставлен':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, loginUser, logoutUser, clearCart } = useAppStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile')
  const [isLoginMode, setIsLoginMode] = useState(true)
  
  // Форма авторизации
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    phone: '',
  })
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    }

    // Валидация имени
    if (!loginForm.name.trim()) {
      newErrors.name = 'Имя обязательно'
    } else if (loginForm.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    } else if (!/^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(loginForm.name)) {
      newErrors.name = 'Имя может содержать только буквы, пробелы и дефисы'
    }

    // Валидация email
    if (!loginForm.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      newErrors.email = 'Неверный формат email'
    }

    // Валидация телефона
    if (!loginForm.phone.trim()) {
      newErrors.phone = 'Телефон обязателен'
    } else if (!/^[\+]?[7-8][\d\s\-\(\)]{10,}$/.test(loginForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона (например: +7 900 123-45-67)'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleLogin = () => {
    if (!validateForm()) {
      return
    }
    
    loginUser(loginForm.name, loginForm.email, loginForm.phone)
    setLoginForm({ name: '', email: '', phone: '' })
    setErrors({ name: '', email: '', phone: '' })
  }

  const handleLogout = () => {
    clearCart()
    logoutUser()
    setActiveTab('profile')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В обработке':
        return 'bg-yellow-100 text-yellow-800'
      case 'Готовится':
        return 'bg-blue-100 text-blue-800'
      case 'В пути':
        return 'bg-purple-100 text-purple-800'
      case 'Доставлен':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl"
          >
            <div className="flex h-full max-h-[80vh] flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">
                  {user?.isLoggedIn ? 'Профиль' : 'Вход'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <FontAwesomeIcon icon={faX} className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs для авторизованного пользователя */}
              {user?.isLoggedIn && (
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2" />
                    Профиль
                  </button>
                  <button
                                          onClick={() => setActiveTab('history')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                                              activeTab === 'history'
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faHistory} className="h-4 w-4 mr-2" />
                    История заказов
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {!user?.isLoggedIn ? (
                  // Форма авторизации
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full h-16 w-16 mx-auto flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faSignInAlt} className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Добро пожаловать!</h3>
                      <p className="text-gray-600 text-sm">
                        Войдите, чтобы отслеживать заказы и получать персональные предложения
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Имя</label>
                        <Input
                          placeholder="Ваше имя"
                          value={loginForm.name}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, name: e.target.value })
                            if (errors.name) setErrors({ ...errors, name: '' })
                          }}
                          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="example@mail.com"
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, email: e.target.value })
                            if (errors.email) setErrors({ ...errors, email: '' })
                          }}
                          className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Телефон</label>
                        <Input
                          placeholder="+7 (999) 123-45-67"
                          value={loginForm.phone}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, phone: e.target.value })
                            if (errors.phone) setErrors({ ...errors, phone: '' })
                          }}
                          className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <Button 
                        onClick={handleLogin}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        <FontAwesomeIcon icon={faSignInAlt} className="h-4 w-4 mr-2" />
                        Войти
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Контент для авторизованного пользователя
                  <div>
                    {activeTab === 'profile' && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="bg-orange-100 rounded-full h-16 w-16 mx-auto flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center space-x-3">
                              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Имя</p>
                                <p className="font-medium">{user.name}</p>
                              </div>
                            </div>

                            <Separator />

                            <div className="flex items-center space-x-3">
                              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user.email}</p>
                              </div>
                            </div>

                            <Separator />

                            <div className="flex items-center space-x-3">
                              <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Телефон</p>
                                <p className="font-medium">{user.phone}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Заказов сделано</p>
                              <p className="text-2xl font-bold text-orange-500">{user.orders?.length || 0}</p>
                            </div>
                            <FontAwesomeIcon icon={faHistory} className="h-8 w-8 text-gray-400" />
                          </div>

                          <Button 
                            variant="outline" 
                            onClick={handleLogout}
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2" />
                            Выйти
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">История заказов</h3>
                        
                        {!user.orders || user.orders.length === 0 ? (
                          <div className="text-center py-8">
                            <FontAwesomeIcon icon={faHistory} className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">У вас пока нет заказов</p>
                            <p className="text-sm text-gray-400">Сделайте первый заказ!</p>
                          </div>
                        ) : (
                          <ScrollArea className="h-96">
                            <div className="space-y-4">
                              {user.orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">Заказ #{order.id}</p>
                                      <p className="text-sm text-gray-500">{order.date}</p>
                                    </div>
                                    <Badge className={getStatusColor(order.status)}>
                                      <FontAwesomeIcon 
                                        icon={getStatusIcon(order.status)} 
                                        className="h-3 w-3 mr-1" 
                                      />
                                      {order.status}
                                    </Badge>
                                  </div>

                                  <Separator />

                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <span>{item.item.name} x{item.quantity}</span>
                                        <span>{item.item.price * item.quantity} ₽</span>
                                      </div>
                                    ))}
                                  </div>

                                  <Separator />

                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Сумма заказа:</span>
                                      <span>{order.items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0)} ₽</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Доставка:</span>
                                      <span className={order.deliveryFee === 0 ? 'text-green-600' : ''}>
                                        {order.deliveryFee === 0 ? 'Бесплатно' : `${order.deliveryFee || 150} ₽`}
                                      </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-medium">
                                      <span>Итого:</span>
                                      <span className="font-bold">{order.total} ₽</span>
                                    </div>
                                  </div>

                                  <div className="text-xs text-gray-500">
                                    <FontAwesomeIcon icon={faUser} className="h-3 w-3 mr-1" />
                                    {order.address}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 