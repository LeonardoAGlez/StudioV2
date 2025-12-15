import React, { useRef } from 'react';
import { Group } from 'three';

export const Mannequin: React.FC = () => {
  const group = useRef<Group>(null);

  // A simple constructed geometric robot/mannequin
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.9, 0.3]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#e4e4e7" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.45, 1.6, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color="#71717a" />
      </mesh>
      <mesh position={[0.45, 1.6, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color="#71717a" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.12, 1.0, 4, 8]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.12, 1.0, 4, 8]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>

      {/* Direction indicator (Gizmo) */}
      <mesh position={[0, 0.1, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshBasicMaterial color="#ef4444" wireframe />
      </mesh>
    </group>
  );
};
