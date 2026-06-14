import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function SignalSculpture() {
  const group = useRef<THREE.Group>(null)
  const bars = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const barSeeds = useMemo(
    () => Array.from({ length: 56 }, (_, index) => ({ x: (index - 27.5) * 0.085, phase: index * 0.34 })),
    [],
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.26) * 0.18
      group.current.rotation.x = -0.1 + Math.sin(time * 0.22) * 0.06
    }
    if (!bars.current) return
    barSeeds.forEach((seed, index) => {
      const wave = Math.sin(time * 2.1 + seed.phase)
      const envelope = 0.25 + Math.exp(-Math.abs(seed.x) * 1.2)
      const height = 0.12 + Math.abs(wave) * envelope * 0.58
      dummy.position.set(seed.x, 0, Math.sin(seed.phase) * 0.08)
      dummy.scale.set(0.028, height, 0.028)
      dummy.updateMatrix()
      bars.current?.setMatrixAt(index, dummy.matrix)
    })
    bars.current.instanceMatrix.needsUpdate = true
    bars.current.rotation.z = Math.sin(time * 0.45) * 0.04
  })

  return (
    <group ref={group} scale={1.7}>
      <instancedMesh ref={bars} args={[undefined, undefined, barSeeds.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} metalness={0.35} roughness={0.28} />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.008, 8, 160]} />
        <meshBasicMaterial color="#ff315f" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[0.72, 0.006, 8, 140]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.28} />
      </mesh>
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh>
          <octahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial color="#ffffff" emissive="#f9a8d4" emissiveIntensity={0.8} metalness={0.5} roughness={0.18} />
        </mesh>
      </Float>
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
  const rings = useRef<THREE.Group>(null)
  const particles = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(520 * 3)
    for (let index = 0; index < 520; index += 1) {
      const angle = index * 0.22
      const radius = 0.65 + (index % 26) * 0.045
      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(index * 0.09) * 1.55
      values[index * 3 + 2] = Math.sin(angle) * radius
    }
    return values
  }, [])
  const ringConfigs = useMemo(
    () => [
      { radius: 0.7, color: '#22d3ee', rotation: [Math.PI / 2, 0, 0] as [number, number, number], opacity: 0.55 },
      { radius: 1.12, color: '#ff315f', rotation: [Math.PI / 2.3, 0.4, 0] as [number, number, number], opacity: 0.36 },
      { radius: 1.55, color: '#7c5cff', rotation: [Math.PI / 1.7, -0.32, 0.12] as [number, number, number], opacity: 0.26 },
    ],
    [],
  )

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.28) * 0.26
      group.current.rotation.x = Math.sin(time * 0.22) * 0.12
    }
    if (rings.current) {
      rings.current.children.forEach((child, index) => {
        child.rotation.z += delta * (0.08 + index * 0.025)
      })
    }
    if (particles.current) {
      particles.current.rotation.y += delta * 0.12
      particles.current.position.y = Math.sin(time * 0.6) * 0.08
    }
  })

  return (
    <group ref={group}>
      <group ref={rings}>
        {ringConfigs.map((ring) => (
          <mesh key={ring.color} rotation={ring.rotation}>
            <torusGeometry args={[ring.radius, 0.008, 8, 180]} />
            <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
          </mesh>
        ))}
      </group>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.016} transparent opacity={0.38} depthWrite={false} />
      </points>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.22}>
        <mesh>
          <dodecahedronGeometry args={[0.42, 1]} />
          <MeshDistortMaterial color="#06030a" emissive="#22d3ee" emissiveIntensity={0.75} metalness={0.56} roughness={0.2} distort={0.08} speed={0.7} />
        </mesh>
      </Float>
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

type FpsPlate = {
  id: number
  position: [number, number, number]
  fallen: boolean
}

function randomCenteredPosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 4.35,
    (Math.random() - 0.5) * 2.05,
    -1.05 - Math.random() * 0.85,
  ]
}

function createPlate(id: number): FpsPlate {
  return {
    id,
    position: randomCenteredPosition(),
    fallen: false,
  }
}

