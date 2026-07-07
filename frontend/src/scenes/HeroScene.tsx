import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  Float,
  Html,
  useGLTF,
  PerspectiveCamera,
} from '@react-three/drei'
import * as THREE from 'three'

// drei's useGLTF auto-registers Meshopt + Draco decoders,
// which are required for GLBs compressed with @gltf-transform (EXT_meshopt_compression).
const MODEL_URL = '/models/founder.glb'

/**
 * Hero 3D scene for LMAJHOL.
 *
 * Composition rationale (design-motion-principles → Jakub lens, subtle production polish):
 * - The founder GLB is a bust scan (~75×57×84cm, static, no rig). We treat it as a
 *   floating "founder bust" pedestal element — a signature, not a mascot.
 * - Two invisible-until-hover garment cards float on either side (black + white tee)
 *   representing the drop. Slow orbit + gentle float only. No spinning gimmicks.
 * - Scroll drives camera dolly (close portrait → wide shot) via `scrollProgress` prop
 *   coming from GSAP ScrollTrigger.
 * - Lighting: single warm key + soft rim, black studio void. Editorial, not gamey.
 */

function FounderBust({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF(MODEL_URL) as any

  const scene = useMemo(() => {
    const s = gltf.scene.clone(true)
    // Center + normalize scale so the bust reads clean at ~1.6 units tall
    const box = new THREE.Box3().setFromObject(s)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    s.position.sub(center)
    const targetHeight = 1.8
    const scale = targetHeight / Math.max(size.y, 0.001)
    s.scale.setScalar(scale)
    // Slight lift so shadow reads
    s.position.y += 0.05
    // Ensure materials are physically-based & receive env light
    s.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (o.material) {
          o.material.envMapIntensity = 0.9
          o.material.needsUpdate = true
        }
      }
    })
    return s
  }, [gltf])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    // Slow signature rotation
    groupRef.current.rotation.y += delta * 0.12
    // Scroll-linked slight tilt back (as if being observed)
    const p = scrollProgress.current
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.08 - p * 0.15,
      0.08,
    )
    // Subtle vertical breath
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function FloatingTee({
  color,
  position,
  delay = 0,
}: {
  color: 'black' | 'white'
  position: [number, number, number]
  delay?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + delay) * 0.3
  })

  // Stylized "hanging tee" — a plane with soft rounded corners look via geometry
  const bg = color === 'black' ? '#0A0A0A' : '#F7F6F3'
  const fg = color === 'black' ? '#F7F6F3' : '#0A0A0A'

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.15, 0.15]}>
      <group position={position}>
        <mesh ref={meshRef} castShadow>
          <planeGeometry args={[1.1, 1.4]} />
          <meshStandardMaterial color={bg} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
        </mesh>
        <Html
          transform
          distanceFactor={2.4}
          position={[0, 0, 0.01]}
          style={{
            pointerEvents: 'none',
            width: '220px',
            fontFamily: 'Geist Mono, monospace',
            color: fg,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <div style={{ opacity: 0.7, fontSize: '10px', letterSpacing: '0.2em' }}>LMAJHOL</div>
          <div
            style={{
              marginTop: '6px',
              fontFamily: 'Instrument Serif, serif',
              fontSize: '22px',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
          >
            The Oversized
          </div>
          <div style={{ marginTop: '4px', fontSize: '9px', letterSpacing: '0.24em', opacity: 0.7 }}>
            — {color.toUpperCase()} —
          </div>
        </Html>
      </group>
    </Float>
  )
}

function Rig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const cam = useRef<THREE.PerspectiveCamera>(null)
  useFrame(() => {
    if (!cam.current) return
    const p = scrollProgress.current // 0..1 across hero pin
    // Dolly out & orbit slightly as user scrolls
    const targetZ = THREE.MathUtils.lerp(2.6, 5.5, p)
    const targetY = THREE.MathUtils.lerp(0.15, -0.35, p)
    const targetX = Math.sin(p * Math.PI) * 0.8
    cam.current.position.x = THREE.MathUtils.lerp(cam.current.position.x, targetX, 0.06)
    cam.current.position.y = THREE.MathUtils.lerp(cam.current.position.y, targetY, 0.06)
    cam.current.position.z = THREE.MathUtils.lerp(cam.current.position.z, targetZ, 0.06)
    cam.current.lookAt(0, 0, 0)
  })
  return <PerspectiveCamera ref={cam} makeDefault fov={38} position={[0, 0.15, 2.6]} />
}

function Loader() {
  return (
    <Html center>
      <div
        style={{
          fontFamily: 'Geist Mono, monospace',
          color: '#0A0A0A',
          fontSize: '10px',
          letterSpacing: '0.24em',
        }}
      >
        LOADING SCENE<span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </Html>
  )
}

export default function HeroScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Rig scrollProgress={scrollProgress} />

      {/* Warm key light */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.1}
        color="#FFF3E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Rim */}
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#B0C4DE" />

      <Suspense fallback={<Loader />}>
        <FounderBust scrollProgress={scrollProgress} />
        <FloatingTee color="black" position={[-2.2, 0.1, -0.5]} delay={0} />
        <FloatingTee color="white" position={[2.2, 0.1, -0.5]} delay={1.5} />

        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.35}
          scale={8}
          blur={2.4}
          far={2}
          color="#000000"
        />

        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
