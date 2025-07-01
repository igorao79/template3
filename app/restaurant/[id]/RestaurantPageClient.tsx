'use client'

import { useState, useEffect } from 'react'
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
import { getImagePath } from '@/lib/paths'

interface RestaurantPageClientProps {
  paramsPromise: Promise<{ id: string }>
}

export default function RestaurantPageClient({ paramsPromise }: RestaurantPageClientProps) {
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
  const [params, setParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  useEffect(() => {
    if (!params) return
    
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
  }, [params?.id])

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
          src={getImagePath(restaurant.image)} 
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
              { id: 'info', label: 'О ресторане', icon: faMapMarkerAlt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.id === 'reviews' && (
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {allReviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Category Filters */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {categoryData.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${
                        selectedCategory === category.id 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={getImagePath(item.image)}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">Недоступно</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      {item.ingredients && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">
                            {item.ingredients.join(', ')}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-orange-600">{item.price} ₽</span>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.available || !isOpen}
                          size="sm"
                          className={`${
                            addedItems.has(item.id)
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-orange-500 hover:bg-orange-600'
                          } ${!item.available || !isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FontAwesomeIcon 
                            icon={addedItems.has(item.id) ? faCheck : faPlus} 
                            className="h-4 w-4 mr-1" 
                          />
                          {addedItems.has(item.id) ? 'Добавлено' : 'В корзину'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">В этой категории пока нет блюд</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Отзывы клиентов</h2>
                  {user?.isLoggedIn && (
                    <Button onClick={openAddReviewModal} className="bg-orange-500 hover:bg-orange-600">
                      Оставить отзыв
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {allReviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">
                              {review.user_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.user_name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={faStar}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {allReviews.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Пока нет отзывов о ресторане</p>
                    {user?.isLoggedIn && (
                      <Button onClick={openAddReviewModal} className="bg-orange-500 hover:bg-orange-600">
                        Стать первым!
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">О ресторане</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Контактная информация</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{restaurant.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Информация о доставке</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Время доставки:</span>
                          <span className="font-medium">{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Стоимость доставки:</span>
                          <span className="font-medium">{restaurant.deliveryFee} ₽</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Минимальный заказ:</span>
                          <span className="font-medium">{restaurant.minimumOrder} ₽</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Часы работы</h3>
                    <div className="space-y-2">
                      {restaurant.workingHours.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{schedule.day}:</span>
                          <span className={`font-medium ${schedule.isClosed ? 'text-red-500' : ''}`}>
                            {schedule.isClosed ? 'Выходной' : `${schedule.open} - ${schedule.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-1" />
                        Сейчас: {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        {isOpen ? (
                          <span className="text-green-600 ml-2">• Открыт</span>
                        ) : (
                          <span className="text-red-600 ml-2">• Закрыт</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Review Modal */}
      {isAddReviewModalOpen && restaurant && (
        <AddReviewModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          isOpen={isAddReviewModalOpen}
          onClose={closeAddReviewModal}
        />
      )}
    </div>
  )
} 