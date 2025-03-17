// src/components/SpaceNavigationUI.jsx
import React from 'react';

const SpaceNavigationUI = ({ 
  currentGallery,
  onNavigate,
  onToggleSpaceMode,
  spaceMode,
  isTransitioning
}) => {
  return (
    <>
      {/* Main Navigation Panel */}
      <div className="space-nav-panel">
        <button
          className={`nav-button ${currentGallery === 'overview' ? 'active' : 'inactive'}`}
          onClick={() => onNavigate('overview')}
          disabled={isTransitioning}
        >
          Overview
        </button>
        
        <button
          className={`nav-button ${currentGallery === 'box' ? 'active' : 'inactive'}`}
          onClick={() => onNavigate('box')}
          disabled={isTransitioning}
        >
          Box Gallery
        </button>
        
        <button
          className={`nav-button ${currentGallery === 'circle' ? 'active' : 'inactive'}`}
          onClick={() => onNavigate('circle')}
          disabled={isTransitioning}
        >
          Circle Gallery
        </button>
        
        <button
          className={`nav-button ${currentGallery === 'triangle' ? 'active' : 'inactive'}`}
          onClick={() => onNavigate('triangle')}
          disabled={isTransitioning}
        >
          Triangle Gallery
        </button>
        
        <button
          className={`nav-button ${currentGallery === 'x' ? 'active' : 'inactive'}`}
          onClick={() => onNavigate('x')}
          disabled={isTransitioning}
        >
          X Gallery
        </button>
      </div>
      
      {/* Space Mode Toggle */}
      <div className="space-toggle">
        <button
          className={`nav-button ${spaceMode ? 'active' : 'inactive'}`}
          onClick={onToggleSpaceMode}
          disabled={isTransitioning}
        >
          {spaceMode ? 'Exit Space Mode' : 'Enter Space Mode'}
        </button>
      </div>
      
      {/* Status Display */}
      {isTransitioning && (
        <div className="space-status">
          <style>
            {`
              @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
              }
            `}
          </style>
          Traveling through space...
        </div>
      )}
    </>
  );
};

export default SpaceNavigationUI;