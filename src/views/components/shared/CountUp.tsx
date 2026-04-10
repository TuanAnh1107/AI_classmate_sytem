import { useEffect, useMemo, useRef, useState } from 'react'

type CountUpProps = {
  value: number
  durationMs?: number
  format?: (value: number) => string
}

export function CountUp({ value, durationMs = 700, format }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)
  const formatter = useMemo(() => format ?? ((val: number) => Math.round(val).toString()), [format])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplay(value)
      displayRef.current = value
      return
    }

    let frame = 0
    let animationFrame = 0
    const totalFrames = Math.max(1, Math.round(durationMs / 16))
    const startValue = displayRef.current
    const diff = value - startValue

    const step = () => {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      const nextValue = startValue + diff * progress
      displayRef.current = nextValue
      setDisplay(nextValue)
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [durationMs, value])

  return <>{formatter(display)}</>
}