function GameTarget({ plate, onHit }: { plate: FpsPlate; onHit: (id: number) => void }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    const targetRotation = plate.fallen ? -Math.PI / 2 : 0
    const targetY = plate.fallen ? -1.85 : plate.position[1] + Math.sin(state.clock.elapsedTime * 1.4 + plate.id) * 0.04
    mesh.current.rotation.x += (targetRotation - mesh.current.rotation.x) * 0.12
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.12
  })

  return (
    <mesh ref={mesh} position={plate.position} onClick={(event) => {
      event.stopPropagation()
      if (!plate.fallen) onHit(plate.id)
    }}>
      <boxGeometry args={[0.62, 0.42, 0.08]} />
      <meshStandardMaterial
        color={plate.fallen ? '#24121a' : '#ff315f'}
        emissive={plate.fallen ? '#12040a' : '#ff315f'}
        emissiveIntensity={plate.fallen ? 0.18 : 0.95}
        roughness={0.26}
        metalness={0.28}
      />
    </mesh>
  )
}

function AimCrosshair() {
  const group = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()
  const cursorPoint = useMemo(() => new THREE.Vector3(), [])
  const cursorDirection = useMemo(() => new THREE.Vector3(), [])
  const crosshairZ = 0.28

  useEffect(() => {
    const previousCursor = gl.domElement.style.cursor
    gl.domElement.style.cursor = 'none'
    return () => {
      gl.domElement.style.cursor = previousCursor
    }
  }, [gl.domElement])

  useFrame((state) => {
    if (!group.current) return
    cursorPoint.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera)
    cursorDirection.copy(cursorPoint).sub(camera.position).normalize()
    const distance = (crosshairZ - camera.position.z) / cursorDirection.z
    group.current.position.copy(camera.position).add(cursorDirection.multiplyScalar(distance))
  })

  return (
    <group ref={group} position={[0, 0, crosshairZ]}>
      <mesh>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.16, 0, 0]}>
        <boxGeometry args={[0.13, 0.012, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.86} />
      </mesh>
      <mesh position={[-0.16, 0, 0]}>
        <boxGeometry args={[0.13, 0.012, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.012, 0.13, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[0.012, 0.13, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.86} />
      </mesh>
    </group>
  )
}

function AimGame() {
  const nextPlateId = useRef(9)
  const respawnTimers = useRef<number[]>([])
  const [plates, setPlates] = useState<FpsPlate[]>(() => Array.from({ length: 9 }, (_, index) => createPlate(index)))

  useEffect(() => {
    return () => {
      respawnTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const hitPlate = (id: number) => {
    setPlates((current) => current.map((plate) => (plate.id === id ? { ...plate, fallen: true } : plate)))
    const timer = window.setTimeout(() => {
      setPlates((current) => current.map((plate) => (plate.id === id ? createPlate(nextPlateId.current++) : plate)))
    }, 650)
    respawnTimers.current.push(timer)
  }

  return (
    <group>
      <mesh position={[0, 0, -1.8]}>
        <boxGeometry args={[5.8, 3.05, 0.04]} />
        <meshBasicMaterial color="#10060d" transparent opacity={0.5} />
      </mesh>
      <AimCrosshair />
      {plates.map((plate) => (
        <GameTarget key={plate.id} plate={plate} onHit={hitPlate} />
      ))}
    </group>
  )
}

type SnakeFood = {
  id: number
  position: [number, number, number]
}

function createSnakeFood(id: number): SnakeFood {
  return {
    id,
    position: [(Math.random() - 0.5) * 4.1, (Math.random() - 0.5) * 2.25, -0.2],
  }
}

function SnakeFoodOrb({ food }: { food: SnakeFood }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    group.current.rotation.z = time * 1.1 + food.id
    const scale = 1 + Math.sin(time * 4 + food.id) * 0.12
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group} position={food.position}>
      <mesh>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          color="#f9a8d4"
          emissive="#ff315f"
          emissiveIntensity={1.1}
          roughness={0.22}
          metalness={0.35}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.3, 0.012, 8, 52]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.36} />
      </mesh>
    </group>
  )
}

function SnakeSegment({ index, positions }: { index: number; positions: THREE.Vector3[] }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.elapsedTime
    mesh.current.position.copy(positions[index])
    const scale = index === 0 ? 1.22 : 1 - index * 0.022
    mesh.current.scale.setScalar(Math.max(scale + Math.sin(time * 4 + index) * 0.03, 0.55))
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[index === 0 ? 0.2 : 0.16, 24, 24]} />
      <meshStandardMaterial
        color={index === 0 ? '#ff315f' : '#22d3ee'}
        emissive={index === 0 ? '#ff315f' : '#22d3ee'}
        emissiveIntensity={index === 0 ? 1.25 : 0.9}
        roughness={0.24}
        metalness={0.35}
      />
    </mesh>
  )
}

