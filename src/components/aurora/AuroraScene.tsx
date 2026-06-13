import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SceneTheme = 'light' | 'dark'

const palette = {
  dark: {
    background: '#040001',
    panel: '#150106',
    panelAlt: '#24020b',
    wine: '#6f0015',
    wineBright: '#b1123d',
    wineSoft: '#ff5c7d',
    glass: '#fff0f4',
    gridOpacity: 0.34,
    overlay:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(111,0,21,0.28),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(177,18,61,0.2),transparent_26%),linear-gradient(180deg,rgba(4,0,1,0.05),rgba(4,0,1,0.88))]',
  },
  light: {
    background: '#fff8fa',
    panel: '#ffffff',
    panelAlt: '#fde8ee',
    wine: '#6f0015',
    wineBright: '#8f102d',
    wineSoft: '#c72d55',
    glass: '#2a050c',
    gridOpacity: 0.2,
    overlay:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(111,0,21,0.08),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(177,18,61,0.07),transparent_26%),linear-gradient(180deg,rgba(255,248,250,0.36),rgba(255,248,250,0.82))]',
  },
} as const

function useReducedMotion() {
  return typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

function StarTraffic({ theme }: { theme: SceneTheme }) {
  const pointsRef = useRef<THREE.Points>(null)
  const reducedMotion = useReducedMotion()
  const positions = useMemo(() => {
    const values = new Float32Array(360)
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.random() - 0.5) * 14
      values[index + 1] = (Math.random() - 0.5) * 7
      values[index + 2] = -4 + Math.random() * 4
    }
    return values
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) {
      return
    }

    pointsRef.current.rotation.z += delta * 0.018
    pointsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.14
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={palette[theme].wineSoft}
        size={0.035}
        transparent
        opacity={theme === 'light' ? 0.42 : 0.74}
        depthWrite={false}
      />
    </points>
  )
}

function NetworkGrid({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const lines = useMemo(() => {
    const output: THREE.Vector3[][] = []
    for (let index = -5; index <= 5; index += 1) {
      output.push([new THREE.Vector3(-7, index, -3), new THREE.Vector3(7, index, -3)])
      output.push([new THREE.Vector3(index, -3.6, -3), new THREE.Vector3(index, 3.6, -3)])
    }
    return output
  }, [])

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.28
    groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1
  })

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0]}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={index % 2 === 0 ? palette[theme].wine : palette[theme].wineBright}
          lineWidth={0.65}
          transparent
          opacity={palette[theme].gridOpacity}
        />
      ))}
    </group>
  )
}

function ServerRack({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const { pointer } = useThree()
  const p = palette[theme]

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.2 + pointer.x * 0.08, delta * 1.6)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06
    groupRef.current.children.forEach((tower, towerIndex) => {
      tower.children.forEach((row, rowIndex) => {
        if (!row.userData.ledRow) {
          return
        }
        row.scale.x = 0.72 + Math.abs(Math.sin(state.clock.elapsedTime * 2.4 + towerIndex + rowIndex * 0.7)) * 0.42
      })
    })
  })

  return (
    <group ref={groupRef} position={[2.9, -0.2, -1.15]} rotation={[0.02, -0.22, 0]}>
      {[-1.15, 0, 1.15].map((x, towerIndex) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.88, 2.85, 0.48]} />
            <meshStandardMaterial color={p.panel} emissive={p.wine} emissiveIntensity={theme === 'light' ? 0.08 : 0.26} roughness={0.42} metalness={0.18} />
          </mesh>
          {[-1.05, -0.55, -0.05, 0.45, 0.95].map((y, rowIndex) => (
            <group key={y} position={[0, y, 0.27]}>
              <mesh>
                <boxGeometry args={[0.68, 0.23, 0.035]} />
                <meshStandardMaterial color={p.panelAlt} emissive={p.wine} emissiveIntensity={theme === 'light' ? 0.04 : 0.18} />
              </mesh>
              <mesh userData={{ ledRow: true }} position={[-0.08, 0, 0.04]}>
                <boxGeometry args={[0.38, 0.035, 0.035]} />
                <meshStandardMaterial color={p.wineSoft} emissive={p.wineBright} emissiveIntensity={0.92 + towerIndex * 0.12} />
              </mesh>
              <mesh position={[0.28, 0, 0.05]}>
                <sphereGeometry args={[0.035, 14, 14]} />
                <meshStandardMaterial color={p.wineBright} emissive={p.wineBright} emissiveIntensity={1.1 + rowIndex * 0.04} />
              </mesh>
            </group>
          ))}
          <Line
            points={[new THREE.Vector3(-0.36, 1.35, 0.29), new THREE.Vector3(0.36, 1.35, 0.29)]}
            color={p.wineBright}
            lineWidth={1.1}
            transparent
            opacity={0.68}
          />
        </group>
      ))}
    </group>
  )
}

