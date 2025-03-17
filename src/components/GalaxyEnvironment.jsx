// src/components/GalaxyEnvironment.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyEnvironment({ children }) {
  const galaxyRef = useRef();
  
  // Create galaxy particles
  const particleCount = 3000; // Increased for better density
  const particles = React.useMemo(() => {
    const temp = [];
    
    // Create 3 different types of star distributions
    
    // 1. Spiral galaxy stars (60% of stars)
    for (let i = 0; i < particleCount * 0.6; i++) {
      // Calculate radius and angle for spiral galaxy
      const radius = Math.random() * 120 + 50; // Larger radius to place particles outside the galleries
      const spinAngle = radius * 0.008;
      const branchAngle = (i % 4) * Math.PI * 2 / 4; // 4 spiral arms
      
      // Position on the spiral
      const x = radius * Math.cos(spinAngle + branchAngle);
      const y = (Math.random() - 0.5) * 15; // Thinner galactic plane
      const z = radius * Math.sin(spinAngle + branchAngle);
      
      // Add some randomness within the arm
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 15
      );
      
      // Final position with offset
      const position = new THREE.Vector3(x, y, z).add(randomOffset);
      
      // More realistic star color distribution
      const colorOptions = [
        new THREE.Color(0x4D7EFF), // Blue (rare, hot stars)
        new THREE.Color(0xA2B9FF), // Blue-white
        new THREE.Color(0xFFFFFF), // White
        new THREE.Color(0xFFF4D2), // Yellow-white (common)
        new THREE.Color(0xFFD2A1), // Yellow
        new THREE.Color(0xFFAA33), // Orange (less common)
        new THREE.Color(0xFF6C3B)  // Red (rare)
      ];
      
      // Weight distribution to match real star distribution
      const colorWeights = [0.05, 0.1, 0.2, 0.4, 0.15, 0.07, 0.03];
      const rand = Math.random();
      let colorIndex = 0;
      let cumulativeWeight = 0;
      
      for (let j = 0; j < colorWeights.length; j++) {
        cumulativeWeight += colorWeights[j];
        if (rand <= cumulativeWeight) {
          colorIndex = j;
          break;
        }
      }
      
      const color = colorOptions[colorIndex];
      const size = Math.random() * 0.4 + 0.1;
      
      temp.push({ position, color, size });
    }
    
    // 2. Random background stars (30% of stars)
    for (let i = 0; i < particleCount * 0.3; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 250 + 150; // Far background
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const position = new THREE.Vector3(x, y, z);
      const color = new THREE.Color(0xFFFFFF); // White
      const size = Math.random() * 0.3 + 0.1;
      
      temp.push({ position, color, size });
    }
    
    // 3. Nearby bright stars (10% of stars)
    for (let i = 0; i < particleCount * 0.1; i++) {
      // Create stars more centered around gallery areas
      const theta = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 80;
      
      const x = radius * Math.cos(theta);
      const y = (Math.random() - 0.5) * 40;
      const z = radius * Math.sin(theta);
      
      const position = new THREE.Vector3(x, y, z);
      
      // Bright stars tend toward blue/white
      const colorOptions = [
        new THREE.Color(0x4D7EFF), // Blue
        new THREE.Color(0xA2B9FF), // Blue-white
        new THREE.Color(0xFFFFFF), // White
        new THREE.Color(0xFFF4D2)  // Yellow-white
      ];
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      // Larger for foreground stars
      const size = Math.random() * 0.7 + 0.3;
      
      temp.push({ position, color, size });
    }
    
    return temp;
  }, []);
  
  // Add subtle rotation to the galaxy
  useFrame(() => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.0001;
    }
  });
  
  return (
    <group ref={galaxyRef}>
      {/* Base layer of stars */}
      <Stars 
        radius={200} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Custom galaxy particles */}
      {particles.map((particle, i) => (
        <mesh key={`star-${i}`} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial 
            color={particle.color} 
            toneMapped={false}
          />
        </mesh>
      ))}
      
      {/* Nebula effects */}
      <Nebula position={[100, 0, -80]} color="#4422bb" scale={60} />
      <Nebula position={[-120, 30, -50]} color="#dd2244" scale={80} />
      
      {/* Pass through any children (galleries) */}
      {children}
    </group>
  );
}

// Nebula cloud effect
function Nebula({ position, color, scale = 40 }) {
  const nebulaRef = useRef();
  
  useFrame(() => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.0002;
      nebulaRef.current.rotation.z += 0.0001;
    }
  });
  
  return (
    <mesh ref={nebulaRef} position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent={true}
        opacity={0.15}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default GalaxyEnvironment;