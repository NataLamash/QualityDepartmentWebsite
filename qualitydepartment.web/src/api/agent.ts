import axios, { type AxiosResponse } from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export interface NewsItem {
    id: number;
    title: string;
    photoPath: string;
    publishDate: string;
    content?: string;
}

export interface AdministrationMember {
    id: number;
    fullName: string;
    position: string;
    photoPath: string;
    sortOrder: number;
}

export interface DocumentsListResponse {
    items: DocumentItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface DocumentItem {
    id: number;
    filePath: string;
    publishDate: string;
    createdAt?: string;
    updatedAt?: string | null;
    categoryId?: number;
    categoryName?: string;
    name?: string;
    nameUa?: string;
    nameEn?: string;
    description?: string;
    descriptionUa?: string | null;
    descriptionEn?: string | null;
    externalType?: boolean;
    tags?: string[] | string;
    [key: string]: unknown;
}

export interface DocumentCategoryItem {
    id: number;
    name?: string;
    nameUa?: string;
    nameEn?: string;
    [key: string]: unknown;
}

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
}

const responseBody = <T>(response: AxiosResponse<{ data: T }>) => response.data.data;

axios.interceptors.response.use(
    async (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 400:
                    console.error('Невірний запит');
                    break;
                case 401:
                    console.error('Неавторизовано');
                    break;
                case 404:
                    console.error('Маршрут не знайдено');
                    break;
                case 500:
                    console.error('Помилка сервера');
                    break;
            }
        }
        return Promise.reject(error);
    }
);

const requests = {
    get: <T>(url: string) =>
        axios.get<{ data: T }>(url).then((res) => responseBody<T>(res)),
    post: <T>(url: string, body: object) =>
        axios.post<{ data: T }>(url, body).then((res) => responseBody<T>(res)),
};

const agent = {
    Administration: {
        list: (lang: string) =>
            requests.get<AdministrationMember[]>(`/home/administration?lang=${lang}`),
    },
    News: {
        list: (count: number, lang: string) =>
            requests.get<NewsItem[]>(`/home/latest-news?count=${count}&lang=${lang}`),

        listPaged: (
            page: number,
            pageSize: number,
            lang: string,
            sortOrder: string,
            search?: string,
            date?: string
        ) => {
            let url = `/news?page=${page}&pageSize=${pageSize}&lang=${lang}&sortOrder=${sortOrder}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (date) url += `&date=${date}`;
            return requests.get<PagedResponse<NewsItem>>(url);
        },

        details: (id: number, lang: string) =>
            requests.get<NewsItem>(`/news/${id}?lang=${lang}`),
    },
    Documents: {
    list: (lang: string) =>
        requests.get<DocumentsListResponse>(`/documents?lang=${lang}`),
    categories: (lang: string) =>
        requests.get<DocumentCategoryItem[]>(`/documents/categories?lang=${lang}`),
    },
};

export default agent;