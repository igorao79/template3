// Утилиты для оптимизации производительности

import { lazy } from 'react'

// Lazy loading компонентов
export const LazyProfileModal = lazy(() => 
  import('@/components/profile/ProfileModal').then(module => ({ 
    default: module.ProfileModal 
  }))
)

export const LazyOrderModal = lazy(() => 
  import('@/components/order/OrderModal').then(module => ({ 
    default: module.OrderModal 
  }))
)

// Debounce функция для поиска
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle функция для скролла
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Проверка пересечения для lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined') return null
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

// Предзагрузка критических ресурсов
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return
  
  // Предзагружаем шрифты
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.as = 'font'
  fontLink.type = 'font/woff2'
  fontLink.crossOrigin = 'anonymous'
  document.head.appendChild(fontLink)
  
  // Предзагружаем критические изображения
  const preloadImage = (src: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }
  
  // Добавьте пути к критическим изображениям
  // preloadImage('/images/hero-bg.jpg')
}

// Мониторинг производительности
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined') return fn()
  
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  console.log(`${name} took ${end - start} milliseconds`)
  return result
}

// Очистка неиспользуемых ресурсов
export const cleanupResources = () => {
  // В браузере нет прямого способа получить все активные таймеры
  // Эта функция должна вызываться при размонтировании компонентов
  console.log('Cleaning up resources...')
} 