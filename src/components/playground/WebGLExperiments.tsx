import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
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
