import axios, { type AxiosResponse } from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export interface DocumentCategoryParams {
    lang: string;
    isQualityEvaluation?: boolean;
}

export interface DocumentListParams {
    lang: string;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    categoryIds?: number[];
    exceptCategoryIds?: number[];
}

export interface NewsItem {
    id: number;
    title: string;
    photoPath: string;
    publishDate: string;
    fullText?: string;
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

export interface GlobalSearchResultItem {
    type: 'News' | 'Document' | 'ExternalLink' | string;
    id: number;
    title: string;
    shortDescription?: string | null;
    link: string;
    publishDate: string;
}

export interface ExternalLink {
    id: number;
    url: string;
    name: string;
    photoPath: string;
    shortDescription: string;
    sortOrder: number;
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
    get: <T>(url: string, config?: object) =>
        axios.get<{ data: T }>(url, config).then((res) => responseBody<T>(res)),
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
        list: (params: DocumentListParams) =>
            requests.get<DocumentsListResponse>('/documents', { params }),

        categories: (params: DocumentCategoryParams) =>
            requests.get<DocumentCategoryItem[]>('/documents/categories', { params }),
    },
    ExternalLinks: {
        list: (lang: string) =>
            requests.get<ExternalLink[]>(`/external-links?lang=${lang}`),
    },
    Search: {
        global: (query: string, lang: string) =>
            requests.get<GlobalSearchResultItem[]>(`/search?query=${encodeURIComponent(query)}&lang=${lang}`),
    },
};

export default agent;