// src/components/AssetPreloader.jsx
import React, { useState, useEffect } from 'react';
import { AssetManager } from './utils/AssetManager';

const AssetPreloader = ({ onComplete, children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    // Start the preloading process
    const startTime = performance.now();
    
    // Create a simulated progress even if actual progress is unknown
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95; // Hold at 95% until actually complete
        }
        return prev + (Math.random() * 3); // Random increment between 0-3%
      });
    }, 100);
    
    // Actually preload all assets
    AssetManager.preloadTextures((success) => {
      clearInterval(progressInterval);
      setHasErrors(!success);
      setProgress(100);
      
      // Add a short delay for UX purposes
      const loadTime = performance.now() - startTime;
      const minLoadTime = 1000; // Minimum 1 second loading screen
      
      setTimeout(() => {
        setLoading(false);
        if (onComplete) onComplete(success);
      }, Math.max(0, minLoadTime - loadTime));
    });
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Loading Space Gallery
        </h1>
        
        <div style={{
          width: '80%',
          maxWidth: '500px',
          height: '20px',
          background: '#111',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: hasErrors ? '#e74c3c' : '#3498db',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <p style={{ color: '#aaa' }}>
          {hasErrors 
            ? 'Some assets failed to load, using fallbacks...' 
            : `Loading assets: ${Math.round(progress)}%`}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AssetPreloader;