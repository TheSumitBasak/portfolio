import { Float, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

// Three.js Components
export function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe overlay */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh scale={[2.1, 2.1, 2.1]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#6b7280"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function BackgroundShapes({
  variant = "default",
}: {
  variant?:
    | "default"
    | "features"
    | "about"
    | "skills"
    | "experience"
    | "projects"
    | "contact";
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  const renderShapes = () => {
    switch (variant) {
      case "features":
        return (
          <>
            {/* Floating cubes */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
              <mesh position={[-4, 2, -3]} scale={0.8}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
              <mesh position={[4, -1, -2]} scale={0.5}>
                <octahedronGeometry args={[1]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
              <mesh position={[0, 3, -4]} scale={0.6}>
                <tetrahedronGeometry args={[1]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
          </>
        );
      case "about":
        return (
          <>
            {/* Geometric rings */}
            <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
              <mesh position={[-3, 1, -2]} rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[1, 0.1, 8, 16]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
              <mesh position={[3, -2, -3]} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.8, 0.05, 6, 12]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
            <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
              <mesh position={[0, 2.5, -4]}>
                <sphereGeometry args={[0.5, 8, 6]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
          </>
        );
      case "skills":
        return (
          <>
            {/* Tech-inspired shapes */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.7}>
              <mesh position={[-2, 1, -2]}>
                <dodecahedronGeometry args={[0.6]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
              <mesh position={[2, -1, -3]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
            <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.9}>
              <mesh position={[0, 2, -4]}>
                <icosahedronGeometry args={[0.4, 1]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
              <mesh position={[-3, -2, -2]}>
                <cylinderGeometry args={[0.3, 0.3, 1, 6]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
          </>
        );
      case "experience":
        return (
          <>
            {/* Professional timeline shapes */}
            <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
              <mesh position={[-4, 2, -3]}>
                <coneGeometry args={[0.5, 1, 8]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.8}>
              <mesh position={[4, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.6, 1.2, 8]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
            <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
              <mesh position={[0, -2, -4]}>
                <octahedronGeometry args={[0.7]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
            <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.4}>
              <mesh position={[-2, -1, -1]}>
                <tetrahedronGeometry args={[0.4]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
          </>
        );
      case "projects":
        return (
          <>
            {/* Creative project shapes */}
            <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
              <mesh position={[-3, 1.5, -2]} rotation={[0, 0, Math.PI / 6]}>
                <torusKnotGeometry args={[0.6, 0.1, 64, 8]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
              <mesh position={[3, -1, -3]}>
                <dodecahedronGeometry args={[0.5]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
              <mesh
                position={[0, 2, -4]}
                rotation={[Math.PI / 4, Math.PI / 4, 0]}
              >
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
            <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.3}>
              <mesh position={[2, 2, -1]}>
                <sphereGeometry args={[0.3, 12, 8]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
          </>
        );
      case "contact":
        return (
          <>
            {/* Communication-inspired shapes */}
            <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.6}>
              <mesh position={[-2, 1, -2]}>
                <torusGeometry args={[0.8, 0.1, 8, 16]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
            </Float>
            <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.4}>
              <mesh
                position={[2, -1, -3]}
                rotation={[0, Math.PI / 3, Math.PI / 6]}
              >
                <coneGeometry args={[0.4, 1, 6]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </Float>
            <Float speed={2.1} rotationIntensity={0.1} floatIntensity={0.8}>
              <mesh position={[0, 2, -4]}>
                <icosahedronGeometry args={[0.5, 0]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </Float>
          </>
        );
      default:
        return (
          <>
            {/* Default hero shapes */}
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
              <mesh scale={[2.1, 2.1, 2.1]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                  color="#6b7280"
                  wireframe
                  transparent
                  opacity={0.2}
                />
              </mesh>
            </Float>
          </>
        );
    }
  };

  return <group ref={groupRef}>{renderShapes()}</group>;
}

export function Scene({
  variant = "default",
}: {
  variant?:
    | "default"
    | "features"
    | "about"
    | "skills"
    | "experience"
    | "projects"
    | "contact";
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} />
      {variant === "default" ? <FloatingGeometry /> : null}
      <BackgroundShapes variant={variant} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}
