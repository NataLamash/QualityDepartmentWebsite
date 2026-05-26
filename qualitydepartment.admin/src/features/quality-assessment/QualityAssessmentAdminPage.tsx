import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PageHeader from '../../components/ui/PageHeader';
import agent from '../../api/agent';
import DocumentForm from '../documents/DocumentForm';
import { useNavigate } from 'react-router-dom';

type QualityAssessmentMode = 'internal' | 'external';

interface Props {
    mode: QualityAssessmentMode;
}

export default function QualityAssessmentAdminPage({ mode }: Props) {
    const navigate = useNavigate();

    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const isInternal = mode === 'internal';

    const pageTitle = 'Оцінювання якості вищої освіти';
    const tabValue = isInternal ? '/quality-assessment/internal' : '/quality-assessment/external';
    const categoryLabel = isInternal
        ? 'Внутрішнє оцінювання якості'
        : 'Зовнішнє оцінювання якості';

    const formTitle = selectedDocument
        ? isInternal
            ? 'Редагування документа внутрішнього оцінювання'
            : 'Редагування документа зовнішнього оцінювання'
        : isInternal
            ? 'Створення документа внутрішнього оцінювання'
            : 'Створення документа зовнішнього оцінювання';

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const response = isInternal
                ? await agent.Documents.internalAssessment(1, 50, search)
                : await agent.Documents.externalAssessment(1, 50, search);

            const items = response?.data?.items || response?.items || [];
            setDocuments(items);
        } catch (error) {
            console.error('Помилка завантаження документів оцінювання:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoryId = async () => {
        try {
            const response = isInternal
                ? await agent.Documents.internalCategoryId()
                : await agent.Documents.externalCategoryId();

            setCategoryId(response?.data ?? null);
        } catch (error) {
            console.error('Помилка отримання category id:', error);
        }
    };

    useEffect(() => {
        void loadDocuments();
        void loadCategoryId();
    }, [mode]);

    const handleSearch = async () => {
        await loadDocuments();
    };

    const handleOpenCreate = () => {
        setSelectedDocument(null);
        setOpen(true);
    };

    const handleOpenEdit = (doc: any) => {
        setSelectedDocument(doc);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDocument(null);
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Ви впевнені, що хочете видалити документ?');
        if (!ok) return;

        try {
            await agent.Documents.delete(id);
            await loadDocuments();
        } catch (error) {
            console.error('Помилка видалення документа:', error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('uk-UA');
    };

    const isPublished = (dateString?: string) => {
        if (!dateString) return false;
        return new Date(dateString) <= new Date();
    };

    return (
        <Box>
            <PageHeader
                title={pageTitle}
                description="Окремий модуль для документів внутрішнього та зовнішнього оцінювання якості."
            />

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '24px',
                    border: '1px solid #EAEAEA',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    mb: 3,
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={(_, value) => navigate(value)}
                    sx={{
                        mb: 3,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 700,
                        },
                        '& .Mui-selected': {
                            color: '#B80000 !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#B80000',
                        },
                    }}
                >
                    <Tab
                        value="/quality-assessment/internal"
                        label="Внутрішнє оцінювання"
                    />
                    <Tab
                        value="/quality-assessment/external"
                        label="Зовнішнє оцінювання"
                    />
                </Tabs>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                >
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1 }}>
                        <TextField
                            label="Пошук документа"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <Button
                            variant="outlined"
                            onClick={handleSearch}
                            sx={{
                                borderColor: '#B80000',
                                color: '#B80000',
                                minWidth: 140,
                                '&:hover': {
                                    borderColor: '#8e0000',
                                    backgroundColor: 'rgba(184,0,0,0.04)',
                                },
                            }}
                        >
                            Пошук
                        </Button>
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleOpenCreate}
                        sx={{
                            bgcolor: '#B80000',
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontWeight: 700,
                            '&:hover': {
                                bgcolor: '#8e0000',
                            },
                        }}
                    >
                        Додати документ
                    </Button>
                </Stack>

                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={categoryLabel}
                        sx={{
                            bgcolor: 'rgba(184,0,0,0.08)',
                            color: '#B80000',
                            fontWeight: 700,
                        }}
                    />
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Назва</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Категорія</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        Немає документів
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documents.map((doc) => (
                                    <TableRow key={doc.id} hover>
                                        <TableCell>{doc.nameUa || doc.name || '—'}</TableCell>
                                        <TableCell>{doc.categoryName || categoryLabel}</TableCell>
                                        <TableCell>{formatDate(doc.publishDate)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={isPublished(doc.publishDate) ? 'Опубліковано' : 'Заплановано'}
                                                color={isPublished(doc.publishDate) ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenEdit(doc)} color="primary">
                                                <EditRoundedIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(doc.id)} color="error">
                                                <DeleteRoundedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#B80000' }}>
                    {formTitle}
                </DialogTitle>

                <DialogContent>
                    <DocumentForm
                        key={`${mode}-${selectedDocument?.id ?? 'new'}`}
                        initialData={selectedDocument}
                        forcedCategoryId={categoryId}
                        forcedCategoryName={categoryLabel}
                        onSuccess={() => {
                            handleClose();
                            void loadDocuments();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}