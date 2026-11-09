import { useEffect, useRef, useMemo, useState, Component, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Graceful WebGL Error Boundary fallback
class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  override state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override componentDidCatch(error: unknown) {
    console.warn('3D WebGL context initialization bypassed:', error);
  }
  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Check for WebGL capability in the browser
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface RibbonProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive: string;
  opacity: number;
  speed: number;
  offset: number;
  reducedMotion: boolean;
  isVisible: boolean;
}

function FloatingRibbon({
  position,
  rotation,
  scale,
  color,
  emissive,
  opacity,
  speed,
  offset,
  reducedMotion,
  isVisible,
}: RibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Simplified geometry: 18 x 8 segments (144 vertices instead of 648)
  const geometry = useMemo(() => new THREE.PlaneGeometry(8, 2.8, 18, 8), []);

  const initialPositions = useMemo(() => {
    const pos = geometry.attributes['position'] as THREE.BufferAttribute;
    return new Float32Array(pos.array);
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current || !isVisible || reducedMotion) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    const pos = geometry.attributes['position'] as THREE.BufferAttribute | undefined;
    if (!pos) return;
    const init = initialPositions;

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const x = init[i3] ?? 0;
      const y = init[i3 + 1] ?? 0;

      // Luxurious, slow silk drape wave
      const wave1 = Math.sin(x * 0.6 + t * 0.7) * 0.35;
      const wave2 = Math.cos(y * 1.1 + t * 0.5) * 0.22;
      const wave3 = Math.sin((x + y) * 0.35 + t * 0.4) * 0.14;

      pos.setZ(i, wave1 + wave2 + wave3);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    meshRef.current.position.y = position[1] + Math.sin(t * 0.35) * 0.12;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.035;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.25}
        roughness={0.35}
        metalness={0.25}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

interface OrbProps {
  basePosition: [number, number, number];
  color: string;
  emissive: string;
  radius: number;
  hasLight?: boolean;
  driftSpeed: number;
  driftRadius: number;
  offset: number;
  reducedMotion: boolean;
  isVisible: boolean;
}

function GlowingOrb({
  basePosition,
  color,
  emissive,
  radius,
  hasLight,
  driftSpeed,
  driftRadius,
  offset,
  reducedMotion,
  isVisible,
}: OrbProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isVisible || reducedMotion) return;
    const t = state.clock.getElapsedTime() * driftSpeed + offset;
    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.9) * driftRadius;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.7) * (driftRadius * 0.7);
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.5) * (driftRadius * 0.5);
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {/* Core glowing sphere - simplified to 16x12 segments */}
      <mesh>
        <sphereGeometry args={[radius, 16, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Soft ethereal outer halo - simplified to 12x8 segments */}
      <mesh>
        <sphereGeometry args={[radius * 1.45, 12, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.16}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Only 1 subtle point light for the primary golden orb */}
      {hasLight && <pointLight color={color} intensity={1.0} distance={4} decay={2} />}
    </group>
  );
}

interface HeroSceneProps {
  reducedMotion: boolean;
  isVisible: boolean;
  mouseRef: RefObject<{ x: number; y: number }>;
  isFinePointer: boolean;
}

