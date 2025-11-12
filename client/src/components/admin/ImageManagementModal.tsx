import { useState, useRef, DragEvent } from 'react';
import { X, Upload, Trash2, Star } from 'lucide-react';
import type { Dress, DressImage } from '@shared/types';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ImageManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  dress: Dress;
  onUpdate: () => void;
}

export function ImageManagementModal({
  isOpen,
  onClose,
  dress,
  onUpdate,
}: ImageManagementModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      await uploadImages(imageFiles);
    } else {
      showToast('Please drop image files only', 'warning');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadImages(files);
    }
  };

  const uploadImages = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);

        await api.post(`/dresses/${dress.id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(Math.round(((i + progress / 100) / files.length) * 100));
          },
        });
      }

      showToast(
        `Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}`,
        'success'
      );
      onUpdate();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to upload images', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const setPrimaryImage = async (imageId: number) => {
    try {
      await api.put(`/dresses/${dress.id}/images/${imageId}/primary`);
      showToast('Primary image updated', 'success');
      onUpdate();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to set primary image', 'error');
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.delete(`/dresses/${dress.id}/images/${imageId}`);
      showToast('Image deleted successfully', 'success');
      onUpdate();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete image', 'error');
    }
  };

  if (!isOpen) return null;

  const images = dress.images || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Manage Images</h2>
            <p className="text-sm text-gray-600 mt-1">{dress.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-bridal-gold-500 bg-bridal-gold-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Upload Images'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Files
            </button>

            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-bridal-gold-500 h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
              </div>
            )}
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image: DressImage) => (
                <div
                  key={image.id}
                  className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-bridal-gold-500 transition-colors"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={image.image_path}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-bridal-gold-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!image.is_primary && (
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        className="p-2 bg-white text-bridal-gold-600 rounded-full hover:bg-bridal-gold-50 transition-colors"
                        title="Set as primary"
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No images uploaded yet. Add some images to get started!</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