function DataPackets({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const p = palette[theme]

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.children.forEach((packet, index) => {
      const progress = (state.clock.elapsedTime * (0.22 + index * 0.018) + index * 0.14) % 1
      packet.position.x = THREE.MathUtils.lerp(-4.7, 3.25, progress)
      packet.position.y = -1.8 + index * 0.28 + Math.sin(progress * Math.PI * 2) * 0.22
      packet.position.z = -0.9 + Math.sin(progress * Math.PI) * 0.26
      packet.rotation.z = progress * Math.PI * 2
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 13 }).map((_, index) => (
        <mesh key={index}>
          <boxGeometry args={[0.13, 0.1, 0.08]} />
          <meshStandardMaterial color={p.wineSoft} emissive={p.wineBright} emissiveIntensity={0.95} />
        </mesh>
      ))}
      {[-1.35, -0.78, -0.18, 0.44].map((y) => (
        <Line
          key={y}
          points={[
            new THREE.Vector3(-4.75, y, -1.15),
            new THREE.Vector3(-2.2, y + 0.22, -1.05),
            new THREE.Vector3(0.4, y - 0.18, -1.08),
            new THREE.Vector3(3.15, y + 0.05, -1.15),
          ]}
          color={p.wineBright}
          lineWidth={0.8}
          transparent
          opacity={theme === 'light' ? 0.28 : 0.5}
        />
      ))}
    </group>
  )
}

function FighterShip({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const { pointer } = useThree()
  const p = palette[theme]

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 0.42 + Math.sin(state.clock.elapsedTime * 1.2) * 0.13, delta * 1.8)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, pointer.y * -0.14, delta * 1.8)
    groupRef.current.children.forEach((child) => {
      if (!child.userData.shot) {
        return
      }
      child.position.x += delta * 5.4
      if (child.position.x > 6.2) {
        child.position.x = -0.15
      }
    })
  })

  return (
    <group ref={groupRef} position={[-3.25, 0.32, -0.15]}>
      <group rotation={[0, 0, -Math.PI / 2]}>
        <mesh>
          <coneGeometry args={[0.44, 1.18, 4]} />
          <meshStandardMaterial color={p.panelAlt} emissive={p.wine} emissiveIntensity={theme === 'light' ? 0.18 : 0.48} roughness={0.22} metalness={0.32} />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.22, 0.5, 4]} />
          <meshStandardMaterial color={p.wineBright} emissive={p.wineSoft} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[-0.48, -0.12, 0]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[0.78, 0.1, 0.05]} />
          <meshStandardMaterial color={p.wineSoft} emissive={p.wineBright} emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0.48, -0.12, 0]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[0.78, 0.1, 0.05]} />
          <meshStandardMaterial color={p.wineSoft} emissive={p.wineBright} emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, 0.12, 0.05]}>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshStandardMaterial color={p.glass} emissive={p.wineBright} emissiveIntensity={theme === 'light' ? 0.25 : 0.7} transparent opacity={0.85} />
        </mesh>
      </group>

      {[0, 0.48, 0.96, 1.44].map((offset) => (
        <group key={offset} userData={{ shot: true }} position={[0.52 + offset, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.78, 0.035, 0.035]} />
            <meshStandardMaterial color={p.wineSoft} emissive={p.wineSoft} emissiveIntensity={1.45} />
          </mesh>
          <mesh position={[0.44, 0, 0]}>
            <sphereGeometry args={[0.045, 14, 14]} />
            <meshStandardMaterial color="#fff2f5" emissive={p.wineSoft} emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function EnemyAndExplosions({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const p = palette[theme]

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.rotation.y += delta * 0.3
    groupRef.current.rotation.z -= delta * 0.18
    groupRef.current.children.forEach((child, index) => {
      if (!child.userData.pulse) {
        return
      }
      child.scale.setScalar(0.82 + Math.abs(Math.sin(state.clock.elapsedTime * 2.8 + index)) * 0.7)
    })
  })

  return (
    <group ref={groupRef} position={[4.55, 0.45, -0.58]}>
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color={p.panelAlt} emissive={p.wineBright} emissiveIntensity={0.72} wireframe transparent opacity={0.85} />
      </mesh>
      {[0, Math.PI / 3, Math.PI * 0.66].map((rotation) => (
        <mesh key={rotation} rotation={[rotation, Math.PI / 2, 0]}>
          <torusGeometry args={[0.78, 0.012, 8, 90]} />
          <meshStandardMaterial color={p.wineSoft} emissive={p.wineBright} emissiveIntensity={1} transparent opacity={0.7} />
        </mesh>
      ))}
      {[
        [-0.62, 0.5, 0.04],
        [-0.78, -0.24, 0.08],
        [-0.32, -0.72, -0.03],
      ].map(([x, y, z], index) => (
        <group key={`${x}-${y}`} userData={{ pulse: true }} position={[x, y, z]}>
          <mesh>
            <torusGeometry args={[0.22, 0.01, 8, 48]} />
            <meshStandardMaterial color={p.wineSoft} emissive={p.wineSoft} emissiveIntensity={1.2} transparent opacity={0.78} />
          </mesh>
          <Line points={[new THREE.Vector3(-0.3, 0, 0), new THREE.Vector3(0.3, 0, 0)]} color={p.wineSoft} lineWidth={1} transparent opacity={0.7} />
          <Line points={[new THREE.Vector3(0, -0.3, 0), new THREE.Vector3(0, 0.3, 0)]} color={p.wineSoft} lineWidth={1} transparent opacity={0.7} />
        </group>
      ))}
    </group>
  )
}

function HudOverlay({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const p = palette[theme]

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    groupRef.current.rotation.z += delta * 0.12
  })

  return (
    <group ref={groupRef} position={[0.08, 0.18, -1.65]}>
      <mesh>
        <torusGeometry args={[2.0, 0.006, 8, 120]} />
        <meshBasicMaterial color={p.wineBright} transparent opacity={theme === 'light' ? 0.18 : 0.32} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.48, 0.006, 8, 120]} />
        <meshBasicMaterial color={p.wineSoft} transparent opacity={theme === 'light' ? 0.14 : 0.26} />
      </mesh>
      <Line points={[new THREE.Vector3(-2.45, 0, 0), new THREE.Vector3(-1.78, 0, 0)]} color={p.wineBright} lineWidth={0.8} transparent opacity={0.42} />
      <Line points={[new THREE.Vector3(1.78, 0, 0), new THREE.Vector3(2.45, 0, 0)]} color={p.wineBright} lineWidth={0.8} transparent opacity={0.42} />
      <Line points={[new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, -1.56, 0)]} color={p.wineBright} lineWidth={0.8} transparent opacity={0.42} />
      <Line points={[new THREE.Vector3(0, 1.56, 0), new THREE.Vector3(0, 2.2, 0)]} color={p.wineBright} lineWidth={0.8} transparent opacity={0.42} />
    </group>
  )
}

