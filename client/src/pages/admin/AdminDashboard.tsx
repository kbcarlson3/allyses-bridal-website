import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Shirt,
  Calendar,
  MessageSquare,
  Image,
  Plus,
  Eye,
  CheckCircle,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import type { ApiResponse, Appointment, Inquiry, Dress, GalleryImage } from '@shared/types';

interface DashboardStats {
  totalDresses: number;
  totalAppointments: number;
  pendingInquiries: number;
  galleryImages: number;
}

interface RecentActivity {
  id: number;
  type: 'appointment' | 'inquiry';
  title: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDresses: 0,
    totalAppointments: 0,
    pendingInquiries: 0,
    galleryImages: 0,
  });
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [dressesRes, appointmentsRes, inquiriesRes, galleryRes] = await Promise.all([
        api.get<ApiResponse<Dress[]>>('/dresses'),
        api.get<ApiResponse<Appointment[]>>('/appointments/admin/all'),
        api.get<ApiResponse<Inquiry[]>>('/inquiries/admin/all'),
        api.get<ApiResponse<GalleryImage[]>>('/gallery'),
      ]);

      // Calculate stats
      const dresses = dressesRes.data.data || [];
      const appointments = appointmentsRes.data.data || [];
      const inquiries = inquiriesRes.data.data || [];
      const gallery = galleryRes.data.data || [];

      setStats({
        totalDresses: dresses.length,
        totalAppointments: appointments.length,
        pendingInquiries: inquiries.filter((i) => i.status === 'new').length,
        galleryImages: gallery.length,
      });

      // Filter today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todaysAppts = appointments.filter((a) => a.appointment_date === today);
      setTodaysAppointments(todaysAppts);

      // Build recent activity from last 5 appointments or inquiries
      const activity: RecentActivity[] = [];

      appointments
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .forEach((appt) => {
          activity.push({
            id: appt.id,
            type: 'appointment',
            title: `Appointment - ${appt.customer_name}`,
            description: `${appt.appointment_type} on ${new Date(appt.appointment_date).toLocaleDateString()}`,
            timestamp: appt.created_at,
          });
        });

      inquiries
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)
        .forEach((inq) => {
          activity.push({
            id: inq.id,
            type: 'inquiry',
            title: `Inquiry - ${inq.name}`,
            description: inq.inquiry_type,
            timestamp: inq.created_at,
          });
        });

      // Sort by timestamp and take top 5
      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAppointmentTypeColor = (type: string) => {
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Dresses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDresses}</p>
            </div>
            <div className="bg-bridal-pink-100 p-3 rounded-lg">
              <Shirt className="h-6 w-6 text-bridal-pink-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAppointments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Inquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingInquiries}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gallery Images</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.galleryImages}</p>
            </div>
            <div className="bg-bridal-gold-100 p-3 rounded-lg">
              <Image className="h-6 w-6 text-bridal-gold-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-gray-900">Today's Appointments</h2>
              <Link
                to="/admin/appointments"
                className="text-sm text-bridal-gold-500 hover:text-bridal-gold-600 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {todaysAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-gray-900">{appointment.customer_name}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getAppointmentTypeColor(
                            appointment.appointment_type
                          )}`}
                        >
                          {appointment.appointment_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.customer_email} • {appointment.customer_phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatTime(appointment.appointment_time)}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.duration_minutes} min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-serif font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              to="/admin/dresses"
              className="flex items-center gap-3 p-3 bg-bridal-gold-50 hover:bg-bridal-gold-100 rounded-lg transition-colors"
            >
              <div className="bg-bridal-gold-500 p-2 rounded-lg">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-900">Add New Dress</span>
            </Link>

            <Link
              to="/admin/appointments"
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="bg-blue-500 p-2 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-900">View Appointments</span>
            </Link>

            <Link
              to="/admin/inquiries"
              className="flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <div className="bg-yellow-500 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-900">Check Inquiries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-serif font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === 'appointment' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}
                  >
                    {activity.type === 'appointment' ? (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
