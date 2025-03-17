// src/components/CircleGallery.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Reflector } from '@react-three/drei';
import * as THREE from 'three';
import { AssetManager } from './utils/AssetManager';

function CircleGallery() {
  // Use preloaded textures from AssetManager
  const textures = AssetManager.getSampleTexturesForGallery(8);
  
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
  
  useFrame(() => {
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
        {textures.slice(0, 6).map((texture, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const radius = 28;

          // Calculate aspect ratio for the texture
          const aspectRatio = 
            texture.image instanceof HTMLCanvasElement ? 1 :
            texture.image ? texture.image.width / texture.image.height : 1;
            
          const height = 6.5; // Smaller than original
          const width = height * aspectRatio;

          return (
            <group key={`painting-${i}`} position={[
              radius * Math.cos(angle),
              3,
              radius * Math.sin(angle)
            ]} rotation={[0, angle + Math.PI / 2, 0]}>
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