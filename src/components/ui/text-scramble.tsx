'use client'

import { useCallback, useEffect, useRef, useState, type ComponentProps } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

type TextScrambleProps = ComponentProps<'span'> & {
  text: string
}

export function TextScramble({ text, className = '', ...props }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    setIsScrambling(true)
    frameRef.current = 0
    const duration = Math.max(text.length * 3, 1)

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current += 1
      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)

      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < revealedLength) return text[index]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text])

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <span
      className={`group relative inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={scramble}
      {...props}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={`${index}-${char}`}
          className={`inline-block transition-all duration-150 ${isScrambling && char !== text[index] ? 'scale-110' : ''}`}
          style={{
            color: isScrambling && char !== text[index] ? 'var(--primary)' : 'inherit',
            transitionDelay: `${index * 10}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
