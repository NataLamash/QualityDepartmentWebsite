import type { DocumentPageText, Lang } from './types';

export const getDocumentPageText = (lang: Lang): DocumentPageText => {
    if (lang === 'en') {
        return {
            pageTitle: 'Documents',
            pageSubtitle: 'Search, filter and browse department documents.',
            search: 'Search by title or description',
            category: 'Category',
            tag: 'Tag',
            sort: 'Sorting',
            allCategories: 'All categories',
            allTags: 'All tags',
            noTags: 'No tags from API yet',
            newest: 'Newest first',
            oldest: 'Oldest first',
            az: 'Alphabetically A–Z',
            za: 'Alphabetically Z–A',
            cards: 'Cards',
            icons: 'Icons',
            published: 'Published',
            found: 'Found',
            items: 'items',
            empty: 'No documents match the selected filters.',
            error: 'Failed to load documents.',
            reset: 'Clear filters',
            withoutCategory: 'Without category',
        };
    }

    return {
        pageTitle: 'Документи',
        pageSubtitle: 'Пошук, фільтрація та перегляд документів кафедри.',
        search: 'Пошук за назвою або описом',
        category: 'Категорія',
        tag: 'Тег',
        sort: 'Сортування',
        allCategories: 'Усі категорії',
        allTags: 'Усі теги',
        noTags: 'Теги ще не приходять з API',
        newest: 'Спочатку нові',
        oldest: 'Спочатку старі',
        az: 'За алфавітом А–Я',
        za: 'За алфавітом Я–А',
        cards: 'Картки',
        icons: 'Іконки',
        published: 'Опубліковано',
        found: 'Знайдено',
        items: 'документів',
        empty: 'Немає документів, що відповідають вибраним фільтрам.',
        error: 'Не вдалося завантажити документи.',
        reset: 'Скинути фільтри',
        withoutCategory: 'Без категорії',
    };
};