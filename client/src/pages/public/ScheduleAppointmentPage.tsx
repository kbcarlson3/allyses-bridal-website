import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, AlertCircle, CheckCircle, Phone, User, Mail, MessageSquare, Sparkles, Scissors, Heart } from 'lucide-react';
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', desc: 'Try on dresses and find your perfect gown', icon: Sparkles },
    { value: 'alterations', label: 'Alterations', desc: 'Fitting and alteration appointment', icon: Scissors },
    { value: 'fitting', label: 'Fitting', desc: 'Final fitting appointment', icon: Heart },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-bridal-ivory flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 animate-scale-in">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-light text-bridal-charcoal-500 mb-6">
            Appointment Confirmed!
          </h1>
          <p className="text-lg text-bridal-charcoal-400 font-sans mb-10 leading-relaxed">
            Thank you for booking with us. You will receive a confirmation email shortly with all the details.
            We look forward to seeing you!
          </p>
          <div className="bg-bridal-clay-50 border-2 border-bridal-clay-200 p-8 mb-10">
            <p className="text-bridal-charcoal-400 font-sans mb-3">
              If you need to cancel or reschedule, please call us at least 48 hours in advance:
            </p>
            <a href="tel:8012240059" className="text-3xl font-display text-bridal-clay-600 hover:text-bridal-clay-700 transition-colors">
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

  const currentStep = !selectedDate ? 1 : !selectedTime ? 2 : 3;

  return (
    <div className="bg-bridal-ivory min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-bridal-taupe py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
            <Calendar className="h-10 w-10" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-bridal-charcoal-500 mb-6">
            Schedule an Appointment
          </h1>
          <p className="text-lg md:text-xl text-bridal-charcoal-400 font-sans max-w-3xl mx-auto leading-relaxed">
            Book your visit to try on our beautiful collection of wedding dresses. Appointments ensure you receive personalized attention from our team.
          </p>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 px-4 bg-white border-b border-bridal-taupe">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-sans font-medium text-sm transition-colors ${
                  currentStep >= step
                    ? 'bg-bridal-clay-500 text-white'
                    : 'bg-bridal-taupe text-bridal-charcoal-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`hidden md:block w-16 lg:w-24 h-1 mx-2 transition-colors ${
                    currentStep > step ? 'bg-bridal-clay-500' : 'bg-bridal-taupe'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 md:gap-12 mt-4">
            <span className="text-xs md:text-sm font-sans text-bridal-charcoal-400 uppercase tracking-wide">Type & Date</span>
            <span className="text-xs md:text-sm font-sans text-bridal-charcoal-400 uppercase tracking-wide hidden md:inline">Time</span>
            <span className="text-xs md:text-sm font-sans text-bridal-charcoal-400 uppercase tracking-wide">Details</span>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-10 px-4 bg-bridal-clay-50 border-b border-bridal-clay-200">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-bridal-clay-500 text-white rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans font-semibold text-bridal-charcoal-500 mb-2">
                Currently Scheduling Allyse's Dresses Only
              </h2>
              <p className="text-bridal-charcoal-400 font-sans text-sm">
                At this time, we are only accepting appointments for dresses from our collection.
                All appointments are 30 minutes and by appointment only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Appointment Type */}
            <div className="bg-white p-8 md:p-10 shadow-sm">
              <h2 className="text-3xl font-display font-light text-bridal-charcoal-500 mb-8">Select Appointment Type</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {appointmentTypes.map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedType(value as any)}
                    className={`p-6 border-2 transition-all text-left ${
                      selectedType === value
                        ? 'border-bridal-clay-500 bg-bridal-clay-50'
                        : 'border-bridal-taupe hover:border-bridal-clay-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-4 ${selectedType === value ? 'text-bridal-clay-500' : 'text-bridal-charcoal-400'}`} />
                    <h3 className="font-sans font-semibold text-bridal-charcoal-500 mb-2">{label}</h3>
                    <p className="text-sm text-bridal-charcoal-400 font-sans">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white p-8 md:p-10 shadow-sm">
              <h2 className="text-3xl font-display font-light text-bridal-charcoal-500 mb-6 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-bridal-clay-500" />
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
              <div className="bg-white p-8 md:p-10 shadow-sm animate-fade-in">
                <h2 className="text-3xl font-display font-light text-bridal-charcoal-500 mb-8 flex items-center gap-3">
                  <Clock className="h-8 w-8 text-bridal-clay-500" />
                  Select Time
                </h2>

                {loadingSlots ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-bridal-clay-200 border-t-bridal-clay-500 mx-auto mb-4"></div>
                    <p className="text-bridal-charcoal-400 font-sans">Loading available times...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-12 text-bridal-charcoal-400">
                    <p className="font-sans mb-2">No available time slots for this date.</p>
                    <p className="text-sm font-sans">Please select a different date or call us at (801) 224-0059</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`px-4 py-3 border-2 font-sans font-medium text-sm transition-all ${
                          selectedTime === slot.time
                            ? 'border-bridal-clay-500 bg-bridal-clay-500 text-white'
                            : slot.available
                              ? 'border-bridal-taupe hover:border-bridal-clay-500 text-bridal-charcoal-500'
                              : 'border-bridal-taupe bg-bridal-taupe text-bridal-charcoal-300 cursor-not-allowed'
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
              <div className="bg-white p-8 md:p-10 shadow-sm animate-fade-in">
                <h2 className="text-3xl font-display font-light text-bridal-charcoal-500 mb-8">Your Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-sans font-medium text-bridal-charcoal-500 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </label>
                    <input
                      {...register('customer_name', { required: 'Name is required', minLength: 2 })}
                      className="input-field"
                      placeholder="Jane Smith"
                    />
                    {errors.customer_name && (
                      <p className="mt-2 text-sm text-red-500 font-sans">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-bridal-charcoal-500 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
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
                      <p className="mt-2 text-sm text-red-500 font-sans">{errors.customer_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-bridal-charcoal-500 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
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
                      <p className="mt-2 text-sm text-red-500 font-sans">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-bridal-charcoal-500 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Notes (Optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      className="textarea-field"
                      rows={4}
                      placeholder="Any special requests or information we should know?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            {selectedTime && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-lg px-16 py-5 inline-flex items-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
                <p className="mt-6 text-sm text-bridal-charcoal-400 font-sans">
                  You will receive a confirmation email after booking
                </p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-bridal-charcoal-500 text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-6">Need Help?</h2>
          <p className="text-white/80 font-sans mb-8 leading-relaxed">
            If you have questions or need to book outside our online availability, please give us a call.
          </p>
          <a
            href="tel:8012240059"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-bridal-charcoal-500 font-sans font-medium hover:bg-bridal-clay-500 hover:text-white transition-colors"
          >
            <Phone className="h-5 w-5" />
            (801) 224-0059
          </a>
        </div>
      </section>
    </div>
  );
}
