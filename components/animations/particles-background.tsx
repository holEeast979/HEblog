"use client"

import React, { useEffect, useRef } from 'react'

export function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 20

    // 清除现有粒子
    container.innerHTML = ''

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      // 随机大小 (1-4px)
      const size = Math.random() * 3 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // 随机水平位置
      particle.style.left = `${Math.random() * 100}%`
      
      // 随机动画延迟
      particle.style.animationDelay = `${Math.random() * 20}s`
      
      // 随机动画持续时间 (15-25秒)
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`
      
      // 随机透明度
      particle.style.opacity = `${Math.random() * 0.1 + 0.05}`
      
      container.appendChild(particle)
    }

    // 清理函数
    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="particles-bg"
      aria-hidden="true"
    />
  )
}
