import { useEffect, useMemo, useState } from 'react';
import agent, { type BaseDocumentParams, type DocumentListParams } from '../../../api/agent';
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
    isQualityPage?: boolean; 
}

export const useDocuments = ({
    lang,
    search,
    selectedCategory,
    selectedTag,
    sortMode,
    isQualityPage = false,
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
                if (isQualityPage) {
                    
                    setCategories([
                        { id: 1, name: lang === 'en' ? 'Internal Quality Evaluation' : 'Внутрішнє оцінювання якості' },
                        { id: 2, name: lang === 'en' ? 'External Quality Evaluation' : 'Зовнішнє оцінювання якості' }
                    ]);

                    const queryParams: BaseDocumentParams = {
                        lang,
                        pageNumber: 1,
                        pageSize: 100, 
                    };

                    const [internalRes, externalRes] = await Promise.all([
                        agent.QualityAssessment.getInternal(queryParams),
                        agent.QualityAssessment.getExternal(queryParams)
                    ]);

                    if (!isMounted) return;

                    const internalDocs = (internalRes.items || []).map((item: ApiDocument) => ({
                        ...normalizeDocument(item, lang, text.withoutCategory),
                        categoryName: 'Внутрішнє оцінювання якості'
                    }));

                    const externalDocs = (externalRes.items || []).map((item: ApiDocument) => ({
                        ...normalizeDocument(item, lang, text.withoutCategory),
                        categoryName: 'Зовнішнє оцінювання якості'
                    }));

                    setDocuments([...internalDocs, ...externalDocs]);

                } else {
                    
                    const categoriesResponse = await agent.Documents.categories(lang);

                    if (!isMounted) return;

                    const fetchedCategories = (categoriesResponse as ApiCategory[]).map((item) =>
                        normalizeCategory(item, lang)
                    );

                    const filteredCategories = fetchedCategories.filter(
                        (c) => c.name !== 'Внутрішнє оцінювання якості' && c.name !== 'Зовнішнє оцінювання якості' &&
                            c.name !== 'Internal Quality Evaluation' && c.name !== 'External Quality Evaluation'
                    );
                    setCategories(filteredCategories);

                    const documentParams: DocumentListParams = {
                        lang,
                        pageNumber: 1,
                        pageSize: 100,
                    };

                    const documentsResponse = await agent.Documents.list(documentParams);

                    if (!isMounted) return;

                    const apiItems = documentsResponse.items || documentsResponse;
                    setDocuments(
                        apiItems.map((item: ApiDocument) =>
                            normalizeDocument(item, lang, text.withoutCategory)
                        )
                    );
                }
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
    }, [lang, text.error, text.withoutCategory, isQualityPage]);

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