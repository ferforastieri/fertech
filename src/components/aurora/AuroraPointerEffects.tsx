import { CSSProperties, useEffect, useRef, useState } from 'react'

type Particle = {
  id: number
  x: number
  y: number
}

type Burst = Particle & {
  strong: boolean
}

export default function AuroraPointerEffects() {
  const [trail, setTrail] = useState<Particle[]>([])
  const [bursts, setBursts] = useState<Burst[]>([])
  const idRef = useRef(0)
  const lastTrailAtRef = useRef(0)

  const nextId = () => {
    idRef.current += 1
    return idRef.current
  }

  const addTrailParticle = (x: number, y: number) => {
    const now = performance.now()
    if (now - lastTrailAtRef.current < 18) {
      return
    }

    lastTrailAtRef.current = now
    const particle = { id: nextId(), x, y }
    setTrail((current) => [...current.slice(-18), particle])
    window.setTimeout(() => {
      setTrail((current) => current.filter((item) => item.id !== particle.id))
    }, 620)
  }

  const addBurst = (x: number, y: number, strong = false) => {
    const burst = { id: nextId(), x, y, strong }
    setBursts((current) => [...current, burst])
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== burst.id))
    }, strong ? 980 : 760)
  }

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      addTrailParticle(event.clientX, event.clientY)
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const isInteractive = Boolean(target?.closest('button, a, [role="button"], input, select, textarea'))
      addBurst(event.clientX, event.clientY, isInteractive)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {trail.map((particle) => (
        <span
          key={particle.id}
          className="aurora-cursor-trail"
          style={{ left: particle.x, top: particle.y }}
        />
      ))}

      {bursts.map((burst) => (
        <span
          key={burst.id}
          className={burst.strong ? 'aurora-click-burst aurora-click-burst-strong' : 'aurora-click-burst'}
          style={{ left: burst.x, top: burst.y }}
        >
          {Array.from({ length: burst.strong ? 28 : 16 }).map((_, index) => (
            <i
              key={index}
              style={{
                transform: `rotate(${index * (360 / (burst.strong ? 28 : 16))}deg)`,
                '--burst-distance': `${(burst.strong ? 70 : 42) + (index % 5) * (burst.strong ? 18 : 14)}px`,
              } as CSSProperties}
            />
          ))}
        </span>
      ))}
    </div>
  )
}
