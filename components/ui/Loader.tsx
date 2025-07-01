'use client'

import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUtensils } from '@fortawesome/free-solid-svg-icons'

interface LoaderProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function Loader({ text = 'Загрузка...', size = 'md', fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FontAwesomeIcon 
            icon={faSpinner} 
            className={`${sizeClasses[size]} text-orange-500`} 
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FontAwesomeIcon 
            icon={faUtensils} 
            className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-orange-300`} 
          />
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-gray-600 ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}`}
      >
        {text}
      </motion.p>
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      >
        <LoaderContent />
      </motion.div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoaderContent />
    </div>
  )
}

// Маленький инлайн лоадер для кнопок
export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block ${className}`}
    >
      <FontAwesomeIcon icon={faSpinner} className="h-4 w-4" />
    </motion.div>
  )
} 