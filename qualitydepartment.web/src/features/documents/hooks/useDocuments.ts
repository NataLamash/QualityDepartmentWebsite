import { useEffect, useMemo, useState } from 'react';
import agent from '../../../api/agent';
import { getDocumentPageText } from '../documentTexts';
import {
    filterAndSortDocuments,
    getUniqueTags,
    normalizeCategory,
    normalizeDocument,
} from '../utils/documentUtils';
import type {
    ApiCategory,
    ApiDocument,
    Lang,
    SortMode,
    UiCategory,
    UiDocument,
} from '../types';

interface UseDocumentsParams {
    lang: Lang;
    search: string;
    selectedCategory: string;
    selectedTag: string;
    sortMode: SortMode;
}

export const useDocuments = ({
    lang,
    search,
    selectedCategory,
    selectedTag,
    sortMode,
}: UseDocumentsParams) => {
    const [documents, setDocuments] = useState<UiDocument[]>([]);
    const [categories, setCategories] = useState<UiCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const text = getDocumentPageText(lang);

    useEffect(() => {
        let isMounted = true;

        const loadDocuments = async () => {
            setLoading(true);
            setError('');

            try {
                const [documentsResponse, categoriesResponse] = await Promise.all([
                    agent.Documents.list(lang),
                    agent.Documents.categories(lang),
                ]);

                if (!isMounted) return;

                setDocuments(
                    documentsResponse.items.map((item: ApiDocument) =>
                        normalizeDocument(item, lang, text.withoutCategory)
                    )
                );

                setCategories(
                    (categoriesResponse as ApiCategory[]).map((item) =>
                        normalizeCategory(item, lang)
                    )
                );
            } catch (err) {
                console.error('Documents load error:', err);

                if (isMounted) {
                    setError(text.error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadDocuments();

        return () => {
            isMounted = false;
        };
    }, [lang, text.error, text.withoutCategory]);

    const allTags = useMemo(() => getUniqueTags(documents, lang), [documents, lang]);

    const filteredDocuments = useMemo(
        () =>
            filterAndSortDocuments({
                documents,
                search,
                selectedCategory,
                selectedTag,
                sortMode,
                lang,
            }),
        [documents, search, selectedCategory, selectedTag, sortMode, lang]
    );

    return {
        loading,
        error,
        categories,
        allTags,
        filteredDocuments,
    };
};