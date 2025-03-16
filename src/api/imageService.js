import { GALLERY_IMAGES } from './imageMetadata';

export const imageService = {
  // Fetch images by gallery type and position
  async fetchGalleryImages(galleryType, position) {
    try {
      const images = GALLERY_IMAGES[galleryType][position] || [];
      return images;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
  },

  // Fetch images by theme
  async fetchImagesByTheme(theme) {
    try {
      const allImages = [];
      Object.values(GALLERY_IMAGES).forEach(positions => {
        Object.values(positions).forEach(images => {
          images.forEach(image => {
            if (image.themes.includes(theme)) {
              allImages.push(image);
            }
          });
        });
      });
      return allImages;
    } catch (error) {
      console.error('Error fetching images by theme:', error);
      return [];
    }
  }
};