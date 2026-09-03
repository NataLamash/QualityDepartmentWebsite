import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDocuments } from './hooks/useDocuments';
import { getLang } from './utils/documentUtils';
import type { SortMode, UiDocument, ViewMode } from './types';
import {
    emptyTextSx,
    errorTextSx,
    loadMoreButtonSx,
    loadMoreWrapSx,
    pageContainerSx,
    pageTitleSx,
} from './document.styles';
import DocumentsTopBar from './components/DocumentsTopBar';
import DocumentsFilterPopover from './components/DocumentsFilterPopover';
import DocumentsListView from './components/DocumentsListView';
import DocumentsGridView from './components/DocumentsGridView';
import DocumentPreviewDialog from './components/DocumentPreviewDialog';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

interface DocumentPageProps {
    isQualityPage?: boolean;
}

export default function DocumentPage({ isQualityPage = false }: DocumentPageProps) {
    const { t, i18n } = useTranslation();
    const lang = getLang(i18n.language);
    const [searchParams] = useSearchParams();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('icons');

    const [tempSearch, setTempSearch] = useState('');
    const [tempCategory, setTempCategory] = useState('all');
    const [tempDate, setTempDate] = useState('');
    const [tempSort, setTempSort] = useState<SortMode>('date-desc');

    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedCategory, setAppliedCategory] = useState('all');
    const [appliedDate, setAppliedDate] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('date-desc');

    const [visibleCount, setVisibleCount] = useState(8);

    const [previewDocument, setPreviewDocument] = useState<UiDocument | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        let targetCategory = 'all';

        if (isQualityPage && categoryParam) {
            if (categoryParam === 'internal') {
                targetCategory = 'Внутрішнє оцінювання якості';
            } else if (categoryParam === 'external') {
                targetCategory = 'Зовнішнє оцінювання якості';
            }
        }

        setTempCategory(targetCategory);
        setTempSearch('');
        setTempDate('');
        setTempSort('date-desc');

        setAppliedCategory(targetCategory);
        setAppliedSearch('');
        setAppliedDate('');
        setSortMode('date-desc');
        setVisibleCount(8);
    }, [isQualityPage, searchParams]);

    const { loading, error, categories, filteredDocuments } = useDocuments({
        lang,
        search: appliedSearch,
        selectedCategory: appliedCategory,
        selectedTag: 'all',
        sortMode,
        isQualityPage,
    });

    const dateFilteredDocuments = useMemo(() => {
        if (!appliedDate) return filteredDocuments;

        return filteredDocuments.filter((doc) => {
            if (!doc.publishDate) return false;

            const docDate = new Date(doc.publishDate);
            if (Number.isNaN(docDate.getTime())) return false;

            const yyyy = docDate.getFullYear();
            const mm = String(docDate.getMonth() + 1).padStart(2, '0');
            const dd = String(docDate.getDate()).padStart(2, '0');
            const normalized = `${yyyy}-${mm}-${dd}`;

            return normalized === appliedDate;
        });
    }, [filteredDocuments, appliedDate]);

    const visibleDocuments = useMemo(() => {
        return dateFilteredDocuments.slice(0, visibleCount);
    }, [dateFilteredDocuments, visibleCount]);

    const handleApplyFilters = () => {
        setVisibleCount(8);
        setAppliedSearch(tempSearch.trim());
        setAppliedCategory(tempCategory);
        setAppliedDate(tempDate);
        setSortMode(tempSort);
        setAnchorEl(null);
    };

    const handleToggleSort = () => {
        const nextSort = sortMode === 'date-desc' ? 'date-asc' : 'date-desc';
        setVisibleCount(8);
        setSortMode(nextSort);
        setTempSort(nextSort);
    };

    const handleToggleView = () => {
        setViewMode((prev) => (prev === 'icons' ? 'cards' : 'icons'));
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    const getFullFilePath = (path: string) => {
        if (!path) return '#';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;

        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    const handleDownloadDocument = async (documentItem: UiDocument) => {
        try {
            const fileUrl = getFullFilePath(documentItem.filePath);
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            const safeName = (documentItem.title || 'document')
                .replace(/[<>:"/\\|?*]+/g, '_')
                .trim();
            const fileName = safeName.toLowerCase().endsWith('.pdf')
                ? safeName
                : `${safeName || 'document'}.pdf`;

            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download error:', err);
        }
    };

    const isPdfFile = (path: string) => path.toLowerCase().endsWith('.pdf');

    const handleOpenPreview = (documentItem: UiDocument) => {
        if (!documentItem.filePath || !isPdfFile(documentItem.filePath)) return;

        setPreviewDocument(documentItem);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewDocument(null);
    };

    return (
        <Container maxWidth="xl" sx={pageContainerSx}>
            <Typography component="h1" variant="h2" align="center" sx={pageTitleSx}>
                {isQualityPage ? t('pages.qualityEvaluation') : t('pages.documents')}
            </Typography>

            {isQualityPage && (
                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        mt: -2,
                        mb: 5,
                        color: '#666',
                        fontWeight: 600,
                        fontSize: { xs: '1.2rem', md: '1.5rem' }
                    }}
                >
                    {appliedCategory === 'all'
                        ? t('filters.allSections')
                        : (lang === 'en'
                            ? (appliedCategory === 'Внутрішнє оцінювання якості' ? t('header.internalQuality') : t('header.externalQuality'))
                            : appliedCategory
                        )
                    }
                </Typography>
            )}

            <DocumentsTopBar
                filtersLabel={t('filters.filters')}
                viewMode={viewMode}
                onOpenFilters={(e) => setAnchorEl(e.currentTarget)}
                onToggleView={handleToggleView}
                onToggleSort={handleToggleSort}
                isAscendingSort={sortMode === 'date-asc'}
            />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: '#BA0000' }} />
                </Box>
            )}

            {!loading && !!error && (
                <Typography component="p" sx={errorTextSx}>
                    {t('filters.errorLoading')}
                </Typography>
            )}

            {!loading && !error && dateFilteredDocuments.length === 0 && (
                <Typography component="p" sx={emptyTextSx}>
                    {t('filters.noDocuments')}
                </Typography>
            )}

            {!loading && !error && dateFilteredDocuments.length > 0 && viewMode === 'icons' && (
                <DocumentsListView
                    documents={visibleDocuments}
                    lang={lang}
                    namePlaceholder={t('filters.titlePlaceholder')}
                    getFullFilePath={getFullFilePath}
                    onPreview={handleOpenPreview}
                    onDownload={handleDownloadDocument}
                />
            )}

            {!loading && !error && dateFilteredDocuments.length > 0 && viewMode === 'cards' && (
                <DocumentsGridView
                    documents={visibleDocuments}
                    lang={lang}
                    namePlaceholder={t('filters.titlePlaceholder')}
                    getFullFilePath={getFullFilePath}
                    onPreview={handleOpenPreview}
                    onDownload={handleDownloadDocument}
                />
            )}

            {!loading && !error && visibleDocuments.length < dateFilteredDocuments.length && (
                <Box sx={loadMoreWrapSx}>
                    <Button
                        onClick={handleLoadMore}
                        variant="outlined"
                        startIcon={
                            <Box
                                component="img"
                                src="/material-symbols_replay.png"
                                alt=""
                                aria-hidden="true"
                                sx={{ width: 22 }}
                            />
                        }
                        sx={{
                            ...loadMoreButtonSx,
                            '&:focus-visible': { outline: '2px solid #BA0000', outlineOffset: '2px' }
                        }}
                    >
                        {t('filters.loadMore')}
                    </Button>
                </Box>
            )}

            <DocumentsFilterPopover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                onApply={handleApplyFilters}
                title={t('filters.filters')}
                categoryLabel={t('filters.category')}
                dateLabel={t('filters.chooseDate')}
                searchLabel={t('filters.search')}
                sortLabel={t('filters.sorting')}
                applyLabel={t('filters.apply')}
                allCategoriesLabel={t('filters.allCategories')}
                newestLabel={t('filters.newest')}
                oldestLabel={t('filters.oldest')}
                azLabel={t('filters.az')}
                zaLabel={t('filters.za')}
                categories={categories}
                tempCategory={tempCategory}
                tempDate={tempDate}
                tempSearch={tempSearch}
                tempSort={tempSort}
                onCategoryChange={setTempCategory}
                onDateChange={setTempDate}
                onSearchChange={setTempSearch}
                onSortChange={setTempSort}
                isQualityPage={isQualityPage}
            />

            <DocumentPreviewDialog
                open={isPreviewOpen}
                documentItem={previewDocument}
                fileUrl={previewDocument ? getFullFilePath(previewDocument.filePath) : ''}
                onClose={handleClosePreview}
                onDownload={handleDownloadDocument}
            />
        </Container>
    );
}