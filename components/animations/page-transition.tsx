"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // 初始状态：透明度为0，向上偏移40px
    gsap.set(container, {
      opacity: 0,
      y: 40,
      scale: 0.95,
    })

    // 淡入动画
    const tl = gsap.timeline()
    
    tl.to(container, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    })

    // 为子元素添加交错动画
    const children = container.querySelectorAll('.animate-child')
    if (children.length > 0) {
      gsap.set(children, {
        opacity: 0,
        y: 30,
      })

      tl.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.4")
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
