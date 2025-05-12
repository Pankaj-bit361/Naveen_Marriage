import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShare2 } from 'react-icons/fi';

export default function ImageModal({ image, onClose }) {
  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.title || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          url: image.fullUrl
        });
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-w-5xl max-h-[90vh] w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            <button
              onClick={handleShare}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              title="Share image"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              title="Download image"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              title="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}