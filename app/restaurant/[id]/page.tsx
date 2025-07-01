'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faMapMarkerAlt, 
  faPhone, 
  faClock, 
  faUtensils,
  faComments,
  faPlus,
  faCheck,
  faX,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/Loader'
import { AddReviewModal } from '@/components/review/AddReviewModal'
import { mockRestaurants, categories } from '@/lib/data'
import { useAppStore, isRestaurantOpen } from '@/lib/store'
import { Restaurant, MenuItem } from '@/lib/store'

export default function RestaurantPage() {
  const params = useParams()
  const { 
    addToCart, 
    user,
    isAddReviewModalOpen,
    openAddReviewModal,
    closeAddReviewModal
  } = useAppStore()
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const restaurantId = params.id as string
    
    // Имитируем загрузку данных ресторана
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      const foundRestaurant = mockRestaurants.find(r => r.id === restaurantId)
      setRestaurant(foundRestaurant || null)
      setIsLoading(false)
    }, 1000)

    // Обновляем время каждую минуту
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      clearTimeout(timer)
      clearInterval(timeInterval)
    }
  }, [params.id])

  // Загружаем отзывы из localStorage
  const getStoredReviews = () => {
    if (!restaurant) return []
    
    try {
      const storedReviews = JSON.parse(localStorage.getItem('restaurant-reviews') || '{}')
      return storedReviews[restaurant.id] || []
    } catch {
      return []
    }
  }

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant) return
    
    addToCart(item, restaurant.id)
    setAddedItems(prev => new Set([...prev, item.id]))
    
    // Убираем индикацию через 2 секунды
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 2000)
  }

  if (isLoading) {
    return <Loader fullScreen text="Загружаем меню ресторана..." />
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ресторан не найден</h1>
          <p className="text-gray-600">Возможно, ссылка устарела или ресторан временно недоступен</p>
        </div>
      </div>
    )
  }

  // Проверяем статус работы ресторана
  const restaurantStatus = isRestaurantOpen(restaurant)
  const isOpen = restaurantStatus.isOpen

  // Фильтрация блюд по категориям
  const filteredItems = restaurant.menu.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  )

  // Группировка блюд по категориям для показа категорий
  const availableCategories = [...new Set(restaurant.menu.map(item => item.category))]
  const categoryData = categories.filter(cat => 
    cat.id === 'all' || availableCategories.includes(cat.id)
  )

  const storedReviews = getStoredReviews()
  const allReviews = [...restaurant.reviews, ...storedReviews]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Status Alert */}
      {!isOpen && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700 font-medium">
                {restaurantStatus.message || 'Ресторан сейчас закрыт'}
              </span>
              <span className="text-red-600 ml-2 text-sm">
                • Вы можете ознакомиться с меню, но заказы временно недоступны
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Header */}
      <section className="relative h-64 sm:h-80 bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <Image 
          src={restaurant.image} 
          alt={restaurant.name}
          fill
          sizes="100vw"
          className="object-cover mix-blend-overlay"
        />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-mobile">
              {restaurant.name}
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 mb-4 text-mobile">
              {restaurant.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{restaurant.rating}</span>
                <span className="text-orange-200 ml-1">({restaurant.totalReviews})</span>
              </div>
              
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-1" />
                <span>Доставка {restaurant.deliveryFee} ₽</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex">
            {[
              { id: 'menu', label: 'Меню', icon: faUtensils },
              { id: 'reviews', label: 'Отзывы', icon: faComments },
              { id: 'info', label: 'Информация', icon: faMapMarkerAlt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'menu' | 'reviews' | 'info')}
                className={`flex-1 py-4 px-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Restaurant Name and Category Filters */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    {restaurant.name}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {categoryData.map((category) => {
                      const hasItems = category.id === 'all' || 
                        restaurant.menu.some(item => item.category === category.id)
                      
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          disabled={!hasItems}
                          className={`${
                            selectedCategory === category.id 
                              ? 'bg-orange-500 hover:bg-orange-600' 
                              : hasItems 
                                ? 'hover:bg-orange-50 hover:text-orange-600' 
                                : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {category.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="grid gap-4 sm:gap-6">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-lg shadow-sm border p-4 sm:p-6 card-mobile ${
                          !item.available ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-24 sm:h-24 h-48 rounded-lg overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 96px"
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 text-mobile">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-orange-600">
                                  {item.price} ₽
                                </span>
                                {!item.available && (
                                  <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                                    Недоступно
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3 text-mobile">
                              {item.description}
                            </p>
                            
                            {item.ingredients && (
                              <p className="text-sm text-gray-500 mb-4 text-mobile">
                                {item.ingredients.join(', ')}
                              </p>
                            )}
                            
                            <Button
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.available || !isOpen}
                              className={`w-full sm:w-auto ${
                                addedItems.has(item.id)
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : !isOpen || !item.available
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-orange-500 hover:bg-orange-600'
                              }`}
                            >
                              {!isOpen ? (
                                <>
                                  <FontAwesomeIcon icon={faClock} className="mr-2 h-4 w-4" />
                                  Ресторан закрыт
                                </>
                              ) : !item.available ? (
                                <>
                                  <FontAwesomeIcon icon={faX} className="mr-2 h-4 w-4" />
                                  Недоступно
                                </>
                              ) : addedItems.has(item.id) ? (
                                <>
                                  <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
                                  Добавлено
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                                  В корзину
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FontAwesomeIcon icon={faUtensils} className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        В этой категории пока нет блюд
                      </h3>
                      <p className="text-gray-500">
                        Выберите другую категорию
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Отзывы</h2>
                    <p className="text-gray-600">
                      {allReviews.length} {allReviews.length === 1 ? 'отзыв' : 'отзывов'}
                    </p>
                  </div>
                  
                  {user?.isLoggedIn && (
                    <Button
                      onClick={openAddReviewModal}
                      className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                      Написать отзыв
                    </Button>
                  )}
                </div>

                {allReviews.length > 0 ? (
                  <div className="space-y-4">
                    {allReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border card-mobile"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 rounded-full h-10 w-10 flex items-center justify-center">
                              <span className="text-orange-600 font-semibold">
                                {review.user_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        
                        <p className="text-gray-700 text-mobile">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faComments} className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Пока нет отзывов
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Станьте первым, кто оставит отзыв об этом ресторане
                    </p>
                    {user?.isLoggedIn && (
                      <Button
                        onClick={openAddReviewModal}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                        Написать отзыв
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Информация</h2>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Contact Info */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-mobile">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400 mr-3" />
                        <a href={`tel:${restaurant.phone}`} className="text-orange-600 hover:text-orange-700">
                          {restaurant.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Часы работы</h3>
                    <div className="space-y-2">
                      {restaurant.workingHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600">{schedule.day}</span>
                          <span className={schedule.isClosed ? 'text-red-500' : 'text-gray-900'}>
                            {schedule.isClosed ? 'Закрыто' : `${schedule.open} - ${schedule.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Условия доставки</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-full h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                          <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-orange-600" />
                        </div>
                        <p className="font-medium">{restaurant.deliveryTime}</p>
                        <p className="text-sm text-gray-500">Время доставки</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-full h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                          <span className="text-orange-600 font-bold">₽</span>
                        </div>
                        <p className="font-medium">{restaurant.deliveryFee} ₽</p>
                        <p className="text-sm text-gray-500">Стоимость доставки</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-full h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-orange-600" />
                        </div>
                        <p className="font-medium">{restaurant.minimumOrder} ₽</p>
                        <p className="text-sm text-gray-500">Минимальный заказ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={closeAddReviewModal}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </div>
  )
} 