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
     details: (id: number) => requests.get<any>(`/admin/news/${id}`),
     create: (news: FormData) => requests.post<void>('/admin/news', news),
     update: (id: number, news: FormData) => requests.put<void>(`/admin/news/${id}`, news),
    
     delete: (id: number) => requests.del<void>(`/admin/news/${id}`),
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
        list: () => requests.get<any>('/admin/administration'),
        details: (id: number) => requests.get<any>(`/admin/administration/${id}`), 
        create: (data: FormData) => requests.post<void>('/admin/administration', data),
        update: (id: number, data: FormData) => requests.put<void>(`/admin/administration/${id}`, data),
        delete: (id: number) => requests.del<void>(`/admin/administration/${id}`),
        reorder: (id: number, targetPosition: number) => 
            baseApi.patch('/admin/administration/reorder', { id, targetPosition })
    },

    UsefulInformation: {
        list: () => requests.get<any>('/admin/external-links'),
    },

    Categories: {
        list: () => requests.get<any>('/admin/document-categories'),
    },
};

export default agent;