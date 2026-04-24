export type ViewMode = 'cards' | 'icons';
export type SortMode = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';
export type Lang = 'ua' | 'en';

export interface UiDocument {
    id: number;
    title: string;
    description: string;
    filePath: string;
    publishDate: string;
    createdAt?: string;
    categoryId?: number;
    categoryName: string;
    tags: string[];
}

export interface UiCategory {
    id: number;
    name: string;
}

export interface ApiCategory {
    id: number;
    name?: string;
    nameUa?: string;
    nameEn?: string;
    [key: string]: unknown;
}

export interface ApiDocument {
    id: number;
    filePath?: string;
    publishDate?: string;
    createdAt?: string;
    updatedAt?: string | null;
    categoryId?: number;
    categoryName?: string;
    categoryNameUa?: string;
    categoryNameEn?: string;
    name?: string;
    nameUa?: string;
    nameEn?: string;
    description?: string;
    descriptionUa?: string | null;
    descriptionEn?: string | null;
    externalType?: boolean;
    tags?: string[] | string;
    tagNames?: string[] | string;
    tagList?: string[] | string;
    category?: {
        id?: number;
        name?: string;
        nameUa?: string;
        nameEn?: string;
        [key: string]: unknown;
    } | null;
    [key: string]: unknown;
}

export interface DocumentPageText {
    pageTitle: string;
    pageSubtitle: string;
    search: string;
    category: string;
    tag: string;
    sort: string;
    allCategories: string;
    allTags: string;
    noTags: string;
    newest: string;
    oldest: string;
    az: string;
    za: string;
    cards: string;
    icons: string;
    published: string;
    found: string;
    items: string;
    empty: string;
    error: string;
    reset: string;
    withoutCategory: string;
}