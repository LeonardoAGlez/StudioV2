import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera, Environment, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Mannequin } from './Mannequin';
import { CameraState, LightingPreset, TransformMode } from '../types';

interface StudioSceneProps {
  fov: number;
  lighting: LightingPreset;
  showSubject: boolean;
  transformMode: TransformMode;
  onCameraUpdate: (state: CameraState) => void;
}

// Helper to extract camera data
const CameraLogger: React.FC<{ onUpdate: (state: CameraState) => void }> = ({ onUpdate }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Initial sync
    const p = camera.position;
    const r = camera.rotation;
    const cam = camera as THREE.PerspectiveCamera;
    onUpdate({ position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z], fov: cam.fov });
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true} // Add damping for cinematic feel
      dampingFactor={0.05}
      onEnd={() => {
        // Use the camera from useThree() as it is being controlled
        const cam = camera as THREE.PerspectiveCamera;
        onUpdate({
          position: [cam.position.x, cam.position.y, cam.position.z],
          rotation: [cam.rotation.x, cam.rotation.y, cam.rotation.z],
          fov: cam.fov
        });
      }}
    />
  );
};

// Lighting Setup based on presets
const LightingSetup: React.FC<{ preset: LightingPreset }> = ({ preset }) => {
  switch (preset) {
    case LightingPreset.GoldenHour:
      return (
        <>
          <ambientLight intensity={0.4} color="#ffaa00" />
          <directionalLight position={[10, 5, 5]} intensity={2} color="#ff9900" castShadow />
          <Environment preset="sunset" />
        </>
      );
    case LightingPreset.Midnight:
      return (
        <>
          <ambientLight intensity={0.1} color="#001133" />
          <pointLight position={[2, 3, 2]} intensity={5} color="#4488ff" />
          <Environment preset="night" />
        </>
      );
    case LightingPreset.NeonCity:
      return (
        <>
           <ambientLight intensity={0.1} />
           <rectAreaLight width={5} height={20} position={[-5, 0, 0]} color="#ff00ff" intensity={5} />
           <rectAreaLight width={5} height={20} position={[5, 0, 0]} color="#00ffff" intensity={5} />
           <Environment preset="city" />
        </>
      );
    case LightingPreset.Overcast:
      return (
        <>
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight position={[0, 10, 0]} intensity={1} castShadow />
          <Environment preset="park" />
        </>
      );
    case LightingPreset.Studio:
    default:
      return (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#b0c4de" />
          <Environment preset="studio" />
        </>
      );
  }
};

// Interactive Mannequin Wrapper
const InteractiveMannequin: React.FC<{ mode: TransformMode }> = ({ mode }) => {
  return (
    <>
      {mode ? (
        <TransformControls mode={mode} size={0.8}>
           <Mannequin />
        </TransformControls>
      ) : (
        <Mannequin />
      )}
    </>
  );
};

// Main Scene Component
export const StudioScene = forwardRef<HTMLCanvasElement, StudioSceneProps>(({ fov, lighting, showSubject, transformMode, onCameraUpdate }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => canvasRef.current!);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      className="w-full h-full bg-[#111]"
    >
      <PerspectiveCamera makeDefault fov={fov} position={[0, 2, 5]} />
      
      <LightingSetup preset={lighting} />
      
      <group>
        {showSubject && <InteractiveMannequin mode={transformMode} />}
        
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          cellColor="#3f3f46"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#71717a"
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid
        />
        <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} color="#000000" />
      </group>

      <CameraLogger onUpdate={onCameraUpdate} />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
      </GizmoHelper>

      {/* Center Reticle Simulation */}
      <mesh position={[0, 0, 0]}>
         {/* Invisible mesh just to ensure scene has content if empty */}
      </mesh>
    </Canvas>
  );
});

StudioScene.displayName = "StudioScene";
