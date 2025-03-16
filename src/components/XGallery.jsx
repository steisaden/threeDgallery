import React from 'react';
import { Reflector } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function XGallery() {
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
    mirror: 0.9,
    mixBlur: 0.7,
    mixStrength: 0.8,
    color: '#FFC67D',
    metalness: 0.6,
    roughness: 0.2
  };

  // Load textures using useLoader
  const textures = useLoader(TextureLoader, sampleImages);

  // Add loading state check
  if (!textures || textures.some(texture => !texture || !texture.image)) {
    return null;
  }

  const createXStructure = (size) => {
    return (
      <>
        {/* Diagonal walls forming X shape */}
        <mesh rotation={[0, Math.PI/4, 0]} position={[0, 4, 0]}>
          <planeGeometry args={[size*2, 8]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, -Math.PI/4, 0]} position={[0, 4, 0]}>
          <planeGeometry args={[size*2, 8]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>

        {/* Paintings arranged in X pattern */}
        {[-1, 1].map((multiplier) => (
          <group key={`x-arm-${multiplier}`}>
            {Array.from({ length: 4 }).map((_, i) => {
              const texture = textures[i + (multiplier === 1 ? 4 : 0)];
              const position = [
                multiplier * (i + 1) * 2,
                3,
                multiplier * (i + 1) * 2
              ];
              
              // Calculate aspect ratio and adjust dimensions
              const aspectRatio = texture.image.width / texture.image.height;
              const height = 1.5; // Base height
              const width = height * aspectRatio;
              
              return (
                <mesh
                  key={`x-painting-${i}-${multiplier}`}
                  position={position}
                  rotation={[0, Math.PI/4 * multiplier, 0]}
                >
                  <planeGeometry args={[width, height]} />
                  <meshStandardMaterial map={texture} />
                </mesh>
              );
            })}
          </group>
        ))}
      </>
    );
  };

  return (
    <>
      <Reflector
        resolution={reflectionProps.resolution}
        args={[40, 40]}
        mirror={reflectionProps.mirror}
        mixBlur={reflectionProps.mixBlur}
        mixStrength={reflectionProps.mixStrength}
        rotation={[-Math.PI / 2, 0, 0]}
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

      <group>
        {createXStructure(10)}
        {createXStructure(20)}
      </group>
    </>
  );
}

export default XGallery;