function TechBattlefield({ theme }: { theme: SceneTheme }) {
  return (
    <>
      <NetworkGrid theme={theme} />
      <StarTraffic theme={theme} />
      <HudOverlay theme={theme} />
      <DataPackets theme={theme} />
      <FighterShip theme={theme} />
      <EnemyAndExplosions theme={theme} />
      <ServerRack theme={theme} />
    </>
  )
}

export default function AuroraScene({ theme = 'dark' }: { theme?: SceneTheme }) {
  const isLight = theme === 'light'
  const p = palette[theme]

  return (
    <div
      className={isLight
        ? 'pointer-events-none fixed inset-0 z-0 bg-[#fff8fa]'
        : 'pointer-events-none fixed inset-0 z-0 bg-[#040001]'
      }
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 58 }} dpr={[1, 1.65]}>
        <color attach="background" args={[p.background]} />
        <fog attach="fog" args={[p.background, 7, 18]} />
        <ambientLight intensity={isLight ? 1.55 : 0.82} />
        <directionalLight position={[1.5, 3, 4]} intensity={isLight ? 2.4 : 1.3} color="#fff1f4" />
        <pointLight position={[4.6, 1.8, 3.2]} intensity={isLight ? 9 : 17} color={p.wineBright} />
        <pointLight position={[-4.6, -1.8, 3.2]} intensity={isLight ? 5 : 9} color={p.wineSoft} />
        <TechBattlefield theme={theme} />
        <Sparkles
          count={isLight ? 34 : 58}
          scale={[9, 5, 4]}
          size={1.5}
          speed={0.22}
          color={p.wineSoft}
          opacity={isLight ? 0.24 : 0.48}
        />
      </Canvas>
      <div className={`absolute inset-0 ${p.overlay}`} />
    </div>
  )
}
