import { baseApi } from './baseApi';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string | null;
    errors?: string[] | null;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponseDto {
    token: string;
    username: string;
    roles: string[];
}

export interface CategoryAdminDto {
    id: number;
    nameUa: string;
    nameEn: string;
    documentsCount: number;
}

export interface AdminTagDto {
    id: number;
    nameUa: string;
    nameEn: string;
    newsCount: number;
}

export interface CategoryCreateUpdateDto {
    nameUa: string;
    nameEn: string;
}

export interface TagCreateUpdateDto {
    nameUa: string;
    nameEn: string;
}

const responseBody = <T,>(response: { data: T }) => response.data;

const requests = {
    get: <T,>(url: string) => baseApi.get<T>(url).then(responseBody),
    post: <T,>(url: string, body: object) => baseApi.post<T>(url, body).then(responseBody),
    put: <T,>(url: string, body: object) => baseApi.put<T>(url, body).then(responseBody),
    del: <T,>(url: string) => baseApi.delete<T>(url).then(responseBody),
};

const agent = {
    Auth: {
    login: (body: LoginDto) =>
        requests.post<ApiResponse<AuthResponseDto>>('/admin/auth/login', body),
    },
   News: {
    list: (page = 1, pageSize = 50, search = '') =>
        requests.get<any>(
            `/admin/news?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
        ),

    eventsList: (page = 1, pageSize = 50, search = '') =>
        requests.get<any>(
            `/admin/news/events?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
        ),

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

    internalAssessment: (page = 1, pageSize = 10, search = '') =>
        requests.get<any>(
            `/admin/documents/internal-assessment?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
        ),

    externalAssessment: (page = 1, pageSize = 10, search = '') =>
        requests.get<any>(
            `/admin/documents/external-assessment?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
        ),

    internalCategoryId: () =>
        requests.get<ApiResponse<number>>('/documents/categories/internal-id'),

    externalCategoryId: () =>
        requests.get<ApiResponse<number>>('/documents/categories/external-id'),
    },

    AdministrationMembers: {
        list: () => requests.get<any>('/admin/administration'),
        details: (id: number) => requests.get<any>(`/admin/administration/${id}`),
        create: (data: FormData) => requests.post<void>('/admin/administration', data),
        update: (id: number, data: FormData) => requests.put<void>(`/admin/administration/${id}`, data),
        delete: (id: number) => requests.del<void>(`/admin/administration/${id}`),
        reorder: (id: number, targetPosition: number) =>
            baseApi.patch('/admin/administration/reorder', { id, targetPosition }).then((r) => r.data),
    },

    UsefulInformation: {
        list: () => requests.get<any[]>('/admin/external-links'),
        details: (id: number) => requests.get<any>(`/admin/external-links/${id}`),
        create: (data: FormData) => requests.post<void>('/admin/external-links', data),
        update: (id: number, data: FormData) => requests.put<void>(`/admin/external-links/${id}`, data),
        delete: (id: number) => requests.del<void>(`/admin/external-links/${id}`),
        reorder: (id: number, targetPosition: number) =>
            baseApi.patch(`/admin/external-links/${id}/reorder?targetPosition=${targetPosition}`).then((r) => r.data),
    },

    Categories: {
        list: () => requests.get<ApiResponse<CategoryAdminDto[]>>('/admin/categories'),
        details: (id: number) => requests.get<ApiResponse<CategoryAdminDto>>(`/admin/categories/${id}`),
        create: (data: CategoryCreateUpdateDto) =>
            requests.post<ApiResponse<CategoryAdminDto>>('/admin/categories', data),
        update: (id: number, data: CategoryCreateUpdateDto) =>
            requests.put<ApiResponse<boolean>>(`/admin/categories/${id}`, data),
        delete: (id: number) =>
            requests.del<ApiResponse<boolean>>(`/admin/categories/${id}`),
    },

    Tags: {
    list: () => requests.get<ApiResponse<AdminTagDto[]>>('/admin/tags'),
    details: (id: number) => requests.get<ApiResponse<AdminTagDto>>(`/admin/tags/${id}`),
    create: (data: TagCreateUpdateDto) =>
        requests.post<ApiResponse<AdminTagDto>>('/admin/tags', data),
    update: (id: number, data: TagCreateUpdateDto) =>
        requests.put<ApiResponse<boolean>>(`/admin/tags/${id}`, data),
    delete: (id: number) =>
        requests.del<ApiResponse<boolean>>(`/admin/tags/${id}`),

    eventsTagId: () =>
        requests.get<ApiResponse<number>>('/tags/events-id'),
    },
};

export default agent;