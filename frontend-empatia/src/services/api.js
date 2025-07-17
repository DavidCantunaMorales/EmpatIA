import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
};

export const tasksAPI = {
    getTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    assignTask: async (taskData) => {
        const response = await api.post('/tasks/assign', taskData);
        return response.data;
    },
    respondTask: async (taskId, response) => {
        const responseData = await api.post(`/tasks/respond/${taskId}`, response);
        return responseData.data;
    },
};

export default api;
