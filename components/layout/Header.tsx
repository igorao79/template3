'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faShoppingCart, 
  faUser, 
  faBars, 
  faX, 
  faMapMarkerAlt,
  faUtensils,
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { Cart } from '@/components/cart/Cart'
import { ProfileModal } from '@/components/profile/ProfileModal'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { cart, searchQuery, setSearchQuery, user } = useAppStore()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <FontAwesomeIcon icon={faUtensils} className="h-4 w-4" />
                </div>
                <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  FoodieDelivery
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                <span>Тула</span>
              </motion.div>
              
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Поиск ресторанов и блюд..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 transition-all duration-300 focus:w-96"
                />
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setIsProfileOpen(true)}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                  {user?.isLoggedIn && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                  <AnimatePresence>
                    {cartItemsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-500 to-red-500">
                          {cartItemsCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                  <AnimatePresence>
                    {cartItemsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-500 to-red-500">
                          {cartItemsCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FontAwesomeIcon 
                  icon={isMobileMenuOpen ? faX : faBars} 
                  className="h-5 w-5" 
                />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t bg-background/95 backdrop-blur"
              >
                <div className="px-4 py-4 space-y-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                    <span>Тула</span>
                  </div>
                  
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                    />
                    <Input
                      placeholder="Поиск ресторанов и блюд..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsProfileOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2" />
                    {user?.isLoggedIn ? user.name : 'Профиль'}
                    {user?.isLoggedIn && (
                      <div className="ml-2 h-2 w-2 bg-green-500 rounded-full" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
} 