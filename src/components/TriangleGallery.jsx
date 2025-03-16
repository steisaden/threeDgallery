import React, { useRef } from 'react';
import { Reflector } from '@react-three/drei';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function TriangleGallery() {
  const sampleImages = [
    '/assets/imgs/wall.jpg',
    '/assets/imgs/wos.jpg',
    '/assets/imgs/tunnelcanals.jpg',
    '/assets/imgs/tryangles.jpg',
    '/assets/imgs/painters.jpg',
    '/assets/imgs/lido.jpg',
    '/assets/imgs/konica.jpg',
    '/assets/imgs/flower.jpg'
  ];
  
  const textures = useLoader(TextureLoader, sampleImages);
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
    if (!textures) return;

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
          const texture = textures[i % textures.length];
          const angle = (i * Math.PI * 2) / 3;
          const radius = 8;

          // Calculate aspect ratio and adjust dimensions
          const aspectRatio = texture.image.width / texture.image.height;
          const height = 1.5; // Base height
          const width = height * aspectRatio;

          return (
            <mesh
              key={`painting-${i}`}
              position={[
                radius * Math.cos(angle),
                3,
                radius * Math.sin(angle)
              ]}
              rotation={[0, angle + Math.PI / 2, 0]}
            >
              <planeGeometry args={[width, height]} />
              <meshStandardMaterial map={texture} />
            </mesh>
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