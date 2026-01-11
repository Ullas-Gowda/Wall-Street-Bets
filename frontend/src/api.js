import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Trading API
export const tradingAPI = {
  buyAsset: (data) => api.post('/trade/buy', data),
  sellAsset: (data) => api.post('/trade/sell', data),
  getPortfolio: () => api.get('/trade/portfolio'),
  getTransactions: (params) => api.get('/trade/transactions', { params }),
  getHolding: (symbol) => api.get(`/trade/holding/${symbol}`),
};

// Market API
export const marketAPI = {
  getPrice: (symbol) => api.get(`/market/price/${symbol}`),
  getPrices: (symbols) => api.get('/market/prices', { params: { symbols } }),
  getPriceHistory: (symbol) => api.get(`/market/history/${symbol}`),
  searchAssets: (q) => api.get('/market/search', { params: { q } }),
  getTrending: () => api.get('/market/trending'),
  getOverview: (type) => api.get('/market/overview', { params: { type } }),
};

export default api;
