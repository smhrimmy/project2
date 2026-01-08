import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ServerRackProps {
  position: [number, number, number];
  rotationSpeed?: number;
  floatSpeed?: number;
  floatOffset?: number;
}

const ServerRack = ({ position, rotationSpeed = 0.001, floatSpeed = 1, floatOffset = 0 }: ServerRackProps) => {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += rotationSpeed;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed + floatOffset) * 0.5;
    }
  });

  return (
    <group ref={mesh} position={position}>
      {/* Rack Body */}
      <mesh>
        <boxGeometry args={[2, 4, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* LED Indicators */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0.8, 1.5 - i * 0.5, 0.51]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#00ff00" : "#ff0000"} />
        </mesh>
      ))}
      
      {[...Array(5)].map((_, i) => (
        <mesh key={`r-${i}`} position={[-0.8, 1.5 - i * 0.5, 0.51]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#0000ff" : "#00ff00"} />
        </mesh>
      ))}
    </group>
  );
};

const ServerRacksScene = () => {
  return (
    <>
      <color attach="background" args={['#050510']} />
      <ambientLight intensity={0.3} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <ServerRack position={[-4, 0, -5]} rotationSpeed={0.002} floatSpeed={0.8} floatOffset={0} />
      <ServerRack position={[0, 0, -3]} rotationSpeed={-0.001} floatSpeed={1} floatOffset={2} />
      <ServerRack position={[4, 0, -5]} rotationSpeed={0.0015} floatSpeed={0.9} floatOffset={4} />
      
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
    </>
  );
};

export default ServerRacksScene;
