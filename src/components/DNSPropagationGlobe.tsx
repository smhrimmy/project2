import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

export interface DNSServerResult {
  provider: string;
  location: string;
  ip: string;
  status: 'resolved' | 'timeout' | 'error';
  records: string[];
  lat: number;
  lon: number;
}

interface GlobeProps {
  results: DNSServerResult[];
}

const GLOBE_RADIUS = 5;

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
};

const Marker = ({ result }: { result: DNSServerResult }) => {
  const position = useMemo(() => {
    return latLonToVector3(result.lat, result.lon, GLOBE_RADIUS);
  }, [result.lat, result.lon]);

  const [hovered, setHovered] = useState(false);
  const color = result.status === 'resolved' ? '#10b981' : result.status === 'timeout' ? '#f59e0b' : '#ef4444';

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="p-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none border border-gray-700">
            <div className="font-bold">{result.location}</div>
            <div>{result.provider}</div>
            <div className="text-gray-400">{result.ip}</div>
            <div className={`uppercase text-[10px] mt-1 ${result.status === 'resolved' ? 'text-green-400' : 'text-red-400'}`}>
              {result.status}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const Earth = () => {
  return (
    <Sphere args={[GLOBE_RADIUS, 64, 64]}>
      <meshPhongMaterial
        color="#1e293b"
        emissive="#0f172a"
        specular="#1e293b"
        shininess={10}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
};

const Atmosphere = () => {
  return (
    <Sphere args={[GLOBE_RADIUS + 0.1, 64, 64]}>
      <meshPhongMaterial
        color="#3b82f6"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

export const DNSPropagationGlobe: React.FC<GlobeProps> = ({ results }) => {
  return (
    <div className="w-full h-[500px] bg-gray-950 rounded-xl overflow-hidden relative border border-gray-800">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur p-3 rounded-lg border border-gray-700">
        <h3 className="text-sm font-bold text-white mb-2">Propagation Status</h3>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-gray-300">Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-gray-300">Timeout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-300">Error</span>
          </div>
        </div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <group>
          <Earth />
          <Atmosphere />
          {results.map((result, i) => (
            <Marker key={`${result.ip}-${i}`} result={result} />
          ))}
        </group>

        <OrbitControls enablePan={false} minDistance={8} maxDistance={20} autoRotate autoRotateSpeed={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};