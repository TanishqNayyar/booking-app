import axios from 'axios';



const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export default API_URL;

const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// AUTH
export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const getMe = () => axios.get(`${API_URL}/auth/me`, authHeader());


// EXPERTS
export const fetchExperts = (params) => axios.get(`${API_URL}/experts`, { params });
export const fetchExpertById = (id) => axios.get(`${API_URL}/experts/${id}`);
export const fetchCategories = () => axios.get(`${API_URL}/experts/categories`);

// BOOKINGS
export const createBooking = (data) => axios.post(`${API_URL}/bookings`, data);
export const fetchBookings = (params) => axios.get(`${API_URL}/bookings`, { params });
export const fetchBookedSlots = (params) => axios.get(`${API_URL}/bookings/slots`, { params });
export const cancelBooking = (id) => axios.patch(`${API_URL}/bookings/${id}/cancel`, {}, authHeader());

// ADMIN
export const getDashboardStats = () => axios.get(`${API_URL}/admin/dashboard`, authHeader());
export const getAllBookings = (params) => axios.get(`${API_URL}/admin/bookings`, { params, ...authHeader() });
export const updateBookingStatus = (id, status) => axios.patch(`${API_URL}/admin/bookings/${id}/status`, { status }, authHeader());
export const addExpert = (data) => axios.post(`${API_URL}/admin/experts`, data, authHeader());
export const deleteExpert = (id) => axios.delete(`${API_URL}/admin/experts/${id}`, authHeader());