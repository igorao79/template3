'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function GSAPBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Создаем геометрические элементы
    const createShape = (type: 'circle' | 'triangle' | 'square', size: number, x: number, y: number, delay: number) => {
      const shape = document.createElement('div')
      shape.className = `absolute opacity-20`
      
      if (type === 'circle') {
        shape.style.width = `${size}px`
        shape.style.height = `${size}px`
        shape.style.borderRadius = '50%'
        shape.style.background = 'linear-gradient(45deg, #f97316, #dc2626)'
      } else if (type === 'triangle') {
        shape.style.width = '0'
        shape.style.height = '0'
        shape.style.borderLeft = `${size/2}px solid transparent`
        shape.style.borderRight = `${size/2}px solid transparent`
        shape.style.borderBottom = `${size}px solid #f97316`
      } else if (type === 'square') {
        shape.style.width = `${size}px`
        shape.style.height = `${size}px`
        shape.style.background = 'linear-gradient(135deg, #dc2626, #f97316)'
        shape.style.borderRadius = '8px'
      }
      
      shape.style.left = `${x}%`
      shape.style.top = `${y}%`
      shape.style.transform = 'translate(-50%, -50%)'
      
      container.appendChild(shape)
      
      // GSAP анимация для каждого элемента
      gsap.set(shape, { 
        scale: 0, 
        rotation: Math.random() * 360,
        opacity: 0 
      })
      
      gsap.to(shape, {
        scale: 1,
        opacity: 0.3,
        duration: 2,
        delay: delay,
        ease: "elastic.out(1, 0.3)",
        repeat: -1,
        yoyo: true,
        repeatDelay: Math.random() * 3 + 2
      })
      
      // Постоянное вращение
      gsap.to(shape, {
        rotation: "+=360",
        duration: 10 + Math.random() * 10,
        repeat: -1,
        ease: "none"
      })
      
      // Плавающее движение
      gsap.to(shape, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        duration: 8 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      
      return shape
    }

    // Создаем паттерн из разных геометрических фигур
    const shapes: HTMLElement[] = []
    const patterns = [
      { type: 'circle' as const, count: 12, sizeRange: [20, 60] },
      { type: 'triangle' as const, count: 8, sizeRange: [15, 45] },
      { type: 'square' as const, count: 10, sizeRange: [25, 55] }
    ]

    patterns.forEach(({ type, count, sizeRange }) => {
      for (let i = 0; i < count; i++) {
        const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]
        const x = Math.random() * 100
        const y = Math.random() * 100
        const delay = Math.random() * 3
        
        shapes.push(createShape(type, size, x, y, delay))
      }
    })

    // Создаем светящиеся точки (частицы)
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-white rounded-full opacity-40'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)'
      
      container.appendChild(particle)
      shapes.push(particle)
      
      gsap.set(particle, { scale: 0 })
      gsap.to(particle, {
        scale: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        duration: 2,
        delay: Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      gsap.to(particle, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        duration: 12 + Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }

    // Волновая анимация
    const wave = document.createElement('div')
    wave.className = 'absolute inset-0 opacity-10'
    wave.style.background = `
      radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)
    `
    container.appendChild(wave)
    shapes.push(wave)

    gsap.to(wave, {
      scale: 1.2,
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none"
    })

    // Cleanup функция
    return () => {
      shapes.forEach(shape => {
        if (shape.parentNode) {
          shape.parentNode.removeChild(shape)
        }
      })
      gsap.killTweensOf(shapes)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

export function GSAPHeroPattern() {
  const patternRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!patternRef.current) return

    const container = patternRef.current

    // Создаем мозаичный паттерн
    const createTile = (x: number, y: number, delay: number) => {
      const tile = document.createElement('div')
      tile.className = 'absolute w-12 h-12 border border-white/20'
      tile.style.left = `${x}px`
      tile.style.top = `${y}px`
      tile.style.background = `linear-gradient(${Math.random() * 360}deg, 
        rgba(249, 115, 22, 0.1), 
        rgba(220, 38, 38, 0.1))`
      
      container.appendChild(tile)
      
      gsap.set(tile, { scale: 0, opacity: 0 })
      gsap.to(tile, {
        scale: 1,
        opacity: 0.6,
        duration: 1.5,
        delay: delay,
        ease: "back.out(1.7)",
        repeat: -1,
        yoyo: true,
        repeatDelay: Math.random() * 2 + 1
      })
      
      return tile
    }

    const tiles: HTMLElement[] = []
    const tileSize = 48
    const cols = Math.ceil(window.innerWidth / tileSize) + 1
    const rows = Math.ceil(window.innerHeight / tileSize) + 1

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.85) { // Показываем только некоторые плитки
          const delay = (row + col) * 0.05
          tiles.push(createTile(col * tileSize, row * tileSize, delay))
        }
      }
    }

    return () => {
      tiles.forEach(tile => {
        if (tile.parentNode) {
          tile.parentNode.removeChild(tile)
        }
      })
      gsap.killTweensOf(tiles)
    }
  }, [])

  return (
    <div 
      ref={patternRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
} 