function HeroScene({ reducedMotion, isVisible, mouseRef, isFinePointer }: HeroSceneProps) {
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!parallaxGroupRef.current || !isVisible || reducedMotion) return;

    // Smooth easing with frame-rate independent exponential dampening
    const factor = 1 - Math.exp(-3.2 * delta);
    const targetX = isFinePointer && mouseRef.current ? mouseRef.current.x : 0;
    const targetY = isFinePointer && mouseRef.current ? mouseRef.current.y : 0;

    // Subtle luxury parallax offset: max ~0.22 units on X, ~0.14 on Y
    currentPos.current.x += (targetX * 0.22 - currentPos.current.x) * factor;
    currentPos.current.y += (targetY * 0.14 - currentPos.current.y) * factor;

    // Subtle 3D tilt: max ~0.05 rad on Y, ~0.035 rad on X
    currentRot.current.y += (targetX * 0.05 - currentRot.current.y) * factor;
    currentRot.current.x += (-targetY * 0.035 - currentRot.current.x) * factor;

    parallaxGroupRef.current.position.x = currentPos.current.x;
    parallaxGroupRef.current.position.y = currentPos.current.y;
    parallaxGroupRef.current.rotation.y = currentRot.current.y;
    parallaxGroupRef.current.rotation.x = currentRot.current.x;
  });

  return (
    <>
      <ambientLight color="#2e1065" intensity={0.9} />
      <directionalLight position={[4, 5, 3]} color="#c084fc" intensity={1.5} />
      <directionalLight position={[-4, 2, 2]} color="#fef08a" intensity={0.65} />

      {/* Parallax Group containing ribbons and orbs */}
      <group ref={parallaxGroupRef}>
        {/* 2 Floating Silk Ribbons (Main deep violet & soft lavender) */}
        <FloatingRibbon
          position={[2.3, 0.05, -1.1]}
          rotation={[-0.35, 0.45, -0.28]}
          scale={[1.35, 1.15, 1]}
          color="#4c1d95"
          emissive="#2e1065"
          opacity={0.65}
          speed={0.38}
          offset={0}
          reducedMotion={reducedMotion}
          isVisible={isVisible}
        />
        <FloatingRibbon
          position={[1.5, -0.7, 0.1]}
          rotation={[-0.25, 0.32, -0.15]}
          scale={[1.1, 0.95, 1]}
          color="#8b5cf6"
          emissive="#5b21b6"
          opacity={0.52}
          speed={0.3}
          offset={2.4}
          reducedMotion={reducedMotion}
          isVisible={isVisible}
        />

        {/* 2 Warm drifting glowing orbs */}
        <GlowingOrb
          basePosition={[1.4, 0.7, -0.4]}
          color="#fef08a"
          emissive="#f59e0b"
          radius={0.15}
          hasLight={true}
          driftSpeed={0.28}
          driftRadius={0.25}
          offset={0}
          reducedMotion={reducedMotion}
          isVisible={isVisible}
        />
        <GlowingOrb
          basePosition={[-1.7, -0.45, -1.2]}
          color="#f5d0fe"
          emissive="#c084fc"
          radius={0.12}
          hasLight={false}
          driftSpeed={0.24}
          driftRadius={0.2}
          offset={2.2}
          reducedMotion={reducedMotion}
          isVisible={isVisible}
        />
      </group>
    </>
  );
}

export default function HeroBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLAvailable());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onMotionChange);

    // Detect fine pointer (mouse / trackpad) vs coarse pointer (touch device)
    const pointerMq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(pointerMq.matches);

    const onPointerChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    pointerMq.addEventListener?.('change', onPointerChange);

    // Track gentle mouse movement only when fine pointer is active
    let cleanupMouseListeners: (() => void) | undefined;
    if (pointerMq.matches) {
      const handleMouseMove = (e: MouseEvent) => {
        // Normalize coordinates relative to window center [-1, 1]
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      const handleMouseLeave = () => {
        // Smoothly ease back to rest state when cursor leaves the window
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);

      cleanupMouseListeners = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // Pause WebGL rendering loop when hero scrolls off-screen
    const el = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first) {
            setIsVisible(first.isIntersecting);
          }
        },
        { rootMargin: '100px' }
      );
      observer.observe(el);
    }

    return () => {
      mq.removeEventListener?.('change', onMotionChange);
      pointerMq.removeEventListener?.('change', onPointerChange);
      cleanupMouseListeners?.();
      observer?.disconnect();
    };
  }, []);

  if (!mounted || !hasWebGL) return null;

  return (
    <WebGLErrorBoundary fallback={null}>
      <div
        ref={containerRef}
        className="hero-canvas-container"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 46 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.25]}
          frameloop={isVisible && !reducedMotion ? 'always' : 'never'}
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
          }}
        >
          <HeroScene
            reducedMotion={reducedMotion}
            isVisible={isVisible}
            mouseRef={mouseRef}
            isFinePointer={isFinePointer}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
