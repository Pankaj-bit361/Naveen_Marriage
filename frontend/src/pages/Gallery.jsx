import { useState, useEffect, useCallback } from 'react';
import ImageGrid from '../components/ImageGrid';
import SelectionBar from '../components/SelectionBar';
import ImageModal from '../components/ImageModal';
import { motion } from 'framer-motion';
import { fetchImages } from '../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadImages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchImages(page, 100);
      const newImages = data.images.map(img => ({
        id: img._id,
        url: img.thumbnailUrl,
        fullUrl: img.imageUrl,
        title: img.filename
      }));
      
      setImages(prev => [...prev, ...newImages]);
      setHasMore(newImages.length === 100);
      setPage(p => p + 1);
    } catch (error) {
      setError('Failed to load images');
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (page === 1) {
      loadImages();
    }
  }, [page, loadImages]);

  const handleImageClick = useCallback((image) => {
    setSelectedImage({
      ...image,
      url: image.fullUrl
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}
      
      <ImageGrid 
        images={images} 
        loading={loading} 
        onImageClick={handleImageClick}
      />
      
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadImages}
            disabled={loading}
            className="px-6 py-3 bg-primary-dark text-white rounded-lg
              hover:bg-primary-dark/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      
      <SelectionBar />
      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </motion.div>
  );
}