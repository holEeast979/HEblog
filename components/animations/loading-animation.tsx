"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface LoadingAnimationProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingAnimation({ text = "加载中", size = 'md' }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-sm', particle: 'w-1 h-1' },
    md: { container: 'w-24 h-24', text: 'text-base', particle: 'w-1.5 h-1.5' },
    lg: { container: 'w-32 h-32', text: 'text-lg', particle: 'w-2 h-2' },
  }

  useEffect(() => {
    if (!containerRef.current || !particlesRef.current) return

    const container = containerRef.current
    const particlesContainer = particlesRef.current
    
    // 创建粒子
    const particleCount = 8
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = `absolute rounded-full bg-gradient-to-r from-primary-500 to-warm-500 ${sizeClasses[size].particle}`
      particlesContainer.appendChild(particle)
      particles.push(particle)
    }

    // 粒子围绕中心旋转动画
    particles.forEach((particle, index) => {
      const angle = (index / particleCount) * Math.PI * 2
      const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40
      
      gsap.set(particle, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        transformOrigin: 'center',
      })

      gsap.to(particle, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: "none",
        transformOrigin: `${-Math.cos(angle) * radius}px ${-Math.sin(angle) * radius}px`,
      })

      // 粒子发光效果
      gsap.to(particle, {
        scale: 1.5,
        opacity: 0.6,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.1,
      })
    })

    // 容器脉冲动画
    gsap.to(container, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      gsap.killTweensOf([container, ...particles])
    }
  }, [size])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        ref={containerRef}
        className={`relative ${sizeClasses[size].container} flex items-center justify-center`}
      >
        <div
          ref={particlesRef}
          className="absolute inset-0 flex items-center justify-center"
        />
        
        {/* 中心发光圆点 */}
        <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full shadow-lg glow-effect" />
      </div>
      
      {text && (
        <p className={`${sizeClasses[size].text} font-medium text-primary-700 dark:text-warm-300 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )
}
