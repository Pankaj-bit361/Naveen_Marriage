import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder } from 'react-icons/fi';
import { fetchCollections } from '../services/api';
import { useGallery } from '../contexts/GalleryContext';
import toast from 'react-hot-toast';

export default function Collections() {
  const { 
    collections, 
    updateCollections, 
    collectionsLoading, 
    setCollectionsLoading,
    lastFetchTime 
  } = useGallery();
  const [error, setError] = useState(null);

  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    async function loadCollections() {
      // Check if we have recent data
      if (
        collections.length > 0 && 
        lastFetchTime && 
        Date.now() - lastFetchTime < CACHE_DURATION
      ) {
        return;
      }

      if (collectionsLoading) return;

      setCollectionsLoading(true);
      setError(null);

      try {
        const data = await fetchCollections();
        const formattedCollections = data.map(collection => ({
          id: collection._id,
          name: collection.name,
          imageCount: collection.images.length,
          previewImage: collection.images[0]?.imageUrl
        }));
        updateCollections(formattedCollections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
        setError('Failed to load collections');
        toast.error('Failed to load collections');
      } finally {
        setCollectionsLoading(false);
      }
    }

    loadCollections();
  }, [collections.length, lastFetchTime, collectionsLoading, updateCollections, setCollectionsLoading]);

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (collectionsLoading && collections.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Your Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map(collection => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="block group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {collection.previewImage ? (
                <img
                  src={collection.previewImage}
                  alt={collection.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FiFolder className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-primary-dark transition-colors">
                  {collection.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {collection.imageCount} images
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}