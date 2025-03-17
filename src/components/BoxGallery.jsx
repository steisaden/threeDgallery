// src/components/BoxGallery.jsx
import React, { useEffect } from 'react';
import { Reflector } from '@react-three/drei';
import * as THREE from 'three';
import { AssetManager } from './utils/AssetManager';

function BoxGallery() {
  // Use preloaded textures from AssetManager
  const textures = AssetManager.getSampleTexturesForGallery(8);
  
  const reflectionProps = {
    resolution: 512,
    mirror: 1,
    mixBlur: 1,
    mixStrength: 1,
    color: 'blue',
    metalness: 0.5,
    roughness: 0.1
  };

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      // No need to dispose here, AssetManager handles this
    };
  }, []);

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
          // Calculate aspect ratio for the texture
          const aspectRatio = 
            texture.image instanceof HTMLCanvasElement ? 1 :
            texture.image ? texture.image.width / texture.image.height : 1;
          
          const height = 4;
          const width = height * aspectRatio;

          return (
            <group key={`painting-${index}`} position={[0, 4, -index * 5]}>
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
    </>
  );
}

export default BoxGallery;