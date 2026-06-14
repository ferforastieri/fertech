import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export type PlaygroundMode = 'orbit' | 'wave' | 'chaos'

export type PlaygroundSettings = {
  color: string
  brushSize: number
  density: number
  speed: number
  mode: PlaygroundMode
  drawing: boolean
  paused: boolean
}

function FloatingField({ settings }: { settings: PlaygroundSettings }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: 160 }, (_, index) => ({
        index,
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 4,
        scale: 0.35 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame((state) => {
    if (!meshRef.current || settings.paused) return

    const time = state.clock.elapsedTime * settings.speed
    const count = Math.min(settings.density, seeds.length)

    for (let index = 0; index < count; index += 1) {
      const seed = seeds[index]
      let x = seed.x
      let y = seed.y
      let z = seed.z

      if (settings.mode === 'orbit') {
        const angle = time * 0.35 + seed.phase
        x = Math.cos(angle) * (2.2 + Math.abs(seed.x) * 0.35)
        y = Math.sin(angle * 1.6) * 1.8 + seed.y * 0.18
        z = Math.sin(angle) * 2.2
      } else if (settings.mode === 'wave') {
        y += Math.sin(time * 1.4 + seed.x * 0.8 + seed.phase) * 0.8
        z += Math.cos(time + seed.y) * 0.45
      } else {
        x += Math.sin(time * 1.8 + seed.phase) * 1.1
        y += Math.cos(time * 1.45 + seed.phase * 1.3) * 0.9
        z += Math.sin(time * 2.1 + seed.index) * 0.75
      }

      dummy.position.set(x, y, z)
      dummy.rotation.set(time * 0.25 + seed.phase, time * 0.4, seed.phase)
      dummy.scale.setScalar(seed.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    }

    meshRef.current.count = count
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.rotation.z = settings.mode === 'chaos' ? Math.sin(time * 0.2) * 0.12 : 0
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 160]}>
      <icosahedronGeometry args={[0.11, 1]} />
      <meshStandardMaterial
        color={settings.color}
        emissive={settings.color}
        emissiveIntensity={1.2}
        roughness={0.24}
        metalness={0.45}
      />
    </instancedMesh>
  )
}

function PointerCanvas({
  settings,
  clearToken,
}: {
  settings: PlaygroundSettings
  clearToken: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const drawingRef = useRef(false)
  const lastPointAt = useRef(0)
  const { viewport } = useThree()

  useEffect(() => {
    groupRef.current?.children.forEach((child) => {
      const mesh = child as THREE.Mesh
      mesh.geometry?.dispose()
      const material = mesh.material as THREE.Material | undefined
      material?.dispose()
    })
    groupRef.current?.clear()
  }, [clearToken])

  useEffect(() => {
    const addPoint = (clientX: number, clientY: number) => {
      if (!settings.drawing || !drawingRef.current) return

      const now = performance.now()
      if (now - lastPointAt.current < 16) return
      lastPointAt.current = now

      const x = (clientX / window.innerWidth - 0.5) * viewport.width
      const y = -(clientY / window.innerHeight - 0.5) * viewport.height

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(settings.brushSize * 0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: settings.color, transparent: true, opacity: 0.88 }),
      )
      mesh.position.set(x, y, 0.8)
      groupRef.current?.add(mesh)

      if ((groupRef.current?.children.length ?? 0) > 420) {
        const first = groupRef.current?.children[0] as THREE.Mesh | undefined
        if (first) {
          first.geometry.dispose()
          ;(first.material as THREE.Material).dispose()
          groupRef.current?.remove(first)
        }
      }
    }

    const handleDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('[data-playground-controls]')) return
      drawingRef.current = true
      addPoint(event.clientX, event.clientY)
    }
    const handleMove = (event: PointerEvent) => addPoint(event.clientX, event.clientY)
    const handleUp = () => {
      drawingRef.current = false
    }

    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)

    return () => {
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [settings.brushSize, settings.color, settings.drawing, viewport.height, viewport.width])

  useFrame((_, delta) => {
    if (!groupRef.current || settings.paused) return
    groupRef.current.rotation.z += delta * settings.speed * 0.025
  })

  return <group ref={groupRef} />
}

function PlaygroundScene({
  settings,
  clearToken,
}: {
  settings: PlaygroundSettings
  clearToken: number
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 4]} intensity={18} color={settings.color} />
      <pointLight position={[-4, -2, 2]} intensity={10} color="#ffffff" />
      <FloatingField settings={settings} />
      <PointerCanvas settings={settings} clearToken={clearToken} />
      <Sparkles
        count={Math.round(settings.density * 0.7)}
        scale={[10, 6, 4]}
        size={2}
        speed={settings.paused ? 0 : settings.speed * 0.35}
        color={settings.color}
        opacity={0.72}
      />
    </>
  )
}

export function WebGLPlayground({
  settings,
  clearToken,
}: {
  settings: PlaygroundSettings
  clearToken: number
}) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 56 }} dpr={[1, 1.7]}>
      <color attach="background" args={['#020003']} />
      <fog attach="fog" args={['#020003', 7, 16]} />
      <PlaygroundScene settings={settings} clearToken={clearToken} />
    </Canvas>
  )
}
