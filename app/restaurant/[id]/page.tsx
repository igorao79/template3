import { mockRestaurants } from '@/lib/data'
import RestaurantPageClient from './RestaurantPageClient'

// Генерируем статические параметры для всех ресторанов
export async function generateStaticParams() {
  return mockRestaurants.map((restaurant) => ({
    id: restaurant.id,
  }))
}

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  return <RestaurantPageClient paramsPromise={params} />
} 