'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Минимальное время показа лоадера - 2 секунды
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="bg-white rounded-full p-6 shadow-xl mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={faUtensils} 
                  className="h-10 w-10 text-orange-500"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">FoodDelivery</h1>
              <p className="text-gray-600">Вкусная еда рядом с вами</p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-orange-500 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 text-sm mt-4"
            >
              Загружаем для вас лучшие рестораны...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 