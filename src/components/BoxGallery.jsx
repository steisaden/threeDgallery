import React from 'react';
import { Html, Reflector } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

function BoxGallery() {
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
    color: 'blue',
    metalness: 0.5,
    roughness: 0.1
  };

  // Load all textures at once using useLoader
  const textures = useLoader(TextureLoader, sampleImages);

  // Add loading state check
  if (!textures || textures.some(texture => !texture)) {
    return <Html center><div style={{ color: 'white' }}>Loading textures...</div></Html>;
  }

  return (
    <>
      <Reflector
        resolution={reflectionProps.resolution}
        args={[80, 80]}
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

      {/* Inner Box Structure */}
      <group>
        {/* Inner Box Walls */}
        <mesh position={[5, 4, -35]}>
          <planeGeometry args={[60, 8]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>

        {/* Paintings */}
        {textures.map((texture, index) => {
          const aspectRatio = texture.image.width / texture.image.height;
          const height = 4;
          const width = height * aspectRatio;

          return (
            <mesh
              key={`painting-${index}`}
              position={[0, 4, -index * 5]}
              rotation={[0, 0, 0]}
            >
              <planeGeometry args={[width, height]} />
              <meshStandardMaterial map={texture} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default BoxGallery;