function SnakeGame() {
  const nextFoodId = useRef(1)
  const [snakeLength, setSnakeLength] = useState(8)
  const segmentPositions = useMemo(() => Array.from({ length: 28 }, () => new THREE.Vector3(0, 0, -0.2)), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const pointerPoint = useMemo(() => new THREE.Vector3(), [])
  const pointerDirection = useMemo(() => new THREE.Vector3(), [])
  const foodPosition = useMemo(() => new THREE.Vector3(), [])
  const { camera, gl } = useThree()
  const [food, setFood] = useState<SnakeFood>(() => createSnakeFood(0))

  useEffect(() => {
    const previousCursor = gl.domElement.style.cursor
    gl.domElement.style.cursor = 'none'
    return () => {
      gl.domElement.style.cursor = previousCursor
    }
  }, [gl.domElement])

  useFrame((state) => {
    pointerPoint.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera)
    pointerDirection.copy(pointerPoint).sub(camera.position).normalize()
    const distance = (-0.2 - camera.position.z) / pointerDirection.z
    targetPosition.copy(camera.position).add(pointerDirection.multiplyScalar(distance))
    targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -2.55, 2.55)
    targetPosition.y = THREE.MathUtils.clamp(targetPosition.y, -1.45, 1.45)

    segmentPositions[0].lerp(targetPosition, 0.2)
    for (let index = 1; index < segmentPositions.length; index += 1) {
      segmentPositions[index].lerp(segmentPositions[index - 1], 0.22)
    }

    if (segmentPositions[0].distanceTo(foodPosition.set(...food.position)) < 0.34) {
      setFood(createSnakeFood(nextFoodId.current++))
      setSnakeLength((current) => Math.min(current + 2, segmentPositions.length))
    }
  })

  return (
    <group>
      <mesh position={[0, 0, -2.15]}>
        <boxGeometry args={[5.6, 3.1, 0.04]} />
        <meshBasicMaterial color="#0b0712" transparent opacity={0.62} />
      </mesh>
      <SnakeFoodOrb key={food.id} food={food} />
      {segmentPositions.slice(0, snakeLength).map((_, index) => (
        <SnakeSegment key={index} index={index} positions={segmentPositions} />
      ))}
    </group>
  )
}

type DodgeBar = {
  id: number
  x: number
  y: number
  z: number
  speed: number
  width: number
  height: number
  rotation: number
}

function createDodgeBar(id: number, z = -4 - Math.random() * 3): DodgeBar {
  const horizontal = Math.random() > 0.5
  return {
    id,
    x: (Math.random() - 0.5) * 4.2,
    y: (Math.random() - 0.5) * 2.2,
    z,
    speed: 0.7 + Math.random() * 0.35,
    width: horizontal ? 1.15 + Math.random() * 0.75 : 0.12,
    height: horizontal ? 0.12 : 0.75 + Math.random() * 0.8,
    rotation: (Math.random() - 0.5) * 0.28,
  }
}

