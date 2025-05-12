import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFolderPlus, FiCheck } from 'react-icons/fi';
import { useGallery } from '../contexts/GalleryContext';
import CreateCollectionModal from './CreateCollectionModal';
import { fetchCollections, addImagesToCollection } from '../services/api';
import toast from 'react-hot-toast';

export default function SelectionBar() {
  const { selectedImages, clearSelection, refreshCollections } = useGallery();
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (err) {
        console.error('Failed to load collections:', err);
        toast.error('Failed to load collections');
      }
    };
    loadCollections();
  }, []);

  const handleAddToExistingCollection = async () => {
    if (!selectedCollection) return;
    
    setLoading(true);
    const promise = addImagesToCollection(selectedCollection, selectedImages)
      .then(() => {
        clearSelection();
        setSelectedCollection('');
        refreshCollections();
      })
      .catch((err) => {
        console.error('Failed to add images to collection:', err);
        throw new Error('Failed to add images to collection');
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(promise, {
      loading: 'Adding images to collection...',
      success: 'Images added to collection',
      error: 'Failed to add images'
    });
  };

  const handleCollectionCreated = async (result) => {
    const promise = addImagesToCollection(result.collectionId, selectedImages)
      .then(() => {
        clearSelection();
        refreshCollections();
      })
      .catch((error) => {
        console.error('Failed to add images to collection:', error);
        throw new Error('Failed to add images to collection');
      });

    toast.promise(promise, {
      loading: 'Adding images to new collection...',
      success: 'Collection created and images added',
      error: 'Failed to add images to new collection'
    });
  };

  if (selectedImages.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedImages.length} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-dark"
                >
                  <option value="">Select Collection</option>
                  {collections.map((collection) => (
                    <option key={collection._id} value={collection._id}>
                      {collection.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddToExistingCollection}
                  disabled={!selectedCollection || loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-colors disabled:opacity-50"
                >
                  <FiCheck className="w-5 h-5" />
                  <span>Add</span>
                </button>

                <button
                  onClick={() => setShowCreateCollection(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-colors"
                >
                  <FiFolderPlus className="w-5 h-5" />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <CreateCollectionModal
        isOpen={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onSuccess={handleCollectionCreated}
      />
    </>
  );
}