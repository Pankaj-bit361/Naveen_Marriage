import { motion } from 'framer-motion';
import { useGallery } from '../contexts/GalleryContext';
import { FiCheck, FiImage, FiDownload } from 'react-icons/fi';

export default function ImageGrid({ images, loading, onImageClick }) {
  const { selectedImages, toggleImageSelection } = useGallery();

  if (loading && images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <motion.div
          key={image.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-square group"
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover rounded-lg cursor-pointer"
            loading="lazy"
            onClick={() => onImageClick(image)}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleImageSelection(image.id);
              }}
              className={`p-2 rounded-full transition-colors ${
                selectedImages.includes(image.id)
                  ? 'bg-primary-dark text-white'
                  : 'bg-black/50 text-white'
              }`}
            >
              {selectedImages.includes(image.id) ? (
                <FiCheck className="w-4 h-4" />
              ) : (
                <FiImage className="w-4 h-4" />
              )}
            </button>
            <a
              href={image.fullUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              title="Download image"
            >
              <FiDownload className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}