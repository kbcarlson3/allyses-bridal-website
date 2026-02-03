import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="fixed inset-0 bg-bridal-charcoal-900 z-50 flex items-center justify-center animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 transition-colors z-20"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Zoom Toggle */}
      <button
        onClick={toggleZoom}
        className="absolute top-4 right-20 md:top-8 md:right-24 p-3 bg-white/10 hover:bg-white/20 transition-colors z-20"
        aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
      >
        {isZoomed ? (
          <ZoomOut className="w-6 h-6 text-white" />
        ) : (
          <ZoomIn className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm z-20">
        <span className="text-white font-sans text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
        <div className={`relative transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className={`max-h-[90vh] max-w-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={toggleZoom}
          />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 max-w-2xl overflow-x-auto px-4">
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden transition-all ${
                  idx === currentIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
