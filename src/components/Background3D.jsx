import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Environment, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Parallax Image Component with Enhanced Lighting
const ParallaxImage = ({ url, position = [0, 0, 0], scale = [16, 9, 1] }) => {
  const meshRef = useRef();
  const texture = useTexture(url);
  const { mouse } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      const targetX = mouse.x * 0.4;
      const targetY = mouse.y * 0.4;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={scale} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true} 
        roughness={0.1}
        metalness={0.5}
        emissive="#facc15"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

const ProScene = ({ view, category }) => {
  const images = {
    // Tilla-Qori Oltin Masjid (Golden Mosque) - Stable High-Res Link
    home: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Samarkand_Registan_Tilla_Kari_interior_dome.jpg/1280px-Samarkand_Registan_Tilla_Kari_interior_dome.jpg",
    transport: "https://www.tourstouzbekistan.com/uploads/2021%20photos/Trains/Afrosiyob/Afrosiyob_train_Uzbekistan_AnurTour.jpg",
    nature: "https://images.pexels.com/photos/26729708/pexels-photo-26729708.jpeg"
  };

  const activeImage = useMemo(() => {
    if (view === 'routes') return images.transport;
    if (view === 'nature') return images.nature;
    return images.home;
  }, [view]);

  return (
    <group>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#facc15" />
      <pointLight position={[-10, -10, -10]} color="#005fa4" intensity={1} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

      <Suspense fallback={null}>
        <ParallaxImage url={activeImage} scale={[20, 11, 1]} position={[0, 0, -3]} />
      </Suspense>

      <Stars radius={150} depth={50} count={8000} factor={6} saturation={0.5} fade speed={2} />
    </group>
  );
};

const Background3D = ({ view, category }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] pointer-events-none">
      <Canvas shadows dpr={[1, 2]} style={{ pointerEvents: 'auto' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ProScene view={view} category={category} />
        <Environment preset="sunset" />
      </Canvas>
      {/* Cinematic Golden Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(250,204,21,0.05)_70%,#000_100%)]" />
    </div>
  );
};

export default Background3D;
