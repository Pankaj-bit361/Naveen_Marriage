import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTrash2, FiDownload } from 'react-icons/fi';
import ImageGrid from '../components/ImageGrid';
import ImageModal from '../components/ImageModal';
import { fetchCollectionById } from '../services/api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadCollection() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCollectionById(id);
        if (!data || !data.images) {
          throw new Error('Invalid collection data');
        }
        setCollection(data);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
        setError('Failed to load collection');
      } finally {
        setLoading(false);
      }
    }

    loadCollection();
  }, [id]);

  const downloadCollection = async () => {
    if (!collection?.images?.length || downloading) return;
    
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      await Promise.all(
        collection.images.map(async (image, index) => {
          const response = await fetch(image.fullUrl);
          const blob = await response.blob();
          const extension = image.title.split('.').pop();
          zip.file(`image-${index + 1}.${extension}`, blob);
        })
      );
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `Collection-${collection.id}.zip`);
    } catch (error) {
      console.error('Failed to download collection:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-[calc(100vh-200px)] bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/collections')}
          className="text-primary-dark hover:text-primary-dark/80"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  if (!collection?.images) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Collection not found</p>
        <button
          onClick={() => navigate('/collections')}
          className="text-primary-dark hover:text-primary-dark/80"
        >
          Return to Collections
        </button>
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={downloadCollection}
            disabled={downloading}
            className="text-primary-dark hover:text-primary-dark/80 transition-colors disabled:opacity-50"
            title="Download collection"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <button
            onClick={() => {/* Handle delete */}}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Delete collection"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ImageGrid 
        images={collection.images}
        loading={false}
        onImageClick={setSelectedImage}
      />

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </motion.div>
  );
}