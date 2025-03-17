// src/GalleryScene.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Stats } from '@react-three/drei';
import BoxGallery from './components/BoxGallery';
import CircleGallery from './components/CircleGallery';
import TriangleGallery from './components/TriangleGallery';
import XGallery from './components/XGallery';
import GalaxyEnvironment from './components/GalaxyEnvironment';
import SpaceCameraControls from './components/SpaceCameraControls';

function GalleryScene() {
  return <GalleryApp />;
}

function GalleryApp() {
  const [currentScene, setCurrentScene] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spaceMode, setSpaceMode] = useState(true); // Start in space mode
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(true); // Enable debug initially to see performance
  
  // Define gallery positions in 3D space
  const galleryPositions = {
    'box': [0, 0, 0],
    'circle': [150, 0, 150],
    'triangle': [-150, 0, 150],
    'x': [0, 0, -200]
  };
  
  // Handle navigation between galleries
  const handleNavigate = (galleryId) => {
    if (!isTransitioning) {
      console.log(`Navigating to ${galleryId}`);
      setIsTransitioning(true);
      setControlsEnabled(false);
      setCurrentScene(galleryId);
      
      // Re-enable controls after transition
      setTimeout(() => {
        setIsTransitioning(false);
        setControlsEnabled(true);
      }, 2500); // Give animation time to complete
    }
  };
  
  // Toggle space/galaxy mode
  const toggleSpaceMode = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSpaceMode(!spaceMode);
        setCurrentScene('overview');
        setTimeout(() => setIsTransitioning(false), 1000);
      }, 1000);
    }
  };
  
  // Toggle debug mode
  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Navigation UI */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleNavigate('overview')}
            disabled={currentScene === 'overview' || isTransitioning}
            style={{ 
              padding: '8px 16px', 
              background: currentScene === 'overview' ? '#7B3FF2' : '#ddd',
              color: currentScene === 'overview' ? 'white' : 'black'
            }}
          >
            Overview
          </button>
          <button 
            onClick={() => handleNavigate('box')}
            disabled={currentScene === 'box' || isTransitioning}
            style={{ 
              padding: '8px 16px', 
              background: currentScene === 'box' ? '#7B3FF2' : '#ddd',
              color: currentScene === 'box' ? 'white' : 'black'
            }}
          >
            Box Gallery
          </button>
          <button 
            onClick={() => handleNavigate('circle')}
            disabled={currentScene === 'circle' || isTransitioning}
            style={{ 
              padding: '8px 16px', 
              background: currentScene === 'circle' ? '#7B3FF2' : '#ddd',
              color: currentScene === 'circle' ? 'white' : 'black'
            }}
          >
            Circle Gallery
          </button>
          <button 
            onClick={() => handleNavigate('triangle')}
            disabled={currentScene === 'triangle' || isTransitioning}
            style={{ 
              padding: '8px 16px', 
              background: currentScene === 'triangle' ? '#7B3FF2' : '#ddd',
              color: currentScene === 'triangle' ? 'white' : 'black'
            }}
          >
            Triangle Gallery
          </button>
          <button 
            onClick={() => handleNavigate('x')}
            disabled={currentScene === 'x' || isTransitioning}
            style={{ 
              padding: '8px 16px', 
              background: currentScene === 'x' ? '#7B3FF2' : '#ddd',
              color: currentScene === 'x' ? 'white' : 'black'
            }}
          >
            X Gallery
          </button>
        </div>
        
        {/* Toggle Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setControlsEnabled(!controlsEnabled)}
            style={{ 
              padding: '8px 16px', 
              background: controlsEnabled ? '#4CAF50' : '#f44336',
              color: 'white'
            }}
          >
            {controlsEnabled ? 'Disable Controls' : 'Enable Controls'}
          </button>
          
          <button 
            onClick={toggleDebug}
            style={{ 
              padding: '8px 16px', 
              background: debugMode ? '#ff9800' : '#ddd',
              color: debugMode ? 'white' : 'black'
            }}
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.97)',
        color: 'white',
        borderRadius: '5px'
      }}>
        {isTransitioning ? 'Transitioning...' : `Current: ${currentScene} gallery`}
        <br />
        Controls: {controlsEnabled ? 'Enabled' : 'Disabled'}
      </div>

      {/* Canvas with transition effect */}
      <div style={{ 
        width: '100%', 
        height: '100%',
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'opacity 1s ease'
      }}>
        <Canvas style={{ width: '100%', height: '100%', background: 'black' }}>
          {/* Debug Stats */}
          {debugMode && <Stats />}
          
          <ambientLight intensity={0.2} />
          <directionalLight intensity={0.8} position={[5, 10, 5]} />

          <Suspense fallback={
            <Html center>
              <div style={{ 
                color: 'white', 
                background: 'rgba(0,0,0,0.7)', 
                padding: '20px', 
                borderRadius: '10px' 
              }}>
                Loading gallery...
              </div>
            </Html>
          }>
            {/* Galaxy Environment */}
            <GalaxyEnvironment>
              {/* Galleries positioned in space */}
              <group position={galleryPositions['box']}>
                <BoxGallery />
                {currentScene === 'box' && (
                  <Html center position={[0, 10, 0]}>
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      borderRadius: '5px',
                      fontWeight: 'bold'
                    }}>
                      Box Gallery
                    </div>
                  </Html>
                )}
              </group>
              
              <group position={galleryPositions['circle']}>
                <CircleGallery />
                {currentScene === 'circle' && (
                  <Html center position={[0, 10, 0]}>
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      borderRadius: '5px',
                      fontWeight: 'bold'
                    }}>
                      Circle Gallery
                    </div>
                  </Html>
                )}
              </group>
              
              <group position={galleryPositions['triangle']}>
                <TriangleGallery />
                {currentScene === 'triangle' && (
                  <Html center position={[0, 10, 0]}>
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      borderRadius: '5px',
                      fontWeight: 'bold'
                    }}>
                      Triangle Gallery
                    </div>
                  </Html>
                )}
              </group>
              
              <group position={galleryPositions['x']}>
                <XGallery />
                {currentScene === 'x' && (
                  <Html center position={[0, 10, 0]}>
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      borderRadius: '5px',
                      fontWeight: 'bold'
                    }}>
                      X Gallery
                    </div>
                  </Html>
                )}
              </group>
            </GalaxyEnvironment>
            
            {/* Camera controls that work correctly */}
            <SpaceCameraControls
              target={currentScene}
              galleryPositions={galleryPositions}
              enabled={controlsEnabled}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default GalleryScene;