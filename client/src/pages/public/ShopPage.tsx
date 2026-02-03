import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import QuickViewModal from '../../components/QuickViewModal';
import type { Dress, PaginatedResponse, ApiResponse } from '@shared/types';

export default function ShopPage() {
  const { page: pageParam } = useParams();
  const currentPage = parseInt(pageParam || '1');
  const { addToCart } = useCart();

  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewDress, setQuickViewDress] = useState<Dress | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 1
  });

  useEffect(() => {
    loadDresses(currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const loadDresses = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<PaginatedResponse<Dress>>>(`/dresses?page=${page}&per_page=12`);

      if (response.data.success && response.data.data) {
        setDresses(response.data.data.data);
        setPagination({
          total: response.data.data.total,
          page: response.data.data.page,
          per_page: response.data.data.per_page,
          total_pages: response.data.data.total_pages
        });
      }
    } catch (error) {
      console.error('Error loading dresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const slugify = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const handleQuickView = (e: React.MouseEvent, dress: Dress) => {
    e.preventDefault();
    setQuickViewDress(dress);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-bridal-clay-200 border-t-bridal-clay-500 mx-auto mb-4"></div>
          <p className="text-bridal-charcoal-400 font-sans">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bridal-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-bridal-taupe py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="section-subtitle text-bridal-clay-600 mb-4">Browse Our Collection</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-bridal-charcoal-500 mb-6">
            Wedding Dresses
          </h1>
          <p className="text-lg text-bridal-charcoal-400 font-sans max-w-2xl mx-auto">
            Discover our curated selection of modest wedding dresses, each designed with
            timeless elegance and modern sophistication.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-7xl">
        {/* Results Count & Filters */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-sm text-bridal-charcoal-400 font-sans">
            Showing <span className="font-medium text-bridal-charcoal-500">{dresses.length}</span> of{' '}
            <span className="font-medium text-bridal-charcoal-500">{pagination.total}</span> dresses
          </p>

          {/* Future: Add filter/sort button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-bridal-taupe text-bridal-charcoal-500 hover:bg-bridal-cream transition-colors text-sm font-sans opacity-50 cursor-not-allowed">
            <Filter className="w-4 h-4" />
            <span>Filter & Sort</span>
          </button>
        </div>

        {/* Dress Grid */}
        {dresses.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl font-display text-bridal-charcoal-400 mb-4">No dresses available</p>
            <Link to="/" className="text-bridal-clay-600 hover:text-bridal-clay-700 font-sans link-underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {dresses.map((dress, index) => (
                <div key={dress.id} className="product-card group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    to={`/product/${slugify(dress.name)}`}
                    className="block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-bridal-cream overflow-hidden mb-4">
                      {dress.primary_image ? (
                        <img
                          src={`/uploads/${dress.primary_image.image_path}`}
                          alt={dress.name}
                          className="product-card-image"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-bridal-charcoal-300">
                          <span className="text-sm font-sans">No Image</span>
                        </div>
                      )}

                      <div className="product-card-overlay" />

                      {/* New Arrival Badge */}
                      {dress.is_new_arrival && (
                        <div className="absolute top-4 left-4 bg-bridal-clay-500 text-white px-3 py-1 text-xs font-sans font-medium tracking-widest uppercase">
                          New
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button
                          onClick={(e) => handleQuickView(e, dress)}
                          className="flex-1 bg-white text-bridal-charcoal-500 px-4 py-2 text-xs font-sans font-medium tracking-wide uppercase hover:bg-bridal-clay-500 hover:text-white transition-colors"
                        >
                          Quick View
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(dress);
                          }}
                          className="flex-1 bg-bridal-charcoal-500 text-white px-4 py-2 text-xs font-sans font-medium tracking-wide uppercase hover:bg-bridal-clay-500 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-display text-lg text-bridal-charcoal-500 mb-1 group-hover:text-bridal-clay-600 transition-colors">
                        {dress.name}
                      </h3>
                      <p className="text-bridal-clay-600 font-sans font-medium text-sm">
                        {dress.price}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/shop/${Math.max(1, currentPage - 1)}`}
                    className={`p-3 border border-bridal-taupe transition-colors ${
                      currentPage === 1
                        ? 'text-bridal-charcoal-300 cursor-not-allowed'
                        : 'text-bridal-charcoal-500 hover:bg-bridal-cream'
                    }`}
                    onClick={(e) => currentPage === 1 && e.preventDefault()}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>

                  <span className="px-6 py-3 text-bridal-charcoal-500 font-sans text-sm">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.total_pages}</span>
                  </span>

                  <Link
                    to={`/shop/${Math.min(pagination.total_pages, currentPage + 1)}`}
                    className={`p-3 border border-bridal-taupe transition-colors ${
                      currentPage === pagination.total_pages
                        ? 'text-bridal-charcoal-300 cursor-not-allowed'
                        : 'text-bridal-charcoal-500 hover:bg-bridal-cream'
                    }`}
                    onClick={(e) => currentPage === pagination.total_pages && e.preventDefault()}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>

                {/* Load More Option (if not on last page) */}
                {currentPage < pagination.total_pages && (
                  <Link
                    to={`/shop/${currentPage + 1}`}
                    className="btn-secondary"
                  >
                    Load More Dresses
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-24 bg-bridal-charcoal-500 text-white p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-4">
            Ready to Try On Your Favorites?
          </h2>
          <p className="text-white/80 font-sans mb-8 max-w-2xl mx-auto">
            Schedule an appointment to visit our boutique and experience these beautiful dresses in person.
            Our expert team is here to help you find the perfect fit.
          </p>
          <Link to="/schedule-appointment" className="btn-primary inline-flex bg-white text-bridal-charcoal-500 hover:bg-bridal-clay-500 hover:text-white">
            <span>Schedule Appointment</span>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        dress={quickViewDress}
        onClose={() => setQuickViewDress(null)}
      />
    </div>
  );
}
