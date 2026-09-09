import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import gsap from 'gsap'
import { vec2, type Vec2 } from 'vecteur'

interface MagneticCursorProps {
  children: ReactNode
  magneticFactor?: number
  lerpAmount?: number
  hoverPadding?: number
  hoverAttribute?: string
  cursorSize?: number
  cursorColor?: string
  blendMode?: 'difference' | 'exclusion' | 'normal' | 'screen' | 'overlay'
  cursorClassName?: string
  shape?: 'circle' | 'square' | 'rounded-square'
  disableOnTouch?: boolean
  speedMultiplier?: number
  maxScaleX?: number
  maxScaleY?: number
  contrastBoost?: number
}

interface CursorState {
  el: HTMLDivElement | null
  pos: { current: Vec2; target: Vec2; previous: Vec2 }
  hover: { isHovered: boolean }
  hoveredElement: HTMLElement | null
  isDetaching: boolean
}

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverPadding = 12,
  hoverAttribute = 'data-magnetic',
  cursorSize = 24,
  cursorColor = 'white',
  blendMode = 'exclusion',
  cursorClassName = '',
  shape = 'circle',
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorStateRef = useRef<CursorState | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const configRef = useRef({ magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding })

  useEffect(() => {
    configRef.current = { magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding }
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return
    const cursorEl = cursorRef.current
    if (!cursorEl) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = cursorStateRef.current ?? {
      el: cursorEl,
      pos: { current: vec2(-100, -100), target: vec2(-100, -100), previous: vec2(-100, -100) },
      hover: { isHovered: false },
      hoveredElement: null,
      isDetaching: false,
    }
    cursorStateRef.current = state

    const resetHover = () => {
      if (!state.hover.isHovered) return
      state.hover.isHovered = false
      state.hoveredElement = null
      state.isDetaching = true
      const currentX = Number(gsap.getProperty(cursorEl, 'x'))
      const currentY = Number(gsap.getProperty(cursorEl, 'y'))
      state.pos.current.x = currentX
      state.pos.current.y = currentY
      state.pos.previous.copy(state.pos.current)
      gsap.to(cursorEl, {
        width: configRef.current.cursorSize,
        height: configRef.current.cursorSize,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
        backgroundColor: cursorColor,
        scaleX: 1,
        scaleY: 1,
        duration: reducedMotion ? 0.1 : 0.35,
        ease: 'power3.out',
        overwrite: 'all',
        onComplete: () => { state.isDetaching = false },
      })
    }

    const update = () => {
      if (state.hover.isHovered && !state.hoveredElement?.isConnected) resetHover()
      if (state.hover.isHovered) return
      const { speedMultiplier: speed, maxScaleX: maxX, maxScaleY: maxY, lerpAmount: lerp } = configRef.current
      const effectiveLerp = reducedMotion ? 1 : lerp
      state.pos.current.lerp(state.pos.target, effectiveLerp)
      const delta = state.pos.current.clone().sub(state.pos.previous)
      state.pos.previous.copy(state.pos.current)
      const velocity = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * speed
      gsap.set(cursorEl, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
        scaleX: state.isDetaching ? 1 : 1 + Math.min(velocity, maxX),
        scaleY: state.isDetaching ? 1 : 1 - Math.min(velocity, maxY),
        overwrite: 'auto',
      })
    }
    const initialize = (event: PointerEvent) => {
      state.pos.current.x = event.clientX
      state.pos.current.y = event.clientY
      state.pos.target.x = event.clientX
      state.pos.target.y = event.clientY
      state.pos.previous.copy(state.pos.current)
      gsap.set(cursorEl, { x: event.clientX, y: event.clientY, opacity: 1 })
    }
    const onMove = (event: PointerEvent) => {
      state.pos.target.x = event.clientX
      state.pos.target.y = event.clientY
      const target = event.target as HTMLElement
      const isText = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(target.tagName)
      gsap.to(cursorEl, {
        opacity: 1,
        scaleX: state.hover.isHovered ? 1 : isText ? 0.5 : 1,
        scaleY: state.hover.isHovered ? 1 : isText ? 1.5 : 1,
        duration: 0.2,
        overwrite: 'auto',
      })
    }
    const onLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.3 })
    const onEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.3 })
    const cleanups: Array<() => void> = []
    const boundElements = new Set<HTMLElement>()

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 })
    gsap.ticker.add(update)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointermove', initialize, { once: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    const bindElement = (element: HTMLElement) => {
      if (boundElements.has(element)) return
      boundElements.add(element)
      const magneticTarget = element.firstElementChild ?? element
      const xTo = gsap.quickTo(magneticTarget, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' })
      const yTo = gsap.quickTo(magneticTarget, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' })
      const onElementEnter = () => {
        state.hover.isHovered = true
        state.hoveredElement = element
        const bounds = element.getBoundingClientRect()
        const computed = window.getComputedStyle(element)
        gsap.killTweensOf(cursorEl)
        gsap.to(cursorEl, {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          width: bounds.width + configRef.current.hoverPadding * 2,
          height: bounds.height + configRef.current.hoverPadding * 2,
          borderRadius: computed.borderRadius || '8px',
          backgroundColor: element.getAttribute('data-magnetic-color') || cursorColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: reducedMotion ? 0.1 : 0.3,
          ease: 'power3.out',
          overwrite: 'all',
        })
      }
      const onElementLeave = () => resetHover()
      const onElementMove = (event: PointerEvent) => {
        if (element.hasAttribute('data-magnetic-static')) return
        const bounds = element.getBoundingClientRect()
        xTo((event.clientX - (bounds.left + bounds.width / 2)) * configRef.current.magneticFactor)
        yTo((event.clientY - (bounds.top + bounds.height / 2)) * configRef.current.magneticFactor)
      }
      const onElementOut = () => {
        if (!element.hasAttribute('data-magnetic-static')) { xTo(0); yTo(0) }
      }
      element.addEventListener('pointerenter', onElementEnter)
      element.addEventListener('pointerleave', onElementLeave)
      element.addEventListener('pointermove', onElementMove)
      element.addEventListener('pointerout', onElementOut)
      cleanups.push(() => {
        element.removeEventListener('pointerenter', onElementEnter)
        element.removeEventListener('pointerleave', onElementLeave)
        element.removeEventListener('pointermove', onElementMove)
        element.removeEventListener('pointerout', onElementOut)
        boundElements.delete(element)
      })
    }

    document.querySelectorAll<HTMLElement>(`[${hoverAttribute}]`).forEach(bindElement)

    const observer = new MutationObserver(() => {
      if (state.hover.isHovered && !state.hoveredElement?.isConnected) resetHover()
      document.querySelectorAll<HTMLElement>(`[${hoverAttribute}]`).forEach(bindElement)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      gsap.ticker.remove(update)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', initialize)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      state.hover.isHovered = false
      state.hoveredElement = null
      state.isDetaching = false
      gsap.killTweensOf(cursorEl)
      gsap.set(cursorEl, {
        width: configRef.current.cursorSize,
        height: configRef.current.cursorSize,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
        backgroundColor: cursorColor,
        scaleX: 1,
        scaleY: 1,
      })
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [disableOnTouch, isTouchDevice, hoverAttribute, cursorColor, shape])

  if (disableOnTouch && isTouchDevice) return <>{children}</>

  return (
    <>
      <div
        ref={cursorRef}
        className={`magnetic-cursor ${cursorClassName}`}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
          willChange: 'transform, width, height, border-radius', backgroundColor: cursorColor,
          mixBlendMode: blendMode, width: cursorSize, height: cursorSize,
          borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
          backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
          WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
        }}
      />
      {children}
    </>
  )
}
