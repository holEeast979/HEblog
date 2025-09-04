"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  cursor?: boolean
  className?: string
}

export function TypewriterText({ 
  text, 
  speed = 50, 
  delay = 0,
  cursor = true,
  className = "" 
}: TypewriterTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!textRef.current) return

    const element = textRef.current

    // 重置状态
    setDisplayText('')
    setCurrentIndex(0)

    const timer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayText(text.slice(0, prevIndex + 1))
            return prevIndex + 1
          } else {
            clearInterval(typeInterval)
            return prevIndex
          }
        })
      }, speed)

      return () => clearInterval(typeInterval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay])

  useEffect(() => {
    if (!cursorRef.current || !cursor) return

    const cursorElement = cursorRef.current

    // 光标闪烁动画
    gsap.to(cursorElement, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      gsap.killTweensOf(cursorElement)
    }
  }, [cursor])

  return (
    <span className={className}>
      <span ref={textRef}>{displayText}</span>
      {cursor && (
        <span 
          ref={cursorRef}
          className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse"
        >
          |
        </span>
      )}
    </span>
  )
}
