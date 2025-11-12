import { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Edit2, Save, X, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import type { ApiResponse, GalleryImage } from '@shared/types';

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<GalleryImage[]>>('/gallery');
      const data = response.data.data || [];
      // Sort by display_order
      const sorted = data.sort((a, b) => a.display_order - b.display_order);
      setImages(sorted);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);

        await api.post('/gallery', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      await fetchImages();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await api.delete(`/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const startEditing = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditCaption(image.caption || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCaption('');
  };

  const saveCaption = async (id: number) => {
    try {
      await api.put(`/gallery/${id}`, { caption: editCaption });
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, caption: editCaption } : img))
      );
      setEditingId(null);
      setEditCaption('');
    } catch (error) {
      console.error('Error updating caption:', error);
      alert('Failed to update caption');
    }
  };

  const moveImage = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    // Create new array with swapped positions
    const newImages = [...images];
    const temp = newImages[currentIndex];
    newImages[currentIndex] = newImages[newIndex];
    newImages[newIndex] = temp;

    // Update display_order values
    newImages.forEach((img, idx) => {
      img.display_order = idx;
    });

    setImages(newImages);

    // Save to backend
    try {
      await api.put('/gallery/reorder', {
        imageIds: newImages.map((img) => img.id),
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      alert('Failed to reorder images');
      // Revert on error
      fetchImages();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bridal-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage your gallery images</p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload Images</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-500 mb-6">Upload your first gallery image to get started</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Images</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={`/uploads/${image.image_path}`}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Caption */}
                {editingId === image.id ? (
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Enter caption..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveCaption(image.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2 min-h-[2.5rem]">
                      {image.caption || <span className="text-gray-400 italic">No caption</span>}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditing(image)}
                    disabled={editingId !== null}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteImage(image.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex gap-1 ml-auto">
                    <button
                      onClick={() => moveImage(image.id, 'up')}
                      disabled={index === 0}
                      className="p-1.5 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => moveImage(image.id, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1.5 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
