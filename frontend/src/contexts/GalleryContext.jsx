import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const toggleImageSelection = useCallback((imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      }
      if (prev.length >= 20) {
        toast.error('Maximum 20 images can be selected');
        return prev;
      }
      return [...prev, imageId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedImages([]);
  }, []);

  const updateCollections = useCallback((newCollections) => {
    setCollections(newCollections);
    setLastFetchTime(Date.now());
  }, []);

  const refreshCollections = useCallback(async () => {
    setLastFetchTime(null);
  }, []);

  return (
    <GalleryContext.Provider value={{
      selectedImages,
      toggleImageSelection,
      clearSelection,
      collections,
      updateCollections,
      collectionsLoading,
      setCollectionsLoading,
      lastFetchTime,
      refreshCollections
    }}>
      {children}
    </GalleryContext.Provider>
  );
}

export const useGallery = () => useContext(GalleryContext);