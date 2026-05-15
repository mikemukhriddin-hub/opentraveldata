import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera, Environment, Text, Cylinder, Box, Cone } from '@react-three/drei';
import * as THREE from 'three';

// 1. REGISTON MODEL (Samarqand style)
const RegistonModel = ({ color }) => {
  return (
    <group position={[0, -1, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main Arch (Iwan) */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 0.5]} />
          <meshStandardMaterial color="#005fa4" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.8, 0.3]}>
          <boxGeometry args={[2.5, 2.5, 0.2]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.8} emissive="#00e5ff" emissiveIntensity={0.2} />
        </mesh>
        {/* Two Minarets */}
        <mesh position={[-2.2, 2, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 4, 32]} />
          <meshStandardMaterial color="#0097a7" />
        </mesh>
        <mesh position={[2.2, 2, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 4, 32]} />
          <meshStandardMaterial color="#0097a7" />
        </mesh>
        {/* Blue Dome */}
        <mesh position={[0, 3.2, -0.5]}>
          <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00e5ff" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

// 2. AFROSIYOB TRAIN MODEL
const AfrosiyobModel = () => {
  const trainRef = useRef();
  useFrame((state) => {
    if (trainRef.current) {
      trainRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 2) * 2;
    }
  });
  return (
    <group ref={trainRef} position={[0, 0, 0]}>
      <Float speed={5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Train Body */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.5, 4, 32, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Blue Line */}
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.51, 0.51, 3.5, 32]} />
          <meshStandardMaterial color="#005fa4" />
        </mesh>
        {/* Windows (Glowing) */}
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 3.8, 32]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>
      <gridHelper args={[20, 20, "#00e5ff", "#222"]} position={[0, -1, 0]} />
    </group>
  );
};

// 3. NATURE MODEL (Uzbek Mountains)
const NatureModel = () => {
  return (
    <group position={[0, -1, 0]}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Snow Peaks */}
        <mesh position={[-2, 1, -2]}>
          <coneGeometry args={[2, 4, 4]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
        <mesh position={[2, 1.5, -3]}>
          <coneGeometry args={[2.5, 5, 4]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
        {/* Green Base */}
        <mesh position={[-2, 0, -2]}>
          <coneGeometry args={[2.2, 2, 4]} />
          <meshStandardMaterial color="#10b981" flatShading />
        </mesh>
        <mesh position={[2, 0.2, -3]}>
          <coneGeometry args={[2.7, 2.5, 4]} />
          <meshStandardMaterial color="#059669" flatShading />
        </mesh>
        {/* Floating Clouds */}
        <group position={[0, 2.5, -1]}>
          <Sphere args={[0.5, 16, 16]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </Sphere>
          <Sphere args={[0.4, 16, 16]} position={[0.6, -0.1, 0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </Sphere>
        </group>
      </Float>
    </group>
  );
};

const Scene = ({ view, category }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#005fa4" />

      {/* Dinamik Model Tanlash */}
      {(view === 'home' || (view === 'discover' && !category)) && <RegistonModel />}
      {view === 'routes' && <AfrosiyobModel />}
      {view === 'nature' && <NatureModel />}
      
      {/* Category-specific default shapes if not matched */}
      {category && category !== 'Historical' && view !== 'routes' && (
        <Float speed={2}>
          <Sphere args={[1, 64, 64]} scale={1.5}>
            <MeshDistortMaterial
              color={category === 'Restaurant' ? '#facc15' : '#a855f7'}
              speed={2}
              distort={0.4}
              metalness={0.8}
            />
          </Sphere>
        </Float>
      )}

      {category === 'Historical' && view === 'discover' && <RegistonModel />}

      <Stars radius={150} depth={50} count={10000} factor={7} saturation={0} fade speed={2} />
    </group>
  );
};

const Background3D = ({ view, category }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <Scene view={view} category={category} />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]" />
    </div>
  );
};

export default Background3D;
