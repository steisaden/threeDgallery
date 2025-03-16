import React, { useRef } from 'react';
import { Reflector } from '@react-three/drei';
import { useLoader,  useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function CircleGallery() {
  // Sample image URLs - replace with your actual image URLs
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
  
  const reflectionProps = {
    resolution: 512,
    mirror: 1,
    mixBlur: 1,
    mixStrength: 1,
    color: 'purple',
    metalness: 0.6,
    roughness: 0.2
  };
  
  const rotationSpeed = 0.001;
  const innerCircleRef = useRef();
  const outerCircleRef = useRef();
  
  // Load textures using useLoader
  const textures = useLoader(TextureLoader, sampleImages);
  
  useFrame(() => {
    if (!textures || textures.some(texture => !texture.image)) {
      return;
    }

    if (innerCircleRef.current) {
      innerCircleRef.current.rotation.y += rotationSpeed;
    }
    if (outerCircleRef.current) {
      outerCircleRef.current.rotation.y -= rotationSpeed;
    }
  });

  const createCircularWall = (radius, height, segments, yPosition, color) => {
    const walls = [];
    const segmentAngle = (2 * Math.PI) / segments;
    
    for (let i = 0; i < segments; i++) {
      const angle = i * segmentAngle;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      walls.push(
        <mesh 
          key={`wall-${radius}-${i}`}
          position={[x, yPosition, z]}
          rotation={[0, angle + Math.PI / 2, 0]}
        >
          <planeGeometry args={[2 * Math.PI * radius / segments, height]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      );
    }
    return walls;
  };

  return (
    <>
      {/* Circular Gallery Structure */}
      <group ref={innerCircleRef}>
        {/* Inner Circle - Circular Reflector */}
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 0]}>
            <circleGeometry args={[30, 64]} />
            <Reflector
              resolution={reflectionProps.resolution}
              mirror={reflectionProps.mirror}
              mixBlur={reflectionProps.mixBlur}
              mixStrength={reflectionProps.mixStrength}
            >
              {(Material, props) => (
                <Material 
                  color='red' 
                  metalness={reflectionProps.metalness} 
                  roughness={reflectionProps.roughness} 
                  {...props} 
                />
              )}
            </Reflector>
          </mesh>
        </group>

        {/* Inner Walls */}
        {createCircularWall(30, 8, 12, 4, 'white')}

        {/* Paintings */}
        {Array.from({ length: 6 }).map((_, i) => {
          const texture = textures[i % textures.length];
          const angle = (i * Math.PI * 2) / 12;
          const radius = 28;

          // Calculate aspect ratio and adjust dimensions
          const aspectRatio = texture.image.width / texture.image.height;
          const height = 12.5; // Base height
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

      <group ref={outerCircleRef}>
        {/* Outer Circle - Circular Reflector */}
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <circleGeometry args={[60, 64]} />
            <Reflector
              resolution={reflectionProps.resolution}
              mirror={reflectionProps.mirror}
              mixBlur={reflectionProps.mixBlur}
              mixStrength={reflectionProps.mixStrength}
            >
              {(Material, props) => (
                <Material 
                  color="blue" 
                  metalness={reflectionProps.metalness} 
                  roughness={reflectionProps.roughness} 
                  {...props} 
                />
              )}
            </Reflector>
          </mesh>
        </group>

        {/* Outer Walls */}
        {createCircularWall(60, 12, 16, 6, 'white')}
      </group>
    </>
  );
}

export default CircleGallery;