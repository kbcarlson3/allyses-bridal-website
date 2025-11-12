import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import api from '../../services/api';
import type { CreateAppointmentRequest, TimeSlot, ApiResponse } from '@shared/types';

export default function ScheduleAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState<'consultation' | 'alterations' | 'fitting'>('consultation');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateAppointmentRequest>();

  useEffect(() => {
    if (selectedDate && selectedType) {
      loadAvailability();
    }
  }, [selectedDate, selectedType]);

  const loadAvailability = async () => {
    try {
      setLoadingSlots(true);
      const response = await api.get<ApiResponse>(`/appointments/availability?date=${selectedDate}&appointment_type=${selectedType}`);

      if (response.data.success && response.data.data) {
        const { available, slots, reason } = response.data.data;
        if (available && slots) {
          setAvailableSlots(slots);
        } else {
          setAvailableSlots([]);
        }
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data: CreateAppointmentRequest) => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }

    try {
      setSubmitting(true);
      const appointmentData = {
        ...data,
        appointment_type: selectedType,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        duration_minutes: 30
      };

      const response = await api.post<ApiResponse>('/appointments', appointmentData);

      if (response.data.success) {
        setSuccess(true);
        reset();
        setSelectedDate('');
        setSelectedTime('');
        setSelectedType('consultation');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Appointment Confirmed!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Thank you for booking with us. You will receive a confirmation email shortly with all the details.
            We look forward to seeing you!
          </p>
          <div className="bg-bridal-cream rounded-lg p-6 mb-8">
            <p className="text-gray-700">
              If you need to cancel or reschedule, please call us at least 48 hours in advance:
            </p>
            <a href="tel:8012240059" className="text-2xl font-bold text-bridal-gold-500 hover:text-bridal-gold-600 mt-2 inline-block">
              (801) 224-0059
            </a>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="btn-secondary"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-bridal-cream py-12 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Schedule an Appointment
          </h1>
          <p className="text-lg text-gray-700">
            Book your visit to try on our beautiful collection of wedding dresses. Appointments ensure you receive personalized attention from our team.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-4 bg-bridal-pink-50 border-y border-bridal-pink-200">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-bridal-pink-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-gray-900 mb-2">
                Currently Scheduling Allyse's Dresses Only
              </h2>
              <p className="text-gray-700 text-sm">
                At this time, we are only accepting appointments for dresses from our collection.
                All appointments are 30 minutes and by appointment only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Appointment Type */}
            <div className="card">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Appointment Type</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedType('consultation')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedType === 'consultation'
                      ? 'border-bridal-gold-500 bg-bridal-gold-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">Consultation</h3>
                  <p className="text-sm text-gray-600">Try on dresses and find your perfect gown</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('alterations')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedType === 'alterations'
                      ? 'border-bridal-gold-500 bg-bridal-gold-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">Alterations</h3>
                  <p className="text-sm text-gray-600">Fitting and alteration appointment</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('fitting')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedType === 'fitting'
                      ? 'border-bridal-gold-500 bg-bridal-gold-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">Fitting</h3>
                  <p className="text-sm text-gray-600">Final fitting appointment</p>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="card">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-bridal-gold-500" />
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                min={minDate}
                max={maxDate}
                className="input-field text-lg"
                required
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="card">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-bridal-gold-500" />
                  Select Time
                </h2>

                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bridal-gold-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading available times...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p>No available time slots for this date.</p>
                    <p className="text-sm mt-2">Please select a different date or call us at (801) 224-0059</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                          selectedTime === slot.time
                            ? 'border-bridal-gold-500 bg-bridal-gold-500 text-white'
                            : slot.available
                              ? 'border-gray-300 hover:border-bridal-gold-500'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Information */}
            {selectedTime && (
              <div className="card">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('customer_name', { required: 'Name is required', minLength: 2 })}
                      className="input-field"
                      placeholder="Jane Smith"
                    />
                    {errors.customer_name && (
                      <p className="mt-1 text-sm text-red-500">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('customer_phone', {
                        required: 'Phone number is required',
                        pattern: { value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, message: 'Invalid phone number' }
                      })}
                      type="tel"
                      className="input-field"
                      placeholder="(801) 555-1234"
                    />
                    {errors.customer_phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.customer_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('customer_email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })}
                      type="email"
                      className="input-field"
                      placeholder="jane@example.com"
                    />
                    {errors.customer_email && (
                      <p className="mt-1 text-sm text-red-500">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      className="input-field"
                      rows={3}
                      placeholder="Any special requests or information we should know?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            {selectedTime && (
              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-lg px-12 py-4"
                >
                  {submitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  You will receive a confirmation email after booking
                </p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl font-serif font-bold mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            If you have questions or need to book outside our online availability, please give us a call.
          </p>
          <a
            href="tel:8012240059"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-5 w-5" />
            (801) 224-0059
          </a>
        </div>
      </section>
    </div>
  );
}
