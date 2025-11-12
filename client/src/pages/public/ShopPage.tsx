import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import type { Dress, PaginatedResponse, ApiResponse } from '@shared/types';

export default function ShopPage() {
  const { page: pageParam } = useParams();
  const currentPage = parseInt(pageParam || '1');

  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 1
  });

  useEffect(() => {
    loadDresses(currentPage);
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
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bridal-sage-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Our Collection</h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Discover our beautiful selection of modest wedding dresses
        </p>
      </div>

      {/* Dress Grid */}
      {dresses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No dresses available at this time.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {dresses.map((dress) => (
              <Link
                key={dress.id}
                to={`/product/${slugify(dress.name)}`}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                  {dress.primary_image ? (
                    <img
                      src={`/uploads/${dress.primary_image.image_path}`}
                      alt={dress.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}

                  {/* Badge */}
                  {dress.is_new_arrival && (
                    <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 text-xs text-gray-700">
                      New Arrival
                    </div>
                  )}

                  {/* Quick View on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 text-sm">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-base font-normal text-gray-900 mb-1">
                    {dress.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="text-xs">Price</span> ${dress.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button (instead of pagination) */}
          {pagination.total_pages > 1 && currentPage < pagination.total_pages && (
            <div className="mt-12 text-center">
              <Link
                to={`/shop/${currentPage + 1}`}
                className="inline-block px-8 py-3 border border-black text-black bg-transparent hover:bg-gray-50 transition text-sm"
              >
                Load More
              </Link>
            </div>
          )}

          {/* Show page numbers for navigation if multiple pages */}
          {pagination.total_pages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Link
                to={`/shop/${Math.max(1, currentPage - 1)}`}
                className={`p-2 ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={(e) => currentPage === 1 && e.preventDefault()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>

              <span className="text-gray-700 text-sm">
                Page {currentPage} of {pagination.total_pages}
              </span>

              <Link
                to={`/shop/${Math.min(pagination.total_pages, currentPage + 1)}`}
                className={`p-2 ${
                  currentPage === pagination.total_pages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={(e) => currentPage === pagination.total_pages && e.preventDefault()}
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Call to Action */}
      <div className="mt-20 bg-gray-50 p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
          Ready to Try On Your Favorites?
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Schedule an appointment to visit our boutique and try on these beautiful dresses in person.
        </p>
        <Link to="/schedule-appointment" className="btn-primary inline-block">
          Schedule Appointment
        </Link>
      </div>
    </div>
  );
}
