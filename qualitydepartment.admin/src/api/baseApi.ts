import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_ADMIN_API_URL ??
    import.meta.env.VITE_API_URL ??
    'http://localhost:5000/api';

export const baseApi = axios.create({
    baseURL: API_BASE_URL,
});

baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error:', error);
        return Promise.reject(error);
    }
);