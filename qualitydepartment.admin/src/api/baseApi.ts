import axios from 'axios';
import { clearAuthData, getAuthData } from '../utils/authStorage';

const API_BASE_URL =
    import.meta.env.VITE_ADMIN_API_URL ??
    import.meta.env.VITE_API_URL ??
    'https://localhost:7039/api';

export const baseApi = axios.create({
    baseURL: API_BASE_URL,
});

baseApi.interceptors.request.use((config) => {
    const auth = getAuthData();

    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
});

baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthData();

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        console.error('API error:', error);
        return Promise.reject(error);
    }
);