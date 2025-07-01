'use client'

import { useAppStore } from '@/lib/store'
import { OrderModal } from './OrderModal'

export function OrderModalContainer() {
  const isOrderModalOpen = useAppStore((state) => state.isOrderModalOpen)
  const setOrderModalOpen = useAppStore((state) => state.setOrderModalOpen)
  
  const handleClose = () => {
    setOrderModalOpen(false)
  }

  if (!isOrderModalOpen) return null

  return (
    <OrderModal 
      isOpen={isOrderModalOpen} 
      onClose={handleClose} 
    />
  )
} 