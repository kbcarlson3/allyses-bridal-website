import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Phone, ChevronRight, Check, ZoomIn, ShoppingCart } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import ImageLightbox from '../../components/ImageLightbox';
import type { Dress, ApiResponse, PaginatedResponse } from '@shared/types';

export default function ProductPage() {
  const { productName } = useParams();
  const [dress, setDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadDress();
  }, [productName]);

  const slugify = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const loadDress = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<PaginatedResponse<Dress>>>('/dresses?per_page=100');

      if (response.data.success && response.data.data) {
        const allDresses = response.data.data.data;
        const foundDress = allDresses.find(d => slugify(d.name) === productName);

        if (foundDress) {
          setDress(foundDress);
          setSelectedImageIndex(0);
        } else {
          setError('Dress not found');
        }
      }
    } catch (err) {
      console.error('Error loading dress:', err);
      setError('Failed to load dress details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bridal-ivory">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-bridal-clay-200 border-t-bridal-clay-500 mx-auto mb-4"></div>
          <p className="text-bridal-charcoal-400 font-sans">Loading dress details...</p>
        </div>
      </div>
    );
  }

  if (error || !dress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bridal-ivory px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl md:text-4xl font-display text-bridal-charcoal-500 mb-4">Dress Not Found</h1>
          <p className="text-bridal-charcoal-400 font-sans mb-8">
            {error || 'We could not find the dress you are looking for.'}
          </p>
          <Link to="/shop" className="btn-primary inline-flex">
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = dress.images && dress.images.length > 0
    ? [...dress.images].sort((a, b) => a.display_order - b.display_order).map(img => `/uploads/${img.image_path}`)
    : dress.primary_image
      ? [`/uploads/${dress.primary_image.image_path}`]
      : [];

  const handleAddToCart = () => {
    addToCart(dress);
  };

  return (
    <div className="bg-bridal-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-bridal-taupe">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <nav className="flex items-center text-sm font-sans">
            <Link to="/" className="text-bridal-charcoal-400 hover:text-bridal-clay-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-bridal-charcoal-300" />
            <Link to="/shop" className="text-bridal-charcoal-400 hover:text-bridal-clay-600 transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-bridal-charcoal-300" />
            <span className="text-bridal-charcoal-500 font-medium">{dress.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-[3/4] bg-bridal-cream overflow-hidden">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={dress.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bridal-charcoal-300">
                    <span className="font-sans">No image available</span>
                  </div>
                )}
              </div>

              {/* Zoom Icon */}
              {allImages.length > 0 && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="View full screen"
                >
                  <ZoomIn className="w-5 h-5 text-bridal-charcoal-500" />
                </button>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-[3/4] bg-bridal-cream overflow-hidden transition-all ${
                      index === selectedImageIndex
                        ? 'ring-2 ring-bridal-clay-500 shadow-md'
                        : 'hover:ring-2 hover:ring-bridal-taupe'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${dress.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="space-y-8">
              {/* Title & Price */}
              <div>
                {dress.is_new_arrival && (
                  <span className="inline-block bg-bridal-clay-500 text-white px-4 py-1 text-xs font-sans font-medium tracking-widest uppercase mb-4">
                    New Arrival
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-display font-light text-bridal-charcoal-500 mb-6 leading-tight">
                  {dress.name}
                </h1>
                <p className="text-3xl font-sans text-bridal-clay-600 font-medium">
                  {dress.price}
                </p>
              </div>

              {/* Description */}
              {dress.description && (
                <div className="border-t border-bridal-taupe pt-6">
                  <h2 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-3">
                    Description
                  </h2>
                  <p className="text-bridal-charcoal-400 font-sans leading-relaxed">
                    {dress.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {dress.features && dress.features.length > 0 && (
                <div className="border-t border-bridal-taupe pt-6">
                  <h2 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-4">
                    Features
                  </h2>
                  <ul className="space-y-3">
                    {dress.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-bridal-clay-500 flex-shrink-0 mt-0.5" />
                        <span className="text-bridal-charcoal-400 font-sans text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-bridal-taupe pt-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </span>
                </button>
                <Link
                  to="/schedule-appointment"
                  className="w-full btn-secondary block text-center"
                >
                  Schedule Try-On Appointment
                </Link>
                <a
                  href="tel:8012240059"
                  className="w-full btn-outline-clay flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Call for Availability
                </a>
              </div>

              {/* Additional Info */}
              <div className="border-t border-bridal-taupe pt-6">
                <div className="bg-bridal-cream p-6 space-y-3">
                  <p className="text-sm text-bridal-charcoal-400 font-sans flex items-start gap-2">
                    <Check className="h-4 w-4 text-bridal-clay-500 flex-shrink-0 mt-0.5" />
                    <span><strong>In-House Alterations:</strong> Expert tailoring for the perfect fit</span>
                  </p>
                  <p className="text-sm text-bridal-charcoal-400 font-sans flex items-start gap-2">
                    <Check className="h-4 w-4 text-bridal-clay-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Appointment Required:</strong> Call or book online to try on</span>
                  </p>
                  <p className="text-sm text-bridal-charcoal-400 font-sans flex items-start gap-2">
                    <Check className="h-4 w-4 text-bridal-clay-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Personalized Service:</strong> One-on-one consultation included</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-20 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center text-bridal-charcoal-500 hover:text-bridal-clay-600 font-sans font-medium transition-colors link-underline"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            <span className="ml-2">Continue Shopping</span>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-bridal-charcoal-500 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-6">
            Fall in Love With Your Dream Dress
          </h2>
          <p className="text-lg text-white/80 font-sans mb-10 max-w-2xl mx-auto">
            Visit our boutique to experience the beauty and elegance of our collection in person.
            Our expert team is ready to help you find the perfect dress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link
              to="/schedule-appointment"
              className="btn-primary bg-white text-bridal-charcoal-500 hover:bg-bridal-clay-500 hover:text-white flex-1"
            >
              <span>Schedule Appointment</span>
            </Link>
            <a
              href="tel:8012240059"
              className="btn-secondary border-white text-white hover:bg-white hover:text-bridal-charcoal-500 flex-1 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              <span>(801) 224-0059</span>
            </a>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          initialIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
