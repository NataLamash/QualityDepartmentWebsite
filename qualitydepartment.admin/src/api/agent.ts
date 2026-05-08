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
            requests.post<any>('/auth/login', body),
    },
    News: {
     list: (page = 1, pageSize = 50) => 
        requests.get<any>(`/admin/news?pageNumber=${page}&pageSize=${pageSize}`),
    
     create: (news: FormData) => requests.post<void>('/admin/news', news),
     update: (id: number, news: FormData) => requests.put<void>(`/admin/news/${id}`, news),
    
     delete: (id: number) => requests.del<void>(`/admin/news/${id}`),
    },

    Documents: {
        list: () => requests.get<any>('/admin/documents'),
        create: (data: FormData) => requests.post<void>('/admin/documents', data),
        delete: (id: number) => requests.del<void>(`/admin/documents/${id}`),
    },

    AdministrationMembers: {
        list: () => requests.get<any>('/admin/administration-members'),
        create: (data: FormData) => requests.post<void>('/admin/administration-members', data),
        update: (id: number, data: FormData) => baseApi.put(`/admin/administration-members/${id}`, data).then(responseBody),
        delete: (id: number) => requests.del<void>(`/admin/administration-members/${id}`),
    },

    UsefulInformation: {
        list: () => requests.get<any>('/admin/external-links'),
    },

    Categories: {
        list: () => requests.get<any>('/admin/document-categories'),
    },
};

export default agent;