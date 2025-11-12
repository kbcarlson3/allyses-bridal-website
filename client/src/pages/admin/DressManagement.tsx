import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { Dress, CreateDressRequest, ApiResponse } from '@shared/types';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DressFormModal } from '../../components/admin/DressFormModal';
import { ImageManagementModal } from '../../components/admin/ImageManagementModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export default function DressManagement() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'unpublished'>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchDresses();
  }, []);

  useEffect(() => {
    filterDresses();
  }, [dresses, searchQuery, filterStatus]);

  const fetchDresses = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Dress[]>>('/dresses/admin/all');
      if (response.data.success && response.data.data) {
        setDresses(response.data.data);
      }
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to fetch dresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterDresses = () => {
    let filtered = dresses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((dress) => dress.name.toLowerCase().includes(query));
    }

    // Filter by status
    if (filterStatus === 'published') {
      filtered = filtered.filter((dress) => dress.is_published);
    } else if (filterStatus === 'unpublished') {
      filtered = filtered.filter((dress) => !dress.is_published);
    }

    setFilteredDresses(filtered);
  };

  const handleAddDress = () => {
    setSelectedDress(null);
    setShowFormModal(true);
  };

  const handleEditDress = (dress: Dress) => {
    setSelectedDress(dress);
    setShowFormModal(true);
  };

  const handleManageImages = (dress: Dress) => {
    setSelectedDress(dress);
    setShowImageModal(true);
  };

  const handleDeleteClick = (dress: Dress) => {
    setSelectedDress(dress);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: CreateDressRequest) => {
    setIsSubmitting(true);
    try {
      if (selectedDress) {
        // Update existing dress
        await api.put(`/dresses/${selectedDress.id}`, data);
        showToast('Dress updated successfully', 'success');
      } else {
        // Create new dress
        await api.post('/dresses', data);
        showToast('Dress created successfully', 'success');
      }
      setShowFormModal(false);
      setSelectedDress(null);
      fetchDresses();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to save dress', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDress) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/dresses/${selectedDress.id}`);
      showToast('Dress deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedDress(null);
      fetchDresses();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete dress', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
    setSelectedDress(null);
    fetchDresses(); // Refresh to get updated images
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bridal-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Dress Management</h1>
        <p className="text-gray-600">
          Manage your dress inventory, images, and display settings
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dresses by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent outline-none"
          >
            <option value="all">All Dresses</option>
            <option value="published">Published Only</option>
            <option value="unpublished">Unpublished Only</option>
          </select>

          {/* Add Button */}
          <button
            onClick={handleAddDress}
            className="flex items-center gap-2 px-6 py-2 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add New Dress
          </button>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredDresses.length} of {dresses.length} dresses
        </div>
      </div>

      {/* Dresses Grid/Table */}
      {filteredDresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dresses found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first dress'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <button
              onClick={handleAddDress}
              className="inline-flex items-center gap-2 px-6 py-2 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Dress
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDresses.map((dress) => (
            <div
              key={dress.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-gray-100">
                {dress.primary_image ? (
                  <img
                    src={`/uploads/${dress.primary_image.image_path}`}
                    alt={dress.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {dress.is_new_arrival && (
                    <span className="bg-bridal-gold-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      New Arrival
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      dress.is_published
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {dress.is_published ? 'Published' : 'Unpublished'}
                  </span>
                </div>

                {/* Image count badge */}
                {dress.images && dress.images.length > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {dress.images.length}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 truncate">
                  {dress.name}
                </h3>
                <p className="text-bridal-gold-600 font-semibold mb-3">
                  ${dress.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {dress.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDress(dress)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors text-sm"
                    title="Edit dress"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleManageImages(dress)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors text-sm"
                    title="Manage images"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </button>
                  <button
                    onClick={() => handleDeleteClick(dress)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 font-medium rounded-md hover:bg-red-100 transition-colors text-sm"
                    title="Delete dress"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DressFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedDress(null);
        }}
        onSubmit={handleFormSubmit}
        dress={selectedDress}
        isSubmitting={isSubmitting}
      />

      {selectedDress && (
        <ImageManagementModal
          isOpen={showImageModal}
          onClose={handleImageModalClose}
          dress={selectedDress}
          onUpdate={fetchDresses}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDress(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedDress?.name || ''}
        itemType="dress"
        isDeleting={isSubmitting}
      />
    </div>
  );
}
