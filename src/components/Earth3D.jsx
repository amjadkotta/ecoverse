import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Subtle atmospheric outer halo shader
// Rendered on the BackSide of an outer shell (scale 1.034)
// Because Earth (scale 1.0) is opaque and in front, this glow appears
// exclusively outside the planet's perimeter, leaving continents and oceans 100% clear.
const AtmosphereShader = {
  uniforms: {
    atmosphereColor: { value: new THREE.Color('#38BDF8') }, // Natural atmospheric cyan-blue
    ecoGlow: { value: new THREE.Color('#39B86B') },         // Subtle ECOVERSE emerald accent
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform vec3 atmosphereColor;
    uniform vec3 ecoGlow;
    void main() {
      // In view space, vNormal on BackSide points towards center
      // At silhouette edge, dot with camera line of sight (0, 0, 1) is near 0
      float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      vec3 finalColor = mix(atmosphereColor, ecoGlow, 0.22);
      gl_FragColor = vec4(finalColor, clamp(intensity * 0.75, 0.0, 0.5));
    }
  `,
}

// Realistic volumetric cloud shader with polar density attenuation
const CloudShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D cloudMap;
    uniform vec3 sunDirection;
    uniform float opacity;
    uniform vec3 color;

    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vec4 texColor = texture2D(cloudMap, vUv);
      
      // Handle both transparent PNG and grayscale cloud textures
      float density = texColor.a > 0.0 ? texColor.a : texColor.r;
      
      // Taper cloud over-saturation in high latitudes (polar regions)
      // This prevents the solid white polar cap from obscuring Antarctica and the Arctic
      float polarDist = abs(vUv.y - 0.5) * 2.0; // 0.0 at equator, 1.0 at poles
      float polarFactor = smoothstep(0.96, 0.60, polarDist) * 0.72 + 0.28;
      
      // Soft wrap lighting for realistic cloud volume
      float sunDot = dot(vNormal, sunDirection);
      float light = clamp(sunDot * 0.45 + 0.55, 0.35, 1.0);
      
      float finalAlpha = density * opacity * polarFactor;
      if (finalAlpha < 0.015) discard;
      
      gl_FragColor = vec4(color * light, finalAlpha);
    }
  `,
}

function EarthGlobe() {
  const earthRef = useRef()
  const cloudsRef = useRef()

  // Load high-resolution NASA Earth textures
  const [dayMap, cloudsMap, specularMap] = useTexture(
    [
      '/textures/earth/earth_daymap.jpg',
      '/textures/earth/earth_clouds.png',
      '/textures/earth/earth_specular.jpg',
    ],
    (textures) => {
      const [day, clouds] = textures
      if (day) day.colorSpace = THREE.SRGBColorSpace
      if (clouds) clouds.colorSpace = THREE.SRGBColorSpace
    }
  )

  // Cloud shader uniforms memoization
  const cloudUniforms = useMemo(
    () => ({
      cloudMap: { value: cloudsMap },
      sunDirection: { value: new THREE.Vector3(0.45, 0.35, 0.82).normalize() },
      opacity: { value: 0.28 },
      color: { value: new THREE.Color('#EAF2F7') },
    }),
    [cloudsMap]
  )

  // Independent rotation for clouds layer
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.014
    }
  })

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(23.44)]}>
      {/* 1. Realistic Solid Earth Mesh */}
      {/* Specular color is calibrated to a deep navy (#0E2234) with focused shininess (45):
          Oceans reflect a subtle, natural aquatic glint without white glare,
          letting deep blue ocean water and rich green/brown continental albedos shine clearly */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={dayMap}
          specularMap={specularMap}
          specular={new THREE.Color('#0E2234')}
          shininess={45}
        />
      </mesh>

      {/* 2. Floating Natural Cloud Layer with Polar Tapering */}
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={CloudShader.vertexShader}
          fragmentShader={CloudShader.fragmentShader}
          uniforms={cloudUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Atmospheric Rim Glow (Outside the Planet) */}
      <mesh scale={1.034}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={AtmosphereShader.uniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Camera-Linked Balanced Lighting System
// Keeps daylight illumination oriented relative to the user's line of sight,
// ensuring that whichever continent is facing the camera (South America, Africa, Asia, Europe, etc.)
// is ALWAYS consistently and beautifully illuminated, eliminating dark blind-spots during rotation.
function CameraLinkedLighting() {
  const sunRef = useRef(null)
  const fillRef = useRef(null)
  const rimRef = useRef(null)

  useFrame(({ camera }) => {
    // Vector from target (0,0,0) towards camera
    const dir = camera.position.clone().normalize()
    const up = camera.up.clone().normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()

    // 1. Primary Sunlight: ~28° to the right and ~15° above the line of sight
    if (sunRef.current) {
      const sunPos = dir
        .clone()
        .multiplyScalar(3.2)
        .add(right.clone().multiplyScalar(1.5))
        .add(up.clone().multiplyScalar(0.85))
      sunRef.current.position.copy(sunPos)
    }

    // 2. Soft Western Fill Light: ~30° to the left of the line of sight
    // Gently illuminates the transition zone so no continent drops into pitch darkness
    if (fillRef.current) {
      const fillPos = dir
        .clone()
        .multiplyScalar(3.0)
        .add(right.clone().multiplyScalar(-1.8))
        .add(up.clone().multiplyScalar(0.35))
      fillRef.current.position.copy(fillPos)
    }

    // 3. Subtle Space Rim / Bounce on the back edge
    if (rimRef.current) {
      const rimPos = dir
        .clone()
        .multiplyScalar(-2.5)
        .add(right.clone().multiplyScalar(-1.5))
        .add(up.clone().multiplyScalar(-0.8))
      rimRef.current.position.copy(rimPos)
    }
  })

  return (
    <>
      {/* Primary Key Sunlight */}
      <directionalLight ref={sunRef} intensity={1.9} color="#FFFDF7" />

      {/* Daylight Fill for Western Hemisphere */}
      <directionalLight ref={fillRef} intensity={0.65} color="#D8ECF4" />

      {/* Subtle Outer Space Emerald Rim Bounce */}
      <directionalLight ref={rimRef} intensity={0.35} color="#39B86B" />
    </>
  )
}

function EarthFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#B8F34A]/30 bg-[#08291C] flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(57,184,107,0.3)]">
        <div className="absolute inset-0 bg-radial-[at_30%_30%] from-[#B8F34A]/25 via-[#39B86B]/15 to-[#041A12]/90" />
        <span className="text-xs font-mono text-[#B8F34A] tracking-widest uppercase animate-pulse z-10">
          Loading 3D Biosphere...
        </span>
      </div>
    </div>
  )
}

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function Earth3D() {
  const controlsRef = useRef(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [hasWebGL] = useState(checkWebGLSupport)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Interaction handlers: pause auto-rotate during manual drag, resume smoothly after
  const handleInteractionStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsInteracting(true)
  }

  const handleInteractionEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    // Resume gentle auto-rotation after 1.8 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 1800)
  }

  if (!hasWebGL) {
    return <EarthFallback />
  }

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={<EarthFallback />}>
        <Canvas
          camera={{ position: [0, 0, 2.75], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.18,
          }}
          className="w-full h-full"
        >
          {/* Ambient Fill Light:
              Provides soft, balanced baseline illumination across the globe */}
          <ambientLight intensity={0.68} color="#E8F4F8" />

          {/* Dynamic Camera-Linked Directional Lighting:
              Maintains balanced daylight illumination across whichever continent is facing the user,
              permanently eliminating dark blind-spots during horizontal and vertical rotation */}
          <CameraLinkedLighting />

          {/* Realistic Earth & Atmospheric Shaders */}
          <EarthGlobe />

          {/* Smooth Interactive Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.65}
            enableDamping={true}
            dampingFactor={0.055}
            autoRotate={!isInteracting}
            autoRotateSpeed={0.65}
            minPolarAngle={0.08}
            maxPolarAngle={Math.PI - 0.08}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
