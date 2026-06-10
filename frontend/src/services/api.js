import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  toggle2FA: (data) => api.put('/auth/toggle-2fa', data),
  googleUrl: () => {
    if (API_URL.startsWith('http')) {
      return `${API_URL.replace(/\/api\/?$/, '')}/api/auth/google`
    }
    return 'http://localhost:5000/api/auth/google'
  },
}

export const tripAPI = {
  generate: (data) => api.post('/trips/generate', data),
  getAll: () => api.get('/trips'),
  getDashboard: () => api.get('/trips/dashboard'),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  share: (token) => api.get(`/trips/share/${token}`),
  addExpense: (id, data) => api.post(`/trips/${id}/expenses`, data),
  toggleChecklist: (id, itemId, completed) => api.patch(`/trips/${id}/checklist/${itemId}`, { completed }),
  chat: (id, message) => api.post(`/trips/${id}/chat`, { message }),
  nearby: (id) => api.get(`/trips/${id}/nearby`),
  getRoute: (id) => api.post(`/trips/${id}/route`),
  downloadPDF: (id) => {
    const currency = localStorage.getItem('currency') || 'USD';
    return api.get(`/trips/${id}/pdf`, { responseType: 'blob', params: { currency } });
  },
}

export const utilityAPI = {
  convertCurrency: (from, to, amount) => api.get('/currency', { params: { from, to, amount } }),
}

export default api
