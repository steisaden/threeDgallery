import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BoxGallery from './components/BoxGallery';
import CircleGallery from './components/CircleGallery';
import TriangleGallery from './components/TriangleGallery';
import XGallery from './components/XGallery';

function GalleryScene() {
  return <GalleryApp />;
}

function GalleryApp() {
  const [currentScene, setCurrentScene] = useState('box');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleSceneChange = (sceneId) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScene(sceneId);
        setTimeout(() => setIsTransitioning(false), 1000);
      }, 1000);
    }
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
        gap: '10px'
      }}>
        <button 
          onClick={() => handleSceneChange('box')}
          disabled={currentScene === 'box' || isTransitioning}
          style={{ padding: '8px 16px', background: currentScene === 'box' ? '#4CAF50' : '#ddd' }}
        >
          Box Gallery
        </button>
        <button 
          onClick={() => handleSceneChange('circle')}
          disabled={currentScene === 'circle' || isTransitioning}
          style={{ padding: '8px 16px', background: currentScene === 'circle' ? '#4CAF50' : '#ddd' }}
        >
          Circle Gallery
        </button>
        <button 
          onClick={() => handleSceneChange('triangle')}
          disabled={currentScene === 'triangle' || isTransitioning}
          style={{ padding: '8px 16px', background: currentScene === 'triangle' ? '#4CAF50' : '#ddd' }}
        >
          Triangle Gallery
        </button>
        <button 
          onClick={() => handleSceneChange('x')}
          disabled={currentScene === 'x' || isTransitioning}
          style={{ padding: '8px 16px', background: currentScene === 'x' ? '#4CAF50' : '#ddd' }}
        >
          X Gallery
        </button>
      </div>

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
      </div>

      {/* Canvas with transition effect */}
      <div style={{ 
        width: '100%', 
        height: '100%',
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 1s ease'
      }}>
        <Canvas
          camera={{ position: [0, 2, 15], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.2} />
          <directionalLight intensity={0.8} position={[5, 10, 5]} />

          <Suspense fallback={null}>
            {currentScene === 'box' && <BoxGallery />}
            {currentScene === 'circle' && <CircleGallery />}
            {currentScene === 'triangle' && <TriangleGallery />}
            {currentScene === 'x' && <XGallery />}
          </Suspense>

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
}

export default GalleryScene;