// Утилита для правильной работы путей в GitHub Pages

export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/template3' : ''

// Функция для получения правильного пути к изображениям
export function getImagePath(src: string): string {
  // Если путь уже абсолютный (начинается с http), возвращаем как есть
  if (src.startsWith('http')) {
    return src
  }
  
  // Если это локальное изображение, добавляем базовый путь
  return `${BASE_PATH}${src.startsWith('/') ? src : `/${src}`}`
}

// Функция для получения правильного пути к ресурсам
export function getAssetPath(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}

// Функция для API путей (если будет использоваться)
export function getApiPath(endpoint: string): string {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  return `${baseApiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
} 