import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5239/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const adminAPI = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'admin');
    }
    return response;
  },
  getBuses: () => api.get('/admin/buses'),
  createBus: (busData) => api.post('/admin/buses', busData),
  updateBus: (id, busData) => api.put(`/admin/buses/${id}`, busData),
  deleteBus: (id) => api.delete(`/admin/buses/${id}`),
  getRoutes: () => api.get('/admin/routes'),
  getBookings: () => api.get('/admin/bookings'),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRevenueReports: (params) => api.get('/admin/reports/revenue', { params }),
  getBusUtilization: () => api.get('/admin/reports/utilization'),
  manageRoute: {
    create: (data) => api.post('/admin/routes', data),
    update: (id, data) => api.put(`/admin/routes/${id}`, data),
    delete: (id) => api.delete(`/admin/routes/${id}`),
    getStops: (routeId) => api.get(`/admin/routes/${routeId}/stops`),
  },
  manageUsers: {
    list: (role) => api.get('/admin/users', { params: { role } }),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    delete: (id) => api.delete(`/admin/users/${id}`),
  },
  settings: {
    getFareSettings: () => api.get('/admin/settings/fares'),
    updateFareSettings: (data) => api.put('/admin/settings/fares', data),
    getNotificationTemplates: () => api.get('/admin/settings/notifications'),
    updateNotificationTemplate: (id, data) => api.put(`/admin/settings/notifications/${id}`, data),
  },
  getAnalyticsDashboard: () => api.get('/admin/analytics'),
  getCustomReports: (params) => api.get('/admin/reports/custom', { params }),
  exportReport: (format, params) => api.get(`/admin/reports/export/${format}`, { params }),
  manageAmenities: {
    list: () => api.get('/admin/amenities'),
    add: (data) => api.post('/admin/amenities', data),
    update: (id, data) => api.put(`/admin/amenities/${id}`, data),
    delete: (id) => api.delete(`/admin/amenities/${id}`),
  },
  manageMaintenance: {
    schedule: (busId, data) => api.post(`/admin/buses/${busId}/maintenance`, data),
    get: (busId) => api.get(`/admin/buses/${busId}/maintenance`),
  },
};

export const bookingAPI = {
  searchBuses: (params) => api.get('/buses/search', { params }),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookingsByPhone: (phone) => api.get(`/bookings/passenger?phone=${phone}`),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  getBookingsByBus: (busId) => api.get(`/bookings/bus/${busId}`),
  getBookingHistory: (phone) => api.get(`/bookings/history?phone=${phone}`),
  downloadTicketPDF: (bookingId) => api.get(`/bookings/${bookingId}/pdf`, { responseType: 'blob' }),
  getQRCode: (bookingId) => api.get(`/bookings/${bookingId}/qrcode`),
  refundBooking: (id) => api.post(`/bookings/${id}/refund`),
  getRefundStatus: (id) => api.get(`/bookings/${id}/refund/status`),
};

export const conductorAPI = {
  login: async (credentials) => {
    const response = await api.post('/conductor/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'conductor');
    }
    return response;
  },
  getPassengers: (busId) => api.get(`/conductor/${busId}/passengers`),
  updateBookingStatus: (id, status) => api.put(`/conductor/bookings/${id}/status`, { status }),
  verifyTicket: (ticketId) => api.post(`/conductor/tickets/${ticketId}/verify`),
  updateJourneyStatus: (busId, data) => api.put(`/conductor/journey/${busId}/status`, data),
  reportIncident: (data) => api.post('/conductor/incidents', data),
  getDailyReport: (date) => api.get('/conductor/reports/daily', { params: { date } }),
};

export const passengerAPI = {
  register: (data) => api.post('/passengers/register', data),
  login: (credentials) => api.post('/passengers/login', credentials),
  updateProfile: (id, data) => api.put(`/passengers/${id}`, data),
  searchBuses: (params) => api.get('/buses/search', { params }),
  checkSeatAvailability: (busId, date) => api.get(`/buses/${busId}/seats`, { params: { date } }),
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (passengerId) => api.get(`/passengers/${passengerId}/bookings`),
  cancelBooking: (bookingId) => api.post(`/bookings/${bookingId}/cancel`),
  submitReview: (data) => api.post('/reviews', data),
  getTicket: (bookingId) => api.get(`/bookings/${bookingId}/ticket`),
};

export const reviewAPI = {
  addBusReview: (busId, data) => api.post(`/buses/${busId}/reviews`, data),
  getBusReviews: (busId) => api.get(`/buses/${busId}/reviews`),
};

export const paymentAPI = {
  pay: (bookingId, data) => api.post(`/payments/${bookingId}`, data),
  getStatus: (paymentId) => api.get(`/payments/${paymentId}/status`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/admin/analytics'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const reportingAPI = {
  getRevenueReport: (params) => api.get('/reporting/revenue', { params }),
  getBookingsReport: (params) => api.get('/reporting/bookings', { params }),
  exportReport: (format, params) => api.get(`/reporting/export/${format}`, { 
    params,
    responseType: 'blob'
  }),
  getCustomReport: (reportType, params) => api.get(`/reporting/custom/${reportType}`, { params }),
  scheduleReport: (config) => api.post('/reporting/schedule', config),
};

export const busAPI = {
  getBuses: () => api.get('/buses'),
  getBusById: (id) => api.get(`/buses/${id}`),
  searchBuses: (params) => api.get('/buses/search', { params }),
  getBusReviews: (busId) => api.get(`/buses/${busId}/reviews`),
  addBusReview: (busId, data) => api.post(`/buses/${busId}/reviews`, data),
};

export default api;