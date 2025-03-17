// src/App.js
import React, { useState } from 'react';
import GalleryScene from './GalleryScene';
import AssetPreloader from './components/AssetPreloader';
import { AssetManager } from './components/utils/AssetManager';

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  // Handle preloader completion
  const handlePreloaderComplete = (success) => {
    setAssetsLoaded(true);
    setLoadingStatus(success ? 'All assets loaded successfully' : 'Some assets failed to load, using fallbacks');
  };
  
  // Cleanup when component unmounts
  React.useEffect(() => {
    return () => {
      AssetManager.cleanupTextures();
    };
  }, []);

  return (
    <AssetPreloader onComplete={handlePreloaderComplete}>
      <GalleryScene />
      
      {/* Optional debug info */}
      {loadingStatus && (
        <div style={{
          position: 'fixed', 
          bottom: '10px', 
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          {loadingStatus}
        </div>
      )}
    </AssetPreloader>
  );
}

export default App;