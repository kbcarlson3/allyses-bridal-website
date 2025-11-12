import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Phone, ChevronRight, Check } from 'lucide-react';
import api from '../../services/api';
import type { Dress, ApiResponse, PaginatedResponse } from '@shared/types';

export default function ProductPage() {
  const { productName } = useParams();
  const [dress, setDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadDress();
  }, [productName]);

  const slugify = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const loadDress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dresses and find the one with matching name
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bridal-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dress details...</p>
        </div>
      </div>
    );
  }

  if (error || !dress) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Dress Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || 'We could not find the dress you are looking for.'}
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const allImages = dress.images && dress.images.length > 0
    ? [...dress.images].sort((a, b) => a.display_order - b.display_order)
    : dress.primary_image
      ? [dress.primary_image]
      : [];

  const selectedImage = allImages[selectedImageIndex];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-bridal-gold-500">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/shop" className="hover:text-bridal-gold-500">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{dress.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
              {selectedImage ? (
                <img
                  src={`/uploads/${selectedImage.image_path}`}
                  alt={dress.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-bridal-gold-500 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={`/uploads/${image.image_path}`}
                      alt={`${dress.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {dress.is_new_arrival && (
                <span className="inline-block bg-bridal-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  New Arrival
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                {dress.name}
              </h1>
              <p className="text-4xl font-bold text-bridal-gold-500 mb-6">
                {formatPrice(dress.price)}
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {dress.description}
              </p>
            </div>

            {/* Features */}
            {dress.features && dress.features.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Features</h2>
                <ul className="space-y-2">
                  {dress.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Call to Action */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-bridal-cream rounded-lg p-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                  Ready to Try This On?
                </h3>
                <p className="text-gray-700 mb-6">
                  Call us to check availability and schedule an appointment to see this beautiful dress in person.
                </p>
                <a
                  href="tel:8012240059"
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  <Phone className="h-5 w-5" />
                  Call for Availability: (801) 224-0059
                </a>
                <Link
                  to="/schedule-appointment"
                  className="btn-secondary w-full mt-3 text-center"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="mb-2">
                  <strong>In-House Alterations Available:</strong> Our expert seamstresses can ensure a perfect fit for your special day.
                </p>
                <p>
                  <strong>Appointment Required:</strong> Please call or schedule online to try on dresses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-16 text-center">
          <Link to="/shop" className="inline-flex items-center text-bridal-gold-500 hover:text-bridal-gold-600 font-medium">
            <ChevronRight className="h-5 w-5 rotate-180" />
            <span className="ml-2">Back to Shop</span>
          </Link>
        </div>
      </div>

      {/* Additional CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Fall in Love With Your Dream Dress
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our boutique to experience the beauty and elegance of our collection in person.
          </p>
          <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
            <Link to="/schedule-appointment" className="block px-8 py-4 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors duration-200 text-center">
              Schedule Appointment
            </Link>
            <a href="tel:8012240059" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <span>(801) 224-0059</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
