import { useEffect, useRef } from "react"

import type { ReactNode } from "react"

const WAVE_LENGTH = 60

function createWavePath(phase: number, width: number, amplitude: number) {
  const cycles = width / WAVE_LENGTH
  const steps = Math.max(48, Math.ceil(cycles * 24))
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const x = (index / steps) * width
    const y = 16 + amplitude * Math.sin((x / WAVE_LENGTH) * Math.PI * 2 + phase)

    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
  })

  return points.join(" ")
}

export default function WavyText({
  children,
  amplitude = 8,
}: {
  children: ReactNode
  amplitude?: number
}) {
  const pathRef = useRef<SVGPathElement>(null)

  const textRef = useRef<HTMLSpanElement>(null)

  const frameRef = useRef<number | null>(null)

  const phaseRef = useRef(0)

  const widthRef = useRef(240)

  useEffect(() => {
    const text = textRef.current
    if (!text) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      widthRef.current = entry.contentRect.width
      pathRef.current?.setAttribute(
        "d",
        createWavePath(phaseRef.current, widthRef.current, amplitude),
      )
      pathRef.current?.ownerSVGElement?.setAttribute(
        "viewBox",
        `0 0 ${widthRef.current} 32`,
      )
    })

    resizeObserver.observe(text)
    return () => resizeObserver.disconnect()
  }, [amplitude])

  const stopWave = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)

      frameRef.current = null
    }
  }

  useEffect(() => stopWave, [])

  const startWave = () => {
    if (frameRef.current !== null) return

    let previousTime: number | null = null

    const animate = (time: number) => {
      if (previousTime !== null) {
        phaseRef.current += (time - previousTime) * 0.002
      }

      previousTime = time

      pathRef.current?.setAttribute(
        "d",
        createWavePath(phaseRef.current, widthRef.current, amplitude),
      )

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
  }

  return (
    <span
      ref={textRef}
      className="relative isolate inline-block"
      onMouseEnter={startWave}
      onMouseLeave={stopWave}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 z-0 h-8 w-full -translate-y-1/2 overflow-visible"
        viewBox={`0 0 ${widthRef.current} 32`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={createWavePath(0, widthRef.current, amplitude)}
          className="fill-none stroke-white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  )
}
