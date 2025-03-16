// API Configuration for Gallery Image Management

export const API_CONFIG = {
  // Base URL for API endpoints
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  
  // Endpoints
  endpoints: {
    images: '/api/images',
    themes: '/api/themes',
    galleries: '/api/galleries'
  },
  
  // Gallery Types
  galleryTypes: {
    BOX: 'box',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    X: 'x'
  },
  
  // Image Positions
  positions: {
    INNER: 'inner',
    OUTER: 'outer'
  },
  
  // Default fetch options
  defaultOptions: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// Image metadata structure
export const IMAGE_METADATA = {
  url: '',
  title: '',
  description: '',
  themes: [],
  galleryType: '',
  position: '',
  dimensions: {
    width: 0,
    height: 0
  },
  dateAdded: '',
  lastModified: ''
};