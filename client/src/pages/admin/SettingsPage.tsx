import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Phone, Mail, MapPin, Clock, Instagram, Facebook, FileText } from 'lucide-react';
import api from '../../services/api';
import type { ApiResponse, Setting, BusinessHours, UpdateSettingsRequest } from '@shared/types';

interface SettingsFormData {
  phone: string;
  email: string;
  address: string;
  instagram_handle: string;
  facebook_url: string;
  our_story: string;
  welcome_message: string;
}

interface BusinessHoursForm {
  [key: number]: {
    open_time: string;
    close_time: string;
    is_closed: boolean;
  };
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHoursForm>({});

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SettingsFormData>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const [settingsRes, hoursRes] = await Promise.all([
        api.get<ApiResponse<Record<string, string>>>('/settings'),
        api.get<ApiResponse<BusinessHours[]>>('/settings/hours'),
      ]);

      // Populate form with settings
      const settings = settingsRes.data.data || {};
      Object.entries(settings).forEach(([key, value]) => {
        setValue(key as keyof SettingsFormData, value);
      });

      // Populate business hours
      const hours = hoursRes.data.data || [];
      const hoursMap: BusinessHoursForm = {};
      hours.forEach((hour) => {
        hoursMap[hour.day_of_week] = {
          open_time: hour.open_time,
          close_time: hour.close_time,
          is_closed: hour.is_closed,
        };
      });

      // Fill in missing days with defaults
      for (let i = 0; i < 7; i++) {
        if (!hoursMap[i]) {
          hoursMap[i] = {
            open_time: '09:00',
            close_time: '17:00',
            is_closed: false,
          };
        }
      }

      setBusinessHours(hoursMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setSaving(true);

      const settingsPayload: UpdateSettingsRequest = {
        phone: data.phone,
        email: data.email,
        address: data.address,
        instagram_handle: data.instagram_handle,
        facebook_url: data.facebook_url,
        our_story: data.our_story,
        welcome_message: data.welcome_message,
      };

      await api.put('/settings', settingsPayload);

      // Save business hours
      const hoursArray = Object.entries(businessHours).map(([day, hours]) => ({
        day_of_week: parseInt(day),
        ...hours,
      }));

      await api.put('/settings/hours', { hours: hoursArray });

      showNotification('success', 'Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showNotification('error', error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleHoursChange = (day: number, field: 'open_time' | 'close_time' | 'is_closed', value: string | boolean) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bridal-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your website settings and business information</p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="h-5 w-5 text-bridal-gold-500" />
            <h2 className="text-xl font-serif font-bold text-gray-900">Contact Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="info@allysesbridal.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </div>
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="123 Main St, City, State 12345"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-bridal-gold-500" />
            <h2 className="text-xl font-serif font-bold text-gray-900">Business Hours</h2>
          </div>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-28 font-medium text-gray-700">{day}</div>

                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={businessHours[index]?.open_time || '09:00'}
                    onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)}
                    disabled={businessHours[index]?.is_closed}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={businessHours[index]?.close_time || '17:00'}
                    onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)}
                    disabled={businessHours[index]?.is_closed}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={businessHours[index]?.is_closed || false}
                    onChange={(e) => handleHoursChange(index, 'is_closed', e.target.checked)}
                    className="rounded border-gray-300 text-bridal-gold-500 focus:ring-bridal-gold-500"
                  />
                  <span className="text-sm text-gray-600">Closed</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Instagram className="h-5 w-5 text-bridal-gold-500" />
            <h2 className="text-xl font-serif font-bold text-gray-900">Social Media</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram Handle
                </div>
              </label>
              <input
                type="text"
                {...register('instagram_handle')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="@allysesbridal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook URL
                </div>
              </label>
              <input
                type="url"
                {...register('facebook_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="https://facebook.com/allysesbridal"
              />
            </div>
          </div>
        </div>

        {/* Website Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-5 w-5 text-bridal-gold-500" />
            <h2 className="text-xl font-serif font-bold text-gray-900">Website Content</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message
              </label>
              <textarea
                {...register('welcome_message')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="Welcome to Allyse's Bridal..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Our Story
              </label>
              <textarea
                {...register('our_story')}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                placeholder="Tell your story..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
