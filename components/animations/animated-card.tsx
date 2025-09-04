"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: number
  hoverRotation?: number
  glowEffect?: boolean
}

export function AnimatedCard({ 
  children, 
  className = "", 
  hoverScale = 1.05,
  hoverRotation = 3,
  glowEffect = true 
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current
    const glow = glowRef.current

    // 初始设置
    gsap.set(card, {
      transformStyle: "preserve-3d",
      transformPerspective: 1000,
    })

    // 鼠标进入动画
    const handleMouseEnter = (e: MouseEvent) => {
      const tl = gsap.timeline()
      
      tl.to(card, {
        scale: hoverScale,
        rotationX: hoverRotation * 0.5,
        rotationY: hoverRotation,
        duration: 0.6,
        ease: "power3.out",
      })

      if (glow && glowEffect) {
        tl.to(glow, {
          opacity: 0.6,
          scale: 1.1,
          duration: 0.6,
          ease: "power3.out",
        }, 0)
      }
    }

    // 鼠标移动动画 - 3D跟随效果
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) * 0.1
      const rotateY = (e.clientX - centerX) * 0.1

      gsap.to(card, {
        rotationX: -rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    // 鼠标离开动画
    const handleMouseLeave = (e: MouseEvent) => {
      const tl = gsap.timeline()
      
      tl.to(card, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power3.out",
      })

      if (glow && glowEffect) {
        tl.to(glow, {
          opacity: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }, 0)
      }
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    // 初始进入动画
    const entranceTl = gsap.timeline()
    entranceTl.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.8,
      ease: "power3.out",
    })

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf([card, glow])
    }
  }, [hoverScale, hoverRotation, glowEffect])

  return (
    <div className="relative">
      {glowEffect && (
        <div
          ref={glowRef}
          className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-warm-500/20 rounded-xl opacity-0 blur-lg"
        />
      )}
      <div
        ref={cardRef}
        className={cn(
          "relative transform-gpu transition-all duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
