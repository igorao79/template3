import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  restaurant_id: string
  ingredients?: string[]
  allergens?: string[]
  available: boolean
}

export interface WorkingHours {
  day: string
  open: string
  close: string
  isClosed: boolean
}

export interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  cuisine: string[]
  menu: MenuItem[]
  isOpen: boolean
  address: string
  phone: string
  workingHours: WorkingHours[]
  reviews: Review[]
  totalReviews: number
}

export interface CartItem {
  id: string
  item: MenuItem
  quantity: number
  restaurant_id: string
  notes?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryFee: number
  address: string
  phone: string
  date: string
  status: string
  restaurants: string[]
}

export interface User {
  id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  isLoggedIn: boolean
  orders: Order[]
}

export interface OrderFormData {
  address: string
  phone: string
  name: string
  paymentMethod: string
  notes: string
  promoCode?: string
  discount?: number
  freeDelivery?: boolean
  freeItem?: MenuItem | null
}

interface AppState {
  // Cart state
  cart: CartItem[]
  cartTotal: number
  
  // User state
  user: User | null
  
  // App state
  selectedRestaurant: Restaurant | null
  restaurants: Restaurant[]
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  
  // Order state
  isOrderModalOpen: boolean
  orderStep: number
  orderFormData: OrderFormData
  
  // Promo notifications
  showPromoNotification: boolean
  promoNotificationType: 'FREE_DELIVERY' | 'DISCOUNT_20' | 'FREE_ITEM' | null
  usedPromoCodes: string[]
  
  // Actions
  addToCart: (item: MenuItem, restaurant_id: string, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // Restaurant actions
  setSelectedRestaurant: (restaurant: Restaurant | null) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  
  // Search actions
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  
  // User actions
  setUser: (user: User | null) => void
  loginUser: (name: string, email: string, phone: string) => void
  logoutUser: () => void
  addOrder: (order: Order) => void
  
  // Order actions
  setOrderModalOpen: (open: boolean) => void
  setOrderStep: (step: number) => void
  updateOrderFormData: (data: Partial<OrderFormData>) => void
  
  // Promo actions
  showPromoNotificationAction: (type: 'FREE_DELIVERY' | 'DISCOUNT_20' | 'FREE_ITEM') => void
  hidePromoNotification: () => void
  applyPromoCode: (code: string) => boolean
  
  // Loading
  setLoading: (loading: boolean) => void
  
  // Добавляем новые состояния
  isAddReviewModalOpen: boolean
  
  // Новые действия для отзывов
  openAddReviewModal: () => void
  closeAddReviewModal: () => void
  addReview: (restaurantId: string, review: Omit<Review, 'id'>) => void
  
  // Обновление статуса заказа
  updateOrderStatus: (orderId: string, status: string) => void
}

const orderStatuses = [
  'В обработке',
  'Готовится',
  'В пути',
  'Доставлен'
]

// Функция для проверки времени работы ресторана
export const isRestaurantOpen = (restaurant: Restaurant): { isOpen: boolean; closesIn?: number; message?: string } => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('ru-RU', { weekday: 'long' }).toLowerCase()
  const currentTime = now.getHours() * 60 + now.getMinutes() // в минутах

  const todayHours = restaurant.workingHours.find(wh => 
    wh.day.toLowerCase() === currentDay
  )

  if (!todayHours || todayHours.isClosed) {
    // Найти следующий открытый день
    const nextOpenDay = findNextOpenDay(restaurant.workingHours, currentDay)
    return {
      isOpen: false,
      message: nextOpenDay ? `Закрыто сегодня. Открыто завтра в ${nextOpenDay.open}` : 'Закрыто'
    }
  }

  const [openHour, openMinute] = todayHours.open.split(':').map(Number)
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number)
  
  const openTime = openHour * 60 + openMinute
  const closeTime = closeHour * 60 + closeMinute
  
  if (currentTime < openTime) {
    return {
      isOpen: false,
      message: `Откроется в ${todayHours.open}`
    }
  }
  
  if (currentTime >= closeTime) {
    const nextOpenDay = findNextOpenDay(restaurant.workingHours, currentDay)
    return {
      isOpen: false,
      message: nextOpenDay ? `Закрыто. Откроется завтра в ${nextOpenDay.open}` : 'Закрыто'
    }
  }

  // Проверяем, закрывается ли в течение 15 минут
  const minutesToClose = closeTime - currentTime
  if (minutesToClose <= 15) {
    return {
      isOpen: false,
      closesIn: minutesToClose,
      message: `Заказ недоступен. Ресторан закрывается через ${minutesToClose} мин.`
    }
  }

  return { isOpen: true }
}

