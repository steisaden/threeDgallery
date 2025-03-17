// src/components/utils/AssetManager.js
import * as THREE from 'three';

// Create a registry of all assets
const assetRegistry = {
  // List of available images - manually curated
  availableImages: [
    'wall.jpg',
    'wos.jpg',
    'tunnelcanals.jpg',
    'tryangles.jpg',
    'painters.jpg',
    'lido.jpg',
    'flower.jpg',
    'churchwiderview.jpg'
    // Add any other images that definitely exist
  ],
  
  // Storage for preloaded textures
  loadedTextures: {},
  
  // Fallback textures
  fallbackTextures: {}
};

// Function to create a fallback texture with a specific color
const createFallbackTexture = (name, color = '#4444aa') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Fill with color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add a pattern to make it clear it's a fallback
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  
  // Add filename text
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText(`Missing: ${name}`, canvas.width/2, canvas.height/2 - 12);
  ctx.font = '18px Arial';
  ctx.fillText('Image Not Found', canvas.width/2, canvas.height/2 + 20);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// Get a safe texture - either preloaded or fallback
const getSafeTexture = (filename) => {
  // Check if we already have this texture
  if (assetRegistry.loadedTextures[filename]) {
    return assetRegistry.loadedTextures[filename];
  }
  
  // Check if we have a fallback for this specific file
  if (assetRegistry.fallbackTextures[filename]) {
    return assetRegistry.fallbackTextures[filename];
  }
  
  // Create a new fallback
  const colors = ['#4444aa', '#aa4444', '#44aa44', '#aaaa44'];
  const colorIndex = filename.length % colors.length;
  const fallback = createFallbackTexture(filename, colors[colorIndex]);
  assetRegistry.fallbackTextures[filename] = fallback;
  
  return fallback;
};

// Preload all available textures
const preloadTextures = (callback) => {
  const loader = new THREE.TextureLoader();
  let loadedCount = 0;
  const totalToLoad = assetRegistry.availableImages.length;
  
  console.log(`Preloading ${totalToLoad} textures...`);
  
  assetRegistry.availableImages.forEach(filename => {
    const url = `./assets/imgs/${filename}`;
    loader.load(
      url,
      // Success
      (texture) => {
        assetRegistry.loadedTextures[filename] = texture;
        loadedCount++;
        
        if (loadedCount === totalToLoad) {
          console.log('All textures preloaded successfully');
          if (callback) callback(true);
        }
      },
      // Progress
      undefined,
      // Error
      (error) => {
        console.warn(`Failed to preload texture ${filename}:`, error);
        
        // Create a fallback
        const fallback = createFallbackTexture(filename);
        assetRegistry.fallbackTextures[filename] = fallback;
        
        loadedCount++;
        if (loadedCount === totalToLoad) {
          console.log('Texture preloading completed with some errors');
          if (callback) callback(false);
        }
      }
    );
  });
};

// Get textures safely for a gallery
const getGalleryTextures = (filenames) => {
  return filenames.map(filename => {
    // Strip the path if it exists
    const cleanFilename = filename.split('/').pop();
    return getSafeTexture(cleanFilename);
  });
};

// Get a set of sample textures for a gallery
const getSampleTexturesForGallery = (count = 8) => {
  // Create an array of available images up to the requested count
  const textures = [];
  const availableCount = Math.min(count, assetRegistry.availableImages.length);
  
  for (let i = 0; i < availableCount; i++) {
    const filename = assetRegistry.availableImages[i];
    textures.push(getSafeTexture(filename));
  }
  
  // If we need more textures than are available, add fallbacks
  if (count > availableCount) {
    for (let i = availableCount; i < count; i++) {
      const placeholderName = `placeholder-${i+1}.jpg`;
      
      // Create a unique fallback for each position
      if (!assetRegistry.fallbackTextures[placeholderName]) {
        const colors = ['#4444aa', '#aa4444', '#44aa44', '#aaaa44'];
        const fallback = createFallbackTexture(
          placeholderName, 
          colors[i % colors.length]
        );
        assetRegistry.fallbackTextures[placeholderName] = fallback;
      }
      
      textures.push(assetRegistry.fallbackTextures[placeholderName]);
    }
  }
  
  return textures;
};

// Cleanup all loaded textures (call during component unmount or app shutdown)
const cleanupTextures = () => {
  // Dispose loaded textures
  Object.values(assetRegistry.loadedTextures).forEach(texture => {
    if (texture && texture.dispose) texture.dispose();
  });
  
  // Dispose fallback textures
  Object.values(assetRegistry.fallbackTextures).forEach(texture => {
    if (texture && texture.dispose) texture.dispose();
  });
  
  // Clear the registry
  assetRegistry.loadedTextures = {};
  assetRegistry.fallbackTextures = {};
  
  console.log('All textures disposed');
};

// Export the asset manager functions
export const AssetManager = {
  preloadTextures,
  getSafeTexture,
  getGalleryTextures,
  getSampleTexturesForGallery,
  cleanupTextures,
  createFallbackTexture
};

export default AssetManager;