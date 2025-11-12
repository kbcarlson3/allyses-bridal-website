// Shared TypeScript types for Allyse's Bridal

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'owner';
  created_at: string;
}

export interface Dress {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  is_new_arrival: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: DressImage[];
  primary_image?: DressImage;
}

export interface DressImage {
  id: number;
  dress_id: number;
  image_path: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Appointment {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  appointment_type: 'consultation' | 'alterations' | 'fitting';
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  id: number;
  day_of_week: number; // 0-6, Sunday-Saturday
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface BlockedDate {
  id: number;
  blocked_date: string;
  reason: string;
  created_at: string;
}

export interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: 'general' | 'appointment' | 'alterations' | 'floral';
  status: 'new' | 'read' | 'handled';
  created_at: string;
}

export interface GalleryImage {
  id: number;
  image_path: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

// API Request/Response types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateDressRequest {
  name: string;
  price: number;
  description: string;
  features: string[];
  is_new_arrival: boolean;
  is_published: boolean;
}

export interface UpdateDressRequest extends Partial<CreateDressRequest> {
  id: number;
}

export interface CreateAppointmentRequest {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  appointment_type: Appointment['appointment_type'];
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  notes?: string;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  id: number;
  status?: Appointment['status'];
}

export interface AvailabilityRequest {
  date: string;
  appointment_type: Appointment['appointment_type'];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface CreateInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: Inquiry['inquiry_type'];
}

export interface UpdateSettingsRequest {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  instagram_handle?: string;
  facebook_url?: string;
  our_story?: string;
  welcome_message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
