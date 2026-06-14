import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Stars, Text } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function SignalSculpture() {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.18
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.16
  })

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh>
          <torusKnotGeometry args={[1.35, 0.38, 180, 24, 2, 5]} />
          <MeshDistortMaterial color="#ff315f" emissive="#6b071f" metalness={0.72} roughness={0.2} distort={0.38} speed={2} />
        </mesh>
      </Float>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.012, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.26} />
      </mesh>
    </group>
  )
}

function PulseGrid() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cells = useMemo(
    () => Array.from({ length: 196 }, (_, index) => ({ x: (index % 14) - 6.5, z: Math.floor(index / 14) - 6.5 })),
    [],
  )

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.elapsedTime
    cells.forEach((cell, index) => {
      const distance = Math.hypot(cell.x, cell.z)
      const height = 0.18 + (Math.sin(distance * 1.25 - time * 2.2) + 1) * 0.42
      dummy.position.set(cell.x * 0.48, height / 2 - 0.6, cell.z * 0.48)
      dummy.scale.set(0.38, height, 0.38)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
      <boxGeometry />
      <meshStandardMaterial color="#7c5cff" emissive="#281866" emissiveIntensity={1.4} metalness={0.45} roughness={0.35} />
    </instancedMesh>
  )
}

function LandingHero() {
  const group = useRef<THREE.Group>(null)
  const cards = useMemo(
    () => [
      { label: 'Design', color: '#ff315f', position: [-1.9, 0.72, 0] as [number, number, number] },
      { label: 'Infra', color: '#22d3ee', position: [1.85, -0.15, -0.4] as [number, number, number] },
      { label: 'Produto', color: '#7c5cff', position: [-0.2, -1.05, 0.25] as [number, number, number] },
    ],
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.12
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.38}>
        <mesh>
          <sphereGeometry args={[1.12, 64, 64]} />
          <MeshDistortMaterial color="#12040a" emissive="#ff315f" emissiveIntensity={0.7} metalness={0.72} roughness={0.18} distort={0.28} speed={1.4} />
        </mesh>
      </Float>
      <Text position={[0, 0.05, 1.35]} fontSize={0.42} color="#ffffff" anchorX="center" anchorY="middle">
        FERTECH
      </Text>
      {cards.map((card, index) => (
        <Float key={card.label} speed={1.2 + index * 0.2} rotationIntensity={0.16} floatIntensity={0.34}>
          <group position={card.position}>
            <mesh>
              <boxGeometry args={[1.18, 0.58, 0.08]} />
              <meshStandardMaterial color="#09030a" emissive={card.color} emissiveIntensity={0.38} metalness={0.4} roughness={0.32} />
            </mesh>
            <Text position={[0, 0, 0.07]} fontSize={0.16} color={card.color} anchorX="center" anchorY="middle">
              {card.label}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  )
}

function ParticleTunnel() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(1200 * 3)
    for (let index = 0; index < 1200; index += 1) {
      const angle = index * 0.21
      const radius = 1.2 + Math.sin(index * 0.11) * 0.38
      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(angle) * radius
      values[index * 3 + 2] = (index / 1200) * -18 + 6
    }
    return values
  }, [])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.z = state.clock.elapsedTime * 0.18
    points.current.position.z = (state.clock.elapsedTime * 1.2) % 6
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#22d3ee" size={0.035} transparent opacity={0.88} depthWrite={false} />
    </points>
  )
}

function TerrainWave() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    const geometry = mesh.current.geometry as THREE.PlaneGeometry
    const position = geometry.attributes.position
    const time = state.clock.elapsedTime

    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index)
      const y = position.getY(index)
      position.setZ(index, Math.sin(x * 1.4 + time * 1.8) * 0.28 + Math.cos(y * 1.8 + time) * 0.18)
    }

    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.25, 0, 0]}>
      <planeGeometry args={[8, 8, 52, 52]} />
      <meshStandardMaterial color="#14051a" emissive="#7c5cff" emissiveIntensity={0.55} metalness={0.24} roughness={0.38} wireframe />
    </mesh>
  )
}

function GameTarget({ index, onHit }: { index: number; onHit: () => void }) {
  const mesh = useRef<THREE.Mesh>(null)
  const position = useMemo<[number, number, number]>(() => [
    -2.8 + Math.random() * 5.6,
    -1.55 + Math.random() * 3.1,
    -0.8 + Math.random() * 1.6,
  ], [index])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x += 0.02
    mesh.current.rotation.y += 0.025
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.12
  })

  return (
    <mesh ref={mesh} position={position} onClick={(event) => {
      event.stopPropagation()
      onHit()
    }}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#ff315f" emissive="#ff315f" emissiveIntensity={1.2} roughness={0.22} metalness={0.34} />
    </mesh>
  )
}

function AimGame() {
  const [score, setScore] = useState(0)
  const targets = useMemo(() => Array.from({ length: 9 }, (_, index) => index), [score])

  return (
    <group>
      <Text position={[0, 2.25, 0]} fontSize={0.24} color="#ffffff" anchorX="center">
        score {score}
      </Text>
      {targets.map((target) => (
        <GameTarget key={`${score}-${target}`} index={target} onHit={() => setScore((value) => value + 1)} />
      ))}
    </group>
  )
}

function ExperimentShell({ children, camera }: { children: React.ReactNode; camera: [number, number, number] }) {
  return (
    <Canvas camera={{ position: camera, fov: 48 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#050106']} />
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 5, 4]} intensity={24} color="#ff315f" />
      <pointLight position={[-4, 1, -3]} intensity={18} color="#22d3ee" />
      {children}
      <Stars radius={35} depth={20} count={900} factor={2} fade speed={0.35} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35} />
    </Canvas>
  )
}

export function SignalSculptureExperiment() {
  return <ExperimentShell camera={[0, 0, 6]}><SignalSculpture /></ExperimentShell>
}

export function PulseGridExperiment() {
  return <ExperimentShell camera={[5.5, 4.4, 6.5]}><PulseGrid /></ExperimentShell>
}

export function LandingHeroExperiment() {
  return <ExperimentShell camera={[0, 0.2, 6]}><LandingHero /></ExperimentShell>
}

export function ParticleTunnelExperiment() {
  return <ExperimentShell camera={[0, 0, 5.8]}><ParticleTunnel /></ExperimentShell>
}

export function TerrainWaveExperiment() {
  return <ExperimentShell camera={[4.5, 3.8, 5.5]}><TerrainWave /></ExperimentShell>
}

export function AimGameExperiment() {
  return <ExperimentShell camera={[0, 0, 6]}><AimGame /></ExperimentShell>
}
