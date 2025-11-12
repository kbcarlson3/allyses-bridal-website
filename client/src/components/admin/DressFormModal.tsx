import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Dress, CreateDressRequest } from '@shared/types';

interface DressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDressRequest) => Promise<void>;
  dress?: Dress | null;
  isSubmitting?: boolean;
}

export function DressFormModal({
  isOpen,
  onClose,
  onSubmit,
  dress,
  isSubmitting = false,
}: DressFormModalProps) {
  const [features, setFeatures] = useState<string[]>(dress?.features || []);
  const [newFeature, setNewFeature] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDressRequest>({
    defaultValues: {
      name: dress?.name || '',
      price: dress?.price || 0,
      description: dress?.description || '',
      features: dress?.features || [],
      is_new_arrival: dress?.is_new_arrival || false,
      is_published: dress?.is_published || false,
    },
  });

  useEffect(() => {
    if (dress) {
      reset({
        name: dress.name,
        price: dress.price,
        description: dress.description,
        features: dress.features,
        is_new_arrival: dress.is_new_arrival,
        is_published: dress.is_published,
      });
      setFeatures(dress.features || []);
    } else {
      reset({
        name: '',
        price: 0,
        description: '',
        features: [],
        is_new_arrival: false,
        is_published: false,
      });
      setFeatures([]);
    }
  }, [dress, reset]);

  const handleFormSubmit = async (data: CreateDressRequest) => {
    await onSubmit({ ...data, features });
    reset();
    setFeatures([]);
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {dress ? 'Edit Dress' : 'Add New Dress'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Dress Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="input-field"
              placeholder="e.g., Elegant Mermaid Gown"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className="input-field resize-none"
              placeholder="Describe the dress in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="input-field flex-1"
                placeholder="e.g., Lace detailing"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-bridal-gold-500 text-white rounded-md hover:bg-bridal-gold-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {features.length > 0 && (
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="is_new_arrival"
                type="checkbox"
                {...register('is_new_arrival')}
                className="h-4 w-4 text-bridal-gold-500 focus:ring-bridal-gold-500 border-gray-300 rounded"
              />
              <label htmlFor="is_new_arrival" className="ml-3 text-sm text-gray-700">
                Mark as New Arrival
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="is_published"
                type="checkbox"
                {...register('is_published')}
                className="h-4 w-4 text-bridal-gold-500 focus:ring-bridal-gold-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-3 text-sm text-gray-700">
                Publish (make visible to customers)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Dress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
