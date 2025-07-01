'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faSearch, faArrowDown, faExclamationTriangle, faClock } from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RestaurantCard } from '@/components/restaurants/RestaurantCard'
import { Loader } from '@/components/ui/Loader'
import { GSAPBackground, GSAPHeroPattern } from '@/components/ui/GSAPBackground'
import { mockRestaurants as restaurants, categories, cuisineTypes } from '@/lib/data'
import { useAppStore, isRestaurantOpen, getOpenRestaurants } from '@/lib/store'
import { Restaurant } from '@/lib/store'

export default function HomePage() {
  const { 
    searchQuery, 
    selectedCategory, 
    isLoading,
    setSearchQuery, 
    setSelectedCategory, 
    setLoading 
  } = useAppStore()

  const [selectedCuisine, setSelectedCuisine] = useState('Все')
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    
    // Имитируем загрузку данных
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    // Обновляем время каждую минуту для актуального статуса ресторанов
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      clearTimeout(timer)
      clearInterval(timeInterval)
    }
  }, [setLoading])

  const scrollToRestaurants = () => {
    const restaurantsSection = document.getElementById('restaurants-section')
    if (restaurantsSection) {
      restaurantsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Фильтрация ресторанов
  const filteredRestaurants = restaurants.filter((restaurant: Restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCuisine = selectedCuisine === 'Все' || restaurant.cuisine.includes(selectedCuisine)
    
    return matchesSearch && matchesCuisine
  })

  // Фильтрация по категориям меню
  const getRestaurantsWithCategory = () => {
    if (selectedCategory === 'all') {
      return filteredRestaurants
    }
    
    return filteredRestaurants.filter((restaurant: Restaurant) => 
      restaurant.menu.some((item: any) => item.category === selectedCategory)
    )
  }

  const displayRestaurants = getRestaurantsWithCategory()
  
  // Разделяем рестораны на открытые и закрытые
  const openRestaurants: Restaurant[] = []
  const closedRestaurants: (Restaurant & { _closureMessage?: string })[] = []
  
  displayRestaurants.forEach(restaurant => {
    const status = isRestaurantOpen(restaurant)
    if (status.isOpen) {
      openRestaurants.push(restaurant)
    } else {
      closedRestaurants.push({ ...restaurant, _closureMessage: status.message })
    }
  })

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <GSAPHeroPattern />
        <GSAPBackground />
        <div className="container relative mx-auto px-4 py-16 sm:py-24 hero-mobile">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <FontAwesomeIcon icon={faUtensils} className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-mobile"
            >
              Вкусная еда с доставкой
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl mb-8 text-orange-100 text-mobile"
            >
              Быстрая доставка любимых блюд от лучших ресторанов города
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center button-group-mobile"
            >
              <Button 
                onClick={scrollToRestaurants}
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 cursor-pointer"
              >
                Заказать сейчас
                <FontAwesomeIcon icon={faArrowDown} className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToRestaurants}
                className="border-white text-orange-600 bg-white font-semibold px-8 py-3 hover:text-orange-600 cursor-pointer"
              >
                Узнать больше
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-10 left-10 opacity-20">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FontAwesomeIcon icon={faUtensils} className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 right-20 opacity-20">
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-white" />
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
              />
              <Input
                placeholder="Поиск ресторанов и блюд..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.id 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Cuisine Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {cuisineTypes.map((cuisine) => (
                <Button
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`${
                    selectedCuisine === cuisine 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section id="restaurants-section" className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Популярные рестораны
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-mobile">
              Выберите из более чем {restaurants.length} ресторанов и получите доставку за 30-40 минут
            </p>
            <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2" />
              Время сейчас: {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </motion.div>

          {displayRestaurants.length > 0 ? (
            <div className="space-y-12">
              {/* Открытые рестораны */}
              {openRestaurants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Доступны для заказа ({openRestaurants.length})
                  </h3>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-mobile-fix items-stretch"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {openRestaurants.map((restaurant: Restaurant) => (
                      <motion.div
                        key={restaurant.id}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <RestaurantCard restaurant={restaurant} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Закрытые рестораны */}
              {closedRestaurants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-600 mr-2" />
                      <h3 className="text-lg font-semibold text-yellow-800">
                        Закрытые рестораны ({closedRestaurants.length})
                      </h3>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Эти рестораны сейчас закрыты, но вы можете ознакомиться с меню и оформить заказ на завтра
                    </p>
                    {openRestaurants.length > 0 && (
                      <p className="text-yellow-700 text-sm mt-2">
                        А пока рекомендуем заказать из <span className="font-medium">{openRestaurants.length}</span> открытых ресторанов выше
                      </p>
                    )}
                  </div>
                  
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-mobile-fix opacity-60 items-stretch"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {closedRestaurants.map((restaurant) => (
                      <motion.div
                        key={restaurant.id}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <RestaurantCard restaurant={restaurant} />
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white p-4">
                            <FontAwesomeIcon icon={faClock} className="h-6 w-6 mb-2" />
                            <p className="text-sm font-medium">
                              {restaurant._closureMessage || 'Закрыто'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FontAwesomeIcon icon={faSearch} className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500 text-mobile">
                Попробуйте изменить критерии поиска или выбрать другую категорию
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedCuisine('Все')
                }}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                Сбросить фильтры
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
