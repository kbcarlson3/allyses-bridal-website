import { useEffect, useState } from 'react';
import {
  Filter,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import api from '../../services/api';
import type { ApiResponse, Inquiry } from '@shared/types';

type InquiryStatus = 'new' | 'read' | 'handled' | 'all';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, statusFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Inquiry[]>>('/inquiries/admin/all');
      const data = response.data.data || [];
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    if (statusFilter === 'all') {
      setFilteredInquiries(inquiries);
    } else {
      setFilteredInquiries(inquiries.filter((inq) => inq.status === statusFilter));
    }
  };

  const updateInquiryStatus = async (id: number, status: 'read' | 'handled') => {
    try {
      await api.put(`/inquiries/${id}`, { status });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update inquiry status');
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'handled':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'alterations':
        return <CheckCircle className="h-4 w-4" />;
      case 'floral':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
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
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter by Status:</span>
          </div>

          <div className="flex gap-2">
            {(['all', 'new', 'read', 'handled'] as InquiryStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-bridal-gold-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'all' && (
                  <span className="ml-2 bg-white text-bridal-gold-500 px-2 py-0.5 rounded-full text-sm">
                    {inquiries.length}
                  </span>
                )}
                {status !== 'all' && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                      statusFilter === status
                        ? 'bg-white text-bridal-gold-500'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {inquiries.filter((inq) => inq.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-500">
              {statusFilter === 'all'
                ? 'No inquiries have been received yet.'
                : `No ${statusFilter} inquiries.`}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-lg shadow border-l-4 ${
                inquiry.status === 'new'
                  ? 'border-yellow-400'
                  : inquiry.status === 'read'
                  ? 'border-blue-400'
                  : 'border-green-400'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {inquiry.status}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        {getTypeIcon(inquiry.inquiry_type)}
                        {inquiry.inquiry_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="hover:text-bridal-gold-500 transition-colors"
                        >
                          {inquiry.email}
                        </a>
                      </div>

                      {inquiry.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="hover:text-bridal-gold-500 transition-colors"
                          >
                            {inquiry.phone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  {inquiry.status === 'new' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Mark as Read
                    </button>
                  )}

                  {inquiry.status !== 'handled' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'handled')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Handled
                    </button>
                  )}

                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