function OrbitDodgeGame() {
  const ship = useRef<THREE.Group>(null)
  const impactRing = useRef<THREE.Mesh>(null)
  const bars = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const barState = useMemo(() => Array.from({ length: 6 }, (_, index) => createDodgeBar(index, -3.5 - index * 1.35)), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const pointerPoint = useMemo(() => new THREE.Vector3(), [])
  const pointerDirection = useMemo(() => new THREE.Vector3(), [])
  const impactAt = useRef(-10)
  const collisionCooldown = useRef(0)
  const { camera, gl } = useThree()

  useEffect(() => {
    const previousCursor = gl.domElement.style.cursor
    gl.domElement.style.cursor = 'none'
    return () => {
      gl.domElement.style.cursor = previousCursor
    }
  }, [gl.domElement])

  useFrame((state, delta) => {
    if (!ship.current) return
    pointerPoint.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera)
    pointerDirection.copy(pointerPoint).sub(camera.position).normalize()
    const distance = (0.35 - camera.position.z) / pointerDirection.z
    targetPosition.copy(camera.position).add(pointerDirection.multiplyScalar(distance))
    targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -2.45, 2.45)
    targetPosition.y = THREE.MathUtils.clamp(targetPosition.y, -1.35, 1.35)
    ship.current.position.lerp(targetPosition, 0.18)
    ship.current.rotation.z = -state.pointer.x * 0.55
    ship.current.rotation.x = state.pointer.y * 0.22
    collisionCooldown.current = Math.max(collisionCooldown.current - delta, 0)

    if (!bars.current) return
    barState.forEach((bar, index) => {
      bar.z += bar.speed * delta
      if (bar.z > 1.0) {
        Object.assign(bar, createDodgeBar(bar.id, -6.2 - Math.random() * 2.4))
      }
      const depthScale = THREE.MathUtils.mapLinear(bar.z, -6.5, 1, 0.5, 1.25)
      dummy.position.set(bar.x, bar.y, bar.z)
      dummy.rotation.set(0, 0, bar.rotation)
      dummy.scale.set(bar.width * depthScale, bar.height * depthScale, 0.08)
      dummy.updateMatrix()
      bars.current?.setMatrixAt(index, dummy.matrix)

      const closeToShipPlane = Math.abs(bar.z - ship.current!.position.z) < 0.18
      const shipX = ship.current!.position.x
      const shipY = ship.current!.position.y
      const hitX = Math.abs(shipX - bar.x) < bar.width * depthScale * 0.5 + 0.18
      const hitY = Math.abs(shipY - bar.y) < bar.height * depthScale * 0.5 + 0.18
      if (closeToShipPlane && hitX && hitY && collisionCooldown.current <= 0) {
        impactAt.current = state.clock.elapsedTime
        collisionCooldown.current = 0.85
        Object.assign(bar, createDodgeBar(bar.id, -6.2 - Math.random() * 2.4))
      }
    })
    bars.current.instanceMatrix.needsUpdate = true

    const impactAge = state.clock.elapsedTime - impactAt.current
    const impactStrength = Math.max(1 - impactAge / 0.55, 0)
    if (impactStrength > 0) {
      const shake = Math.sin(state.clock.elapsedTime * 80) * 0.08 * impactStrength
      ship.current.position.x += shake
      ship.current.scale.setScalar(1 + impactStrength * 0.38)
      ship.current.rotation.y = Math.sin(state.clock.elapsedTime * 55) * 0.45 * impactStrength
    } else {
      ship.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.18)
      ship.current.rotation.y *= 0.82
    }

    if (impactRing.current) {
      impactRing.current.position.copy(ship.current.position)
      impactRing.current.scale.setScalar(0.7 + impactStrength * 2.2)
      impactRing.current.visible = impactStrength > 0
      const material = impactRing.current.material as THREE.MeshBasicMaterial
      material.opacity = impactStrength * 0.78
    }
  })

  return (
    <group>
      <mesh position={[0, 0, -2.2]}>
        <boxGeometry args={[5.7, 3.1, 0.04]} />
        <meshBasicMaterial color="#09030a" transparent opacity={0.56} />
      </mesh>
      <instancedMesh ref={bars} args={[undefined, undefined, barState.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#ff315f" emissive="#ff315f" emissiveIntensity={0.92} roughness={0.22} metalness={0.28} />
      </instancedMesh>
      <group ref={ship} position={[0, 0, 0.35]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.24, 1]} />
          <meshStandardMaterial color="#ffffff" emissive="#f9a8d4" emissiveIntensity={0.9} metalness={0.55} roughness={0.16} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.01, 8, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.38} />
        </mesh>
      </group>
      <mesh ref={impactRing} visible={false} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.34, 0.38, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function ExperimentShell({ children, camera, controls = true }: { children: React.ReactNode; camera: [number, number, number]; controls?: boolean }) {
  return (
    <Canvas camera={{ position: camera, fov: 48 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#050106']} />
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 5, 4]} intensity={24} color="#ff315f" />
      <pointLight position={[-4, 1, -3]} intensity={18} color="#22d3ee" />
      {children}
      <Stars radius={35} depth={20} count={900} factor={2} fade speed={0.35} />
      {controls && <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35} />}
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
  return <ExperimentShell camera={[0, 0, 5.6]} controls={false}><AimGame /></ExperimentShell>
}

export function ReflexGameExperiment() {
  return <ExperimentShell camera={[0, 0, 5.7]} controls={false}><SnakeGame /></ExperimentShell>
}

export function OrbitDodgeExperiment() {
  return <ExperimentShell camera={[0, 0, 5.8]} controls={false}><OrbitDodgeGame /></ExperimentShell>
}
