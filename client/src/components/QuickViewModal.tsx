import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dress } from '../../../shared/src/types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  dress: Dress | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ dress, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!dress) return null;

  const images = dress.images && dress.images.length > 0
    ? dress.images.map(img => img.image_url)
    : dress.primary_image_url
    ? [dress.primary_image_url]
    : [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(dress);
    onClose();
  };

  const handleViewDetails = () => {
    const productSlug = dress.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/product/${productSlug}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bridal-charcoal-900 bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2 h-full max-h-[90vh]">
            {/* Left: Image Gallery */}
            <div className="relative bg-bridal-cream h-[50vh] md:h-auto">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={dress.name}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white transition-colors shadow-lg"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-bridal-charcoal-500" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white transition-colors shadow-lg"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-bridal-charcoal-500" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-bridal-taupe">
                  <p className="text-bridal-charcoal-400">No image available</p>
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="relative flex flex-col h-[50vh] md:h-auto overflow-y-auto custom-scrollbar">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-bridal-taupe transition-colors z-10"
                aria-label="Close quick view"
              >
                <X className="w-6 h-6 text-bridal-charcoal-500" />
              </button>

              <div className="p-8 md:p-12 flex-1 flex flex-col">
                {/* New Arrival Badge */}
                {dress.is_new_arrival && (
                  <span className="inline-block px-4 py-1 bg-bridal-clay-500 text-white text-xs font-sans font-medium tracking-widest uppercase mb-4 self-start">
                    New Arrival
                  </span>
                )}

                {/* Product Name */}
                <h2 className="text-3xl md:text-4xl font-display text-bridal-charcoal-500 mb-4">
                  {dress.name}
                </h2>

                {/* Price */}
                <p className="text-2xl font-sans text-bridal-clay-600 font-medium mb-6">
                  {dress.price}
                </p>

                {/* Description */}
                {dress.description && (
                  <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed mb-8">
                    {dress.description}
                  </p>
                )}

                {/* Features */}
                {dress.features && dress.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-3">
                      Features
                    </h3>
                    <ul className="space-y-2">
                      {dress.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-bridal-charcoal-400">
                          <span className="text-bridal-clay-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary"
                  >
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleViewDetails}
                    className="w-full btn-secondary"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
