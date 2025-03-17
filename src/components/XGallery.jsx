// src/components/XGallery.jsx
import React from 'react';
import { Reflector } from '@react-three/drei';
import * as THREE from 'three';
import { AssetManager } from './utils/AssetManager';

function XGallery() {
  // Use preloaded textures from AssetManager
  const textures = AssetManager.getSampleTexturesForGallery(8);
  
  const reflectionProps = {
    resolution: 512,
    mirror: 0.9,
    mixBlur: 0.7,
    mixStrength: 0.8,
    color: '#FFC67D',
    metalness: 0.6,
    roughness: 0.2
  };

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
              const textureIndex = i + (multiplier === 1 ? 4 : 0);
              const texture = textures[textureIndex];
              
              if (!texture) return null;
              
              const position = [
                multiplier * (i + 1) * 2,
                3,
                multiplier * (i + 1) * 2
              ];
              
              // Calculate aspect ratio for the texture
              const aspectRatio = 
                texture.image instanceof HTMLCanvasElement ? 1 :
                texture.image ? texture.image.width / texture.image.height : 1;
                
              const height = 1.5; // Base height
              const width = height * aspectRatio;
              
              return (
                <group
                  key={`x-painting-${i}-${multiplier}`}
                  position={position}
                  rotation={[0, Math.PI/4 * multiplier, 0]}
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