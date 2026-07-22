import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import earthTex from "@/assets/earth.jpg";

// Elliptical orbit parameters
const ORBIT_A = 0.85; // semi-major axis (X)
const ORBIT_B = 0.32; // semi-minor axis (Z) — ellipse gives 3-D depth
const ORBIT_TILT = 0.18; // vertical wobble
const ORBIT_SPEED = 0.38; // radians/s — one full orbit ~16 s
const EARTH_RADIUS = 0.6;

function OrbitalEarth() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const orbitRef = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, earthTex);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Self-rotation
    earthRef.current.rotation.y += 0.006;
    // Slight axial tilt wobble for realism
    earthRef.current.rotation.z = Math.sin(t * 0.12) * 0.04;

    // Elliptical orbital motion
    const angle = t * ORBIT_SPEED;
    orbitRef.current.position.x = Math.cos(angle) * ORBIT_A;
    orbitRef.current.position.z = Math.sin(angle) * ORBIT_B;
    orbitRef.current.position.y = Math.sin(angle * 2) * ORBIT_TILT;

    // Perspective scaling: closer to camera (positive Z) → slightly bigger
    const depth = (orbitRef.current.position.z + ORBIT_B) / (ORBIT_B * 2);
    const s = 0.82 + depth * 0.36;
    orbitRef.current.scale.setScalar(s);
  });

  return (
    <group ref={orbitRef}>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.82}
          metalness={0.08}
          emissive={new THREE.Color("#071624")}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh scale={1.055}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.13}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere haze */}
      <mesh scale={1.18}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.045}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function OrbitPath() {
  // Visible elliptical orbit trail ring (flat ellipse)
  const ringRef = useRef<THREE.Line>(null!);

  const points: THREE.Vector3[] = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * ORBIT_A,
        Math.sin(angle * 2) * ORBIT_TILT,
        Math.sin(angle) * ORBIT_B
      )
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    // @ts-expect-error — primitive line
    <line ref={ringRef} geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.22} />
    </line>
  );
}

function SunGlow() {
  // Subtle sun flare positioned off to one side
  return (
    <>
      <mesh position={[2.2, 1.2, -1.5]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#fff8d0" />
      </mesh>
      <pointLight position={[2.2, 1.2, -1.5]} intensity={0.6} color="#fff8d0" distance={8} />
    </>
  );
}

export function LoginEarthScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 3.6], fov: 48 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Primary sun light — warm, upper-right */}
      <pointLight position={[3.5, 2.5, 2]} intensity={5} color="#fff3c4" />
      {/* Deep space ambient — near zero so dark side is dark */}
      <ambientLight intensity={0.06} />
      {/* Cool rim light from left for atmosphere edge */}
      <directionalLight position={[-2.5, 0.5, -1]} intensity={0.35} color="#38bdf8" />

      <Suspense fallback={null}>
        <OrbitalEarth />
        <OrbitPath />
        <SunGlow />
      </Suspense>

      <Stars
        radius={35}
        depth={25}
        count={1800}
        factor={2.2}
        saturation={0}
        fade
        speed={0.25}
      />
    </Canvas>
  );
}
