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
        list: () => requests.get('/admin/documents'),
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