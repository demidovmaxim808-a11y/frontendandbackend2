import axios from 'axios';

// Определяем базовый URL в зависимости от того, откуда открыт сайт
const getBaseURL = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return `http://${window.location.hostname}:3000`;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export const api = {
  getProducts: async () => {
    const response = await apiClient.get('/api/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  createProduct: async (product) => {
    const response = await apiClient.post('/api/products', product);
    return response.data;
  },

  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/api/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  }
};