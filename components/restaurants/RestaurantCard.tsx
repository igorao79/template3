'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faClock, faTruck, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Restaurant, isRestaurantOpen } from '@/lib/store'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const restaurantStatus = isRestaurantOpen(restaurant)
  const isOpen = restaurantStatus.isOpen
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/restaurant/${restaurant.id}`} className="flex h-full">
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 w-full flex flex-col">
          {/* Restaurant Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant={isOpen ? "default" : "secondary"}
                className={`${
                  isOpen
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500"
                } text-white font-medium`}
              >
                {isOpen ? "Открыт" : "Закрыт"}
              </Badge>
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1"
              >
                <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-yellow-400" />
                <span className="text-xs font-medium">{restaurant.rating}</span>
              </motion.div>
            </div>

            {/* Delivery Fee */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {restaurant.deliveryFee === 0 ? "Бесплатно" : `${restaurant.deliveryFee} ₽`}
              </div>
            </div>

            {/* Warning message for closing soon restaurants */}
            {isOpen && restaurantStatus.closesIn && (
              <div className="absolute bottom-3 left-3">
                <div className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
                  Закрывается через {restaurantStatus.closesIn} мин
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div>
              {/* Restaurant Name */}
              <h3 className="font-bold text-lg mb-1 text-gray-800 group-hover:text-orange-600 transition-colors">
                {restaurant.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {restaurant.description}
              </p>

              {/* Cuisine Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {restaurant.cuisine.slice(0, 2).map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant="outline"
                    className="text-xs bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>

              {/* Warning message for closing soon restaurants */}
              {isOpen && restaurantStatus.closesIn && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                  <p className="text-yellow-700 text-xs font-medium">
                    <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
                    Закрывается через {restaurantStatus.closesIn} минут
                  </p>
                </div>
              )}
            </div>

            <div>
              {/* Info Row */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faTruck} className="h-3 w-3" />
                    <span>от {restaurant.minimumOrder} ₽</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
} 