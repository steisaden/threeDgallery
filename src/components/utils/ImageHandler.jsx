// src/components/utils/ImageHandler.jsx
import React, { useState, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Create a solid color texture as fallback
const createFallbackTexture = (color = '#4444aa') => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  // Fill with color
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add a pattern to make it clear it's a fallback
  context.strokeStyle = '#ffffff';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width, canvas.height);
  context.moveTo(canvas.width, 0);
  context.lineTo(0, canvas.height);
  context.stroke();
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// Default fallback texture
const DEFAULT_FALLBACK = createFallbackTexture();

// Helper function to process an array of image URLs
export const useSafeTextures = (urls, fallbacks) => {
  const [textures, setTextures] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  
  useEffect(() => {
    // For each URL, create a texture loader with error handling
    const loadedTextures = [];
    let errorCount = 0;
    
    urls.forEach((url, index) => {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      
      loader.load(
        url,
        // Success callback
        (texture) => {
          loadedTextures[index] = texture;
          if (loadedTextures.filter(t => t).length === urls.length) {
            setTextures(loadedTextures);
            setLoaded(true);
          }
        },
        // Progress callback
        undefined,
        // Error callback
        (error) => {
          console.warn(`Error loading texture from ${url}:`, error);
          errorCount++;
          setHasErrors(true);
          
          // Use fallback texture
          const fallbackTexture = 
            (fallbacks && fallbacks[index]) || 
            createFallbackTexture(
              ['#4444aa', '#aa4444', '#44aa44', '#aaaa44'][index % 4]
            );
          
          loadedTextures[index] = fallbackTexture;
          
          if (loadedTextures.filter(t => t).length === urls.length) {
            setTextures(loadedTextures);
            setLoaded(true);
          }
        }
      );
    });
    
    return () => {
      // Cleanup
      textures.forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, [urls, fallbacks]);
  
  return { textures, loaded, hasErrors };
};

// Component for displaying a textured plane with fallback
export function TexturedPlane({ 
  url, 
  position, 
  rotation, 
  scale = [1, 1, 1],
  fallbackColor = '#4444aa'
}) {
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    
    loader.load(
      url,
      // Success callback
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      // Progress callback
      undefined,
      // Error callback
      (err) => {
        console.warn(`Error loading texture from ${url}:`, err);
        setError(true);
        setTexture(createFallbackTexture(fallbackColor));
      }
    );
    
    return () => {
      if (texture && texture !== DEFAULT_FALLBACK) {
        texture.dispose();
      }
    };
  }, [url, fallbackColor]);
  
  if (!texture) {
    return null;
  }
  
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} />
      
      {error && (
        <group position={[0, 0, 0.01]}>
          <mesh>
            <planeGeometry args={[0.5, 0.2]} />
            <meshBasicMaterial color="black" transparent opacity={0.7} />
          </mesh>
          <text
            position={[0, 0, 0.01]}
            color="white"
            fontSize={0.05}
            anchorX="center"
            anchorY="middle"
          >
            Image Error
          </text>
        </group>
      )}
    </mesh>
  );
}

export default { useSafeTextures, TexturedPlane, createFallbackTexture };