import { baseApi } from './baseApi';

const responseBody = <T,>(response: { data: T }) => response.data;

const requests = {
    get: <T,>(url: string) => baseApi.get<T>(url).then(responseBody),
    post: <T,>(url: string, body: object) => baseApi.post<T>(url, body).then(responseBody),
    put: <T,>(url: string, body: object) => baseApi.put<T>(url, body).then(responseBody),
    del: <T,>(url: string) => baseApi.delete<T>(url).then(responseBody),
};

const agent = {
    Auth: {
        login: (body: { email: string; password: string }) =>
            requests.post('/auth/login', body),
    },

    News: {
        list: () => requests.get('/admin/news'),
    },

    Documents: {
        list: (page = 1, pageSize = 10, search = '') => 
            requests.get<any>(`/admin/documents?page=${page}&pageSize=${pageSize}&search=${search}`),
        details: (id: number) => requests.get<any>(`/admin/documents/${id}`),
        create: (doc: FormData) => requests.post<void>('/admin/documents', doc),
        update: (id: number, doc: FormData) => requests.put<void>(`/admin/documents/${id}`, doc),
        delete: (id: number) => requests.del<void>(`/admin/documents/${id}`),
        categories: () => requests.get<any[]>('/documents/categories'), 
    },

    AdministrationMembers: {
        list: () => requests.get('/admin/administration-members'),
    },

    UsefulInformation: {
        list: () => requests.get('/admin/external-links'),
    },

    Categories: {
        list: () => requests.get('/admin/document-categories'),
    },
};

export default agent;