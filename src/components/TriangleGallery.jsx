// src/components/TriangleGallery.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Reflector } from '@react-three/drei';
import * as THREE from 'three';
import { AssetManager } from './utils/AssetManager';

function TriangleGallery() {
  // Use preloaded textures from AssetManager
  const textures = AssetManager.getSampleTexturesForGallery(8);
  
  const reflectionProps = {
    resolution: 512,
    mirror: 1,
    mixBlur: 0.8,
    mixStrength: 0.9,
    color: 'green',
    metalness: 0.6,
    roughness: 0.2
  };

  const rotationSpeed = 0.001;
  const triangleRef = useRef();
  
  useFrame(() => {
    if (triangleRef.current) {
      triangleRef.current.rotation.y += rotationSpeed;
    }
  });

  const createTriangleWall = (size, height, yPosition) => {
    const walls = [];
    const points = [
      [-size, 0, -size],
      [size, 0, -size],
      [0, 0, size]
    ];

    for (let i = 0; i < 3; i++) {
      const start = points[i];
      const end = points[(i + 1) % 3];
      const dx = end[0] - start[0];
      const dz = end[2] - start[2];
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      walls.push(
        <mesh
          key={`wall-${i}`}
          position={[
            (start[0] + end[0]) / 2,
            yPosition,
            (start[2] + end[2]) / 2
          ]}
          rotation={[0, angle, 0]}
        >
          <planeGeometry args={[length, height]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
      );
    }
    return walls;
  };

  return (
    <>
      {/* Triangle Gallery Structure */}
      <group ref={triangleRef}>
        {/* Inner Triangle Floor */}
        <Reflector
          resolution={reflectionProps.resolution}
          args={[30, 30]}
          mirror={reflectionProps.mirror}
          mixBlur={reflectionProps.mixBlur}
          mixStrength={reflectionProps.mixStrength}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          {(Material, props) => (
            <Material 
              color={reflectionProps.color} 
              metalness={reflectionProps.metalness} 
              roughness={reflectionProps.roughness} 
              {...props} 
            />
          )}
        </Reflector>

        {/* Inner Walls */}
        {createTriangleWall(10, 8, 4)}

        {/* Paintings */}
        {Array.from({ length: 3 }).map((_, i) => {
          const texture = textures[i];
          const angle = (i * Math.PI * 2) / 3;
          const radius = 8;

          // Calculate aspect ratio for the texture
          const aspectRatio = 
            texture.image instanceof HTMLCanvasElement ? 1 :
            texture.image ? texture.image.width / texture.image.height : 1;
            
          const height = 1.5; // Base height
          const width = height * aspectRatio;

          return (
            <group
              key={`painting-${i}`}
              position={[
                radius * Math.cos(angle),
                3,
                radius * Math.sin(angle)
              ]}
              rotation={[0, angle + Math.PI / 2, 0]}
            >
              {/* Frame */}
              <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[width + 0.2, height + 0.2]} />
                <meshStandardMaterial color="black" />
              </mesh>
              
              {/* Art */}
              <mesh>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial map={texture} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Outer Triangle Floor */}
      <Reflector
        resolution={reflectionProps.resolution}
        args={[60, 60]}
        mirror={reflectionProps.mirror}
        mixBlur={reflectionProps.mixBlur}
        mixStrength={reflectionProps.mixStrength}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        {(Material, props) => (
          <Material 
            color="#FFC67D" 
            metalness={reflectionProps.metalness} 
            roughness={reflectionProps.roughness} 
            {...props} 
          />
        )}
      </Reflector>

      {/* Outer Walls */}
      {createTriangleWall(20, 12, 6)}
    </>
  );
}

export default TriangleGallery;