'use client'

import { useState, type ComponentProps, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Transform {
  x: number
  y: number
  rotationZ: number
}

const transforms: Transform[] = [
  { x: -0.22, y: -0.16, rotationZ: -18 },
  { x: -0.08, y: -0.12, rotationZ: -6 },
  { x: 0.08, y: 0.12, rotationZ: 10 },
  { x: 0.22, y: 0.16, rotationZ: 16 },
]

type TextDisperseProps = ComponentProps<'span'> & {
  children: ReactNode
}

export function TextDisperse({ children, className, ...props }: TextDisperseProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const text = typeof children === 'string' ? children : String(children)

  return (
    <span
      className={className}
      onMouseEnter={() => setIsAnimated(true)}
      onMouseLeave={() => setIsAnimated(false)}
      {...props}
    >
      {text.split('').map((char, index) => {
        const transform = transforms[index % transforms.length]
        return (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            animate={isAnimated ? 'open' : 'closed'}
            variants={{
              open: {
                x: `${transform.x}em`,
                y: `${transform.y}em`,
                rotateZ: transform.rotationZ,
                transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
                zIndex: 1,
              },
              closed: {
                x: 0,
                y: 0,
                rotateZ: 0,
                transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
                zIndex: 0,
              },
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </span>
  )
}