// Функция для поиска следующего открытого дня
const findNextOpenDay = (workingHours: WorkingHours[], currentDay: string): WorkingHours | null => {
  const days = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']
  const currentIndex = days.indexOf(currentDay)
  
  for (let i = 1; i < 7; i++) {
    const nextDayIndex = (currentIndex + i) % 7
    const nextDay = days[nextDayIndex]
    const nextDayHours = workingHours.find(wh => wh.day.toLowerCase() === nextDay)
    
    if (nextDayHours && !nextDayHours.isClosed) {
      return nextDayHours
    }
  }
  
  return null
}

// Функция для получения открытых ресторанов
export const getOpenRestaurants = (restaurants: Restaurant[]): Restaurant[] => {
  return restaurants.filter(restaurant => {
    const status = isRestaurantOpen(restaurant)
    return status.isOpen
  })
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],
      cartTotal: 0,
      user: null,
      selectedRestaurant: null,
      restaurants: [],
      searchQuery: '',
      selectedCategory: 'all',
      isLoading: false,
      isOrderModalOpen: false,
      orderStep: 1,
      orderFormData: {
        address: '',
        phone: '',
        name: '',
        paymentMethod: 'cash',
        notes: '',
      },
      
      // Promo notifications
      showPromoNotification: false,
      promoNotificationType: null,
      usedPromoCodes: [],
      
      isAddReviewModalOpen: false,

      // Cart actions
      addToCart: (item: MenuItem, restaurant_id: string, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (cartItem) => cartItem.item.id === item.id
          )

          let newCart: CartItem[]
          
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const newQuantity = state.cart[existingItemIndex].quantity + quantity
            
            if (newQuantity <= 0) {
              // Remove item if quantity becomes 0 or negative
              newCart = state.cart.filter((_, index) => index !== existingItemIndex)
            } else {
              newCart = state.cart.map((cartItem, index) =>
                index === existingItemIndex
                  ? { ...cartItem, quantity: newQuantity }
                  : cartItem
              )
            }
          } else if (quantity > 0) {
            // Add new item only if quantity is positive
            const newCartItem: CartItem = {
              id: `${item.id}-${Date.now()}`,
              item,
              quantity,
              restaurant_id,
            }
            newCart = [...state.cart, newCartItem]
          } else {
            // Don't add item with negative or zero quantity
            newCart = state.cart
          }

          const newTotal = newCart.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
          )

          return {
            cart: newCart,
            cartTotal: newTotal,
          }
        })
      },

      removeFromCart: (itemId: string) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== itemId)
          const newTotal = newCart.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
          )

          return {
            cart: newCart,
            cartTotal: newTotal,
          }
        })
      },

      updateCartItemQuantity: (itemId: string, quantity: number) => {
        set((state) => {
          let newCart: CartItem[]
          
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            newCart = state.cart.filter((item) => item.id !== itemId)
          } else {
            // Update quantity
            newCart = state.cart.map((cartItem) =>
              cartItem.id === itemId
                ? { ...cartItem, quantity }
                : cartItem
            )
          }

          const newTotal = newCart.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
          )

          return {
            cart: newCart,
            cartTotal: newTotal,
          }
        })
      },

      clearCart: () => {
        set({ cart: [], cartTotal: 0 })
      },

      // Restaurant actions
      setSelectedRestaurant: (restaurant) => {
        set({ selectedRestaurant: restaurant })
      },

      setRestaurants: (restaurants) => {
        set({ restaurants })
      },

      // Search actions
      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category })
      },

      // User actions
      setUser: (user) => {
        set({ user })
      },

      loginUser: (name: string, email: string, phone: string) => {
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          phone,
          isLoggedIn: true,
          orders: [],
        }
        set({ user: newUser })
      },

      logoutUser: () => {
        set({ user: null })
      },

      addOrder: (order: Order) => {
        set((state) => {
          if (!state.user) return state
          
          const updatedUser = {
            ...state.user,
            orders: [order, ...state.user.orders],
          }
          
          return { user: updatedUser }
        })
      },

      // Order actions
      setOrderModalOpen: (open) => {
        set({ isOrderModalOpen: open })
      },

      setOrderStep: (step) => {
        set({ orderStep: step })
      },

      updateOrderFormData: (data) => {
        set((state) => ({
          orderFormData: { ...state.orderFormData, ...data }
        }))
      },

      // Loading
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Promo actions
      showPromoNotificationAction: (type) => {
        const { user, usedPromoCodes } = get()
        if (user?.isLoggedIn) return // Не показываем авторизованным пользователям
        
        // Проверяем, не использовался ли уже этот тип промокода
        if (usedPromoCodes.includes(type)) return
        
        set({ showPromoNotification: true, promoNotificationType: type })
      },

      hidePromoNotification: () => {
        set({ showPromoNotification: false, promoNotificationType: null })
      },

      applyPromoCode: (code: string) => {
        const availablePromoCodes = {
          'FREEDEL': { type: 'FREE_DELIVERY', discount: 0, freeDelivery: true },
          'SAVE20': { type: 'DISCOUNT_20', discount: 20, freeDelivery: false },
          'FREEFOOD': { type: 'FREE_ITEM', discount: 0, freeDelivery: false },
        } as const

        const promo = availablePromoCodes[code as keyof typeof availablePromoCodes]
        if (!promo) return false

        const { usedPromoCodes } = get()
        if (usedPromoCodes.includes(promo.type)) return false

        set((state) => ({
          usedPromoCodes: [...state.usedPromoCodes, promo.type],
          orderFormData: {
            ...state.orderFormData,
            promoCode: code,
            discount: promo.discount,
            freeDelivery: promo.freeDelivery,
          }
        }))

        return true
      },

      // Новые действия для отзывов
      openAddReviewModal: () => set({ isAddReviewModalOpen: true }),
      closeAddReviewModal: () => set({ isAddReviewModalOpen: false }),
      
      addReview: (restaurantId: string, review: Omit<Review, 'id'>) => set((state) => {
        // Генерируем новый ID для отзыва
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
        }
        
        // Обновляем отзывы ресторана (в реальном приложении это было бы API вызов)
        // Здесь мы просто добавляем отзыв в localStorage для демонстрации
        const existingReviews = JSON.parse(localStorage.getItem('restaurant-reviews') || '{}')
        if (!existingReviews[restaurantId]) {
          existingReviews[restaurantId] = []
        }
        existingReviews[restaurantId].unshift(newReview)
        localStorage.setItem('restaurant-reviews', JSON.stringify(existingReviews))
        
        return state
      }),

      // Обновление статуса заказа
      updateOrderStatus: (orderId: string, status: string) => set((state) => {
        if (!state.user) return state
        
        const existingOrder = state.user.orders.find(order => order.id === orderId)
        const oldStatus = existingOrder?.status || ''
        
        // Показываем уведомление если статус изменился
        if (existingOrder && oldStatus !== status) {
          // Используем setTimeout чтобы уведомление показалось после обновления state
          setTimeout(() => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.showStatusNotification) {
              // @ts-ignore
              window.showStatusNotification(orderId, oldStatus, status)
            }
          }, 100)
        }
        
        return {
          ...state,
          user: {
            ...state.user,
            orders: state.user.orders.map(order =>
              order.id === orderId ? { ...order, status } : order
            )
          }
        }
      }),
    }),
    {
      name: 'food-delivery-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        cartTotal: state.cartTotal,
        user: state.user,
      }),
    }
  )
)

