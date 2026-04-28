import type {
    ApiCategory,
    ApiDocument,
    Lang,
    SortMode,
    UiCategory,
    UiDocument,
} from '../types';

export const getLang = (language: string): Lang =>
    language?.startsWith('en') ? 'en' : 'ua';

const localeByLang = (lang: Lang) => (lang === 'en' ? 'en' : 'uk');

export const normalizeTags = (value: unknown, lang: Lang): string[] => {
    if (!value) return [];

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') return item.trim();

                if (item && typeof item === 'object') {
                    const obj = item as Record<string, unknown>;
                    return String(
                        obj.name ??
                            (lang === 'en' ? obj.nameEn : obj.nameUa) ??
                            obj.title ??
                            ''
                    ).trim();
                }

                return '';
            })
            .filter(Boolean);
    }

    return [];
};

export const normalizeCategory = (
    category: ApiCategory,
    lang: Lang
): UiCategory => ({
    id: Number(category.id),
    name: String(
        category.name ??
            (lang === 'en' ? category.nameEn : category.nameUa) ??
            category.nameUa ??
            category.nameEn ??
            `Category ${category.id}`
    ),
});

export const normalizeDocument = (
    document: ApiDocument,
    lang: Lang,
    withoutCategoryText: string
): UiDocument => {
    const title = String(
        document.name ??
            (lang === 'en' ? document.nameEn : document.nameUa) ??
            document.nameUa ??
            document.nameEn ??
            `Document #${document.id}`
    );

    const description = String(
        document.description ??
            (lang === 'en' ? document.descriptionEn : document.descriptionUa) ??
            document.descriptionUa ??
            document.descriptionEn ??
            ''
    );

    const categoryName = String(
        document.categoryName ??
            (lang === 'en' ? document.categoryNameEn : document.categoryNameUa) ??
            document.category?.name ??
            (lang === 'en' ? document.category?.nameEn : document.category?.nameUa) ??
            document.category?.nameUa ??
            document.category?.nameEn ??
            withoutCategoryText
    );

    const categoryId =
        typeof document.categoryId === 'number'
            ? document.categoryId
            : typeof document.category?.id === 'number'
              ? document.category.id
              : undefined;

    return {
        id: document.id,
        title,
        description,
        filePath: String(document.filePath ?? ''),
        publishDate: String(document.publishDate ?? document.createdAt ?? ''),
        createdAt: document.createdAt,
        categoryId,
        categoryName,
        tags: normalizeTags(
            document.tags ?? document.tagNames ?? document.tagList,
            lang
        ),
    };
};

export const formatDate = (value: string | undefined, lang: Lang) => {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
};

export const getUniqueTags = (documents: UiDocument[], lang: Lang) => {
    return [...new Set(documents.flatMap((doc) => doc.tags))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, localeByLang(lang)));
};

const getDateValue = (value: string) => {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
};

export const filterAndSortDocuments = ({
    documents,
    search,
    selectedCategory,
    sortMode,
    lang,
}: {
    documents: UiDocument[];
    search: string;
    selectedCategory: string;
    selectedTag: string;
    sortMode: SortMode;
    lang: Lang;
}) => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = documents.filter((doc) => {
        const matchesSearch =
            !normalizedSearch ||
            doc.title.toLowerCase().includes(normalizedSearch) ||
            doc.description.toLowerCase().includes(normalizedSearch) ||
            doc.categoryName.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
            selectedCategory === 'all' ||
            String(doc.categoryId) === selectedCategory ||
            doc.categoryName.toLowerCase() === selectedCategory.toLowerCase();


        return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
        switch (sortMode) {
            case 'date-asc':
                return getDateValue(a.publishDate) - getDateValue(b.publishDate);
            case 'date-desc':
                return getDateValue(b.publishDate) - getDateValue(a.publishDate);
            case 'name-asc':
                return a.title.localeCompare(b.title, localeByLang(lang));
            case 'name-desc':
                return b.title.localeCompare(a.title, localeByLang(lang));
            default:
                return 0;
        }
    });
};