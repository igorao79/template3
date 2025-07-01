'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faStar, faUser } from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import { useAppStore } from '@/lib/store'

interface AddReviewModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: string
  restaurantName: string
}

export function AddReviewModal({ isOpen, onClose, restaurantId, restaurantName }: AddReviewModalProps) {
  const { user, addReview } = useAppStore()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (rating === 0) {
      newErrors.rating = 'Поставьте оценку'
    }

    if (!comment.trim()) {
      newErrors.comment = 'Напишите отзыв'
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Отзыв должен быть не менее 10 символов'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    // Имитируем задержку отправки
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      addReview(restaurantId, {
        user_name: user?.name || 'Аноним',
        rating,
        comment: comment.trim(),
        date: new Date().toLocaleDateString('ru-RU'),
      })

      // Очищаем форму
      setRating(0)
      setComment('')
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0)
      setComment('')
      setErrors({})
      onClose()
    }
  }

  if (!user?.isLoggedIn) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl modal-mobile"
          >
            <div className="flex h-full max-h-[90vh] flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Оставить отзыв</h2>
                <Button variant="ghost" size="icon" onClick={handleClose} disabled={isSubmitting}>
                  <FontAwesomeIcon icon={faX} className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full h-12 w-12 mx-auto flex items-center justify-center mb-2">
                      <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="font-medium">{restaurantName}</h3>
                    <p className="text-sm text-gray-500">Как вам понравился заказ?</p>
                  </div>

                  {/* Рейтинг */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Оценка *</label>
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => {
                            setRating(star)
                            if (errors.rating) {
                              setErrors({ ...errors, rating: '' })
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className={`h-6 w-6 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-red-500 text-xs text-center">{errors.rating}</p>
                    )}
                  </div>

                  {/* Комментарий */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ваш отзыв *</label>
                    <Textarea
                      placeholder="Расскажите о вашем опыте заказа..."
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setComment(e.target.value)
                        if (errors.comment) {
                          setErrors({ ...errors, comment: '' })
                        }
                      }}
                      className={`min-h-[100px] resize-none ${errors.comment ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-xs">{errors.comment}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {comment.length}/500 символов
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t p-4 flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!rating || !comment.trim())}
                  className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                >
                  {isSubmitting ? 'Отправляем...' : 'Отправить отзыв'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 