import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Calendar as CalendarIcon,
  List,
  Clock,
  Plus,
  X,
  Edit2,
  Trash2,
  Filter,
  Search,
  Save,
  Settings,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import type { ApiResponse, Appointment, BusinessHours, BlockedDate } from '@shared/types';

const localizer = momentLocalizer(moment);

type ViewMode = 'calendar' | 'list' | 'hours' | 'blocked';

interface CalendarEvent extends Event {
  resource: Appointment;
}

interface AppointmentFormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  appointment_type: 'consultation' | 'alterations' | 'fitting';
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

interface BusinessHoursFormData {
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AppointmentManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<View>('month');

  // List view filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    appointment_type: 'consultation',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 30,
    status: 'pending',
    notes: '',
  });

  // Business hours state
  const [editingHours, setEditingHours] = useState<{ [key: number]: BusinessHoursFormData }>({});

  // Blocked dates state
  const [showBlockedDateForm, setShowBlockedDateForm] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState({ blocked_date: '', reason: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, filterStatus, filterType, startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, hoursRes, blockedRes] = await Promise.all([
        api.get<ApiResponse<Appointment[]>>('/appointments/admin/all'),
        api.get<ApiResponse<BusinessHours[]>>('/appointments/admin/business-hours'),
        api.get<ApiResponse<BlockedDate[]>>('/appointments/admin/blocked-dates'),
      ]);

      setAppointments(appointmentsRes.data.data || []);
      setBusinessHours(hoursRes.data.data || []);
      setBlockedDates(blockedRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.customer_name.toLowerCase().includes(term) ||
          apt.customer_email.toLowerCase().includes(term) ||
          apt.customer_phone.includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((apt) => apt.appointment_type === filterType);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((apt) => apt.appointment_date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((apt) => apt.appointment_date <= endDate);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCompare !== 0) return dateCompare;
      return a.appointment_time.localeCompare(b.appointment_time);
    });

    setFilteredAppointments(filtered);
  };

  // Transform appointments to calendar events
  const calendarEvents: CalendarEvent[] = appointments.map((apt) => {
    const startDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    const endDate = new Date(startDate.getTime() + apt.duration_minutes * 60000);

    return {
      title: `${apt.customer_name} - ${apt.appointment_type}`,
      start: startDate,
      end: endDate,
      resource: apt,
    };
  });

  // Get event style based on status and type
  const eventStyleGetter = (event: CalendarEvent) => {
    const apt = event.resource;
    let backgroundColor = '';

    // Status colors
    switch (apt.status) {
      case 'pending':
        backgroundColor = '#fbbf24'; // yellow
        break;
      case 'confirmed':
        backgroundColor = '#10b981'; // green
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // gray
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // red
        break;
    }

    return {
      style: {
        backgroundColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
      },
    };
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedAppointment(event.resource);
    setFormData({
      customer_name: event.resource.customer_name,
      customer_phone: event.resource.customer_phone,
      customer_email: event.resource.customer_email,
      appointment_type: event.resource.appointment_type,
      appointment_date: event.resource.appointment_date,
      appointment_time: event.resource.appointment_time,
      duration_minutes: event.resource.duration_minutes,
      status: event.resource.status,
      notes: event.resource.notes || '',
    });
    setShowModal(true);
  };

  const handleUpdateAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await api.put(`/appointments/${selectedAppointment.id}`, formData);
      setShowModal(false);
      setSelectedAppointment(null);
      fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await api.delete(`/appointments/${selectedAppointment.id}`);
      setShowModal(false);
      setSelectedAppointment(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const handleUpdateBusinessHours = async (dayOfWeek: number) => {
    if (!editingHours[dayOfWeek]) return;

    try {
      await api.put(`/appointments/admin/business-hours/${dayOfWeek}`, editingHours[dayOfWeek]);
      setEditingHours((prev) => {
        const updated = { ...prev };
        delete updated[dayOfWeek];
        return updated;
      });
      fetchData();
    } catch (error) {
      console.error('Error updating business hours:', error);
      alert('Failed to update business hours');
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockedDate.blocked_date || !newBlockedDate.reason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.post('/appointments/admin/blocked-dates', newBlockedDate);
      setNewBlockedDate({ blocked_date: '', reason: '' });
      setShowBlockedDateForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding blocked date:', error);
      alert('Failed to add blocked date');
    }
  };

  const handleDeleteBlockedDate = async (id: number) => {
    if (!confirm('Are you sure you want to remove this blocked date?')) return;

    try {
      await api.delete(`/appointments/admin/blocked-dates/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting blocked date:', error);
      alert('Failed to delete blocked date');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800';
      case 'alterations':
        return 'bg-purple-100 text-purple-800';
      case 'fitting':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-serif font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-2">Manage appointments, business hours, and availability</p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'calendar'
                ? 'bg-bridal-gold-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-bridal-gold-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('hours')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'hours'
                ? 'bg-bridal-gold-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clock className="h-4 w-4" />
            Hours
          </button>
          <button
            onClick={() => setViewMode('blocked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'blocked'
                ? 'bg-bridal-gold-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            Blocked Dates
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Calendar View</h2>
            {/* Legend */}
            <div className="flex gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>

          <div style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleEventClick}
              eventPropGetter={eventStyleGetter}
              date={calendarDate}
              onNavigate={setCalendarDate}
              view={calendarView}
              onView={setCalendarView}
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="alterations">Alterations</option>
                <option value="fitting">Fitting</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(apt.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(apt.appointment_time)} ({apt.duration_minutes} min)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apt.customer_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{apt.customer_email}</div>
                        <div className="text-sm text-gray-500">{apt.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(apt.appointment_type)}`}>
                          {apt.appointment_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setFormData({
                              customer_name: apt.customer_name,
                              customer_phone: apt.customer_phone,
                              customer_email: apt.customer_email,
                              appointment_type: apt.appointment_type,
                              appointment_date: apt.appointment_date,
                              appointment_time: apt.appointment_time,
                              duration_minutes: apt.duration_minutes,
                              status: apt.status,
                              notes: apt.notes || '',
                            });
                            setShowModal(true);
                          }}
                          className="text-bridal-gold-600 hover:text-bridal-gold-800 mr-3"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            handleDeleteAppointment();
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Business Hours View */}
      {viewMode === 'hours' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Business Hours</h2>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => {
              const hours = businessHours.find((h) => h.day_of_week === index);
              const isEditing = editingHours[index] !== undefined;
              const currentData = isEditing
                ? editingHours[index]
                : {
                    open_time: hours?.open_time || '09:00',
                    close_time: hours?.close_time || '17:00',
                    is_closed: hours?.is_closed || false,
                  };

              return (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-32 font-medium text-gray-900">{day}</div>

                  <div className="flex items-center gap-4 flex-1">
                    {isEditing ? (
                      <>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentData.is_closed}
                            onChange={(e) =>
                              setEditingHours((prev) => ({
                                ...prev,
                                [index]: { ...currentData, is_closed: e.target.checked },
                              }))
                            }
                            className="rounded border-gray-300 text-bridal-gold-600 focus:ring-bridal-gold-500"
                          />
                          <span className="text-sm text-gray-700">Closed</span>
                        </label>

                        {!currentData.is_closed && (
                          <>
                            <input
                              type="time"
                              value={currentData.open_time}
                              onChange={(e) =>
                                setEditingHours((prev) => ({
                                  ...prev,
                                  [index]: { ...currentData, open_time: e.target.value },
                                }))
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={currentData.close_time}
                              onChange={(e) =>
                                setEditingHours((prev) => ({
                                  ...prev,
                                  [index]: { ...currentData, close_time: e.target.value },
                                }))
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-700">
                        {currentData.is_closed ? (
                          <span className="text-red-600">Closed</span>
                        ) : (
                          <span>
                            {formatTime(currentData.open_time)} - {formatTime(currentData.close_time)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateBusinessHours(index)}
                          className="px-4 py-2 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setEditingHours((prev) => {
                              const updated = { ...prev };
                              delete updated[index];
                              return updated;
                            })
                          }
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setEditingHours((prev) => ({
                            ...prev,
                            [index]: currentData,
                          }))
                        }
                        className="px-4 py-2 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocked Dates View */}
      {viewMode === 'blocked' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Blocked Dates</h2>
            <button
              onClick={() => setShowBlockedDateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600"
            >
              <Plus className="h-4 w-4" />
              Add Blocked Date
            </button>
          </div>

          {showBlockedDateForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newBlockedDate.blocked_date}
                    onChange={(e) =>
                      setNewBlockedDate((prev) => ({ ...prev, blocked_date: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <input
                    type="text"
                    value={newBlockedDate.reason}
                    onChange={(e) => setNewBlockedDate((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Holiday, Vacation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddBlockedDate}
                  className="px-4 py-2 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowBlockedDateForm(false);
                    setNewBlockedDate({ blocked_date: '', reason: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {blockedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No blocked dates</div>
            ) : (
              blockedDates.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(blocked.blocked_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">{blocked.reason}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDate(blocked.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customer_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customer_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.appointment_type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        appointment_type: e.target.value as AppointmentFormData['appointment_type'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="alterations">Alterations</option>
                    <option value="fitting">Fitting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, appointment_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, appointment_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, duration_minutes: parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as AppointmentFormData['status'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-gold-500"
                />
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Created: {new Date(selectedAppointment.created_at).toLocaleString()}
                <br />
                Last Updated: {new Date(selectedAppointment.updated_at).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={handleDeleteAppointment}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAppointment}
                  className="px-4 py-2 bg-bridal-gold-500 text-white rounded-lg hover:bg-bridal-gold-600 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