// Функция для автоматического обновления статусов заказов
let statusUpdaterInterval: NodeJS.Timeout | null = null

export const startOrderStatusUpdater = () => {
  // Очищаем предыдущий интервал если он существует
  if (statusUpdaterInterval) {
    clearInterval(statusUpdaterInterval)
  }
  
  statusUpdaterInterval = setInterval(() => {
    const state = useAppStore.getState()
    
    if (!state.user?.orders || state.user.orders.length === 0) return
    
    state.user.orders.forEach((order: Order) => {
      const currentStatusIndex = orderStatuses.indexOf(order.status)
      
      // Если заказ не в финальном статусе и прошло достаточно времени
      if (currentStatusIndex < orderStatuses.length - 1) {
        // Парсим дату с учетом времени (формат: "DD.MM.YYYY в HH:MM")
        let orderDate: Date
        try {
          if (order.date.includes(' в ')) {
            // Новый формат с временем
            const [datePart, timePart] = order.date.split(' в ')
            const [day, month, year] = datePart.split('.')
            const [hours, minutes] = timePart.split(':')
            orderDate = new Date(
              parseInt(year), 
              parseInt(month) - 1, 
              parseInt(day),
              parseInt(hours),
              parseInt(minutes)
            )
          } else {
            // Старый формат только с датой
            const [day, month, year] = order.date.split('.')
            orderDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          }
        } catch (e) {
          console.error('Error parsing order date:', order.date)
          return
        }
        
        const now = new Date()
        const minutesPassed = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))
        
        // Каждые 2 минуты переходим к следующему статусу (для быстрого тестирования)
        const expectedStatusIndex = Math.min(
          Math.floor(minutesPassed / 2),
          orderStatuses.length - 1
        )
        
        if (expectedStatusIndex > currentStatusIndex) {
          const newStatus = orderStatuses[expectedStatusIndex]
          state.updateOrderStatus(order.id, newStatus)
        }
      }
    })
  }, 30000) // Проверяем каждые 30 секунд для быстрого тестирования
}

export const stopOrderStatusUpdater = () => {
  if (statusUpdaterInterval) {
    clearInterval(statusUpdaterInterval)
    statusUpdaterInterval = null
  }
} 