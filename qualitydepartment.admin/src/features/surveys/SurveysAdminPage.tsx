import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PageHeader from '../../components/ui/PageHeader';
import agent from '../../api/agent';

interface SurveyLinkItem {
    id: number;
    nameUa?: string;
    nameEn?: string;
    name?: string;
    shortDescriptionUa?: string;
    shortDescriptionEn?: string;
    shortDescription?: string;
    url: string;
    publishDate?: string;
    sortOrder?: number;
    photoPath?: string | null;
}

interface SurveyFormValues {
    nameUa: string;
    nameEn: string;
    shortDescriptionUa: string;
    shortDescriptionEn: string;
    url: string;
    publishDate: string;
    sortOrder: number;
    photo: File | null;
}

const isGoogleFormUrl = (url?: string | null) => {
    if (!url) return false;

    const lower = url.toLowerCase();
    return lower.includes('docs.google.com/forms') || lower.includes('forms.gle');
};

const normalizeGoogleFormUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '';

    if (trimmed.includes('<iframe')) {
        const match = trimmed.match(/src="([^"]+)"/i);
        if (match?.[1]) {
            return normalizeGoogleFormUrl(match[1]);
        }
    }

    const withoutPli = trimmed
        .replace(/([?&])pli=1(&|$)/i, '$1')
        .replace(/[?&]$/, '');

    if (withoutPli.includes('embedded=true')) {
        return withoutPli;
    }

    return withoutPli.includes('?')
        ? `${withoutPli}&embedded=true`
        : `${withoutPli}?embedded=true`;
};

const formatDateTimeLocal = (date?: string) => {
    if (!date) return '';

    const normalizedDate = date.endsWith('Z') ? date : `${date}Z`;
    const parsed = new Date(normalizedDate);

    if (Number.isNaN(parsed.getTime())) return '';

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getApiError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            status?: number;
            data?: {
                errors?: string[] | null;
                message?: string | null;
            };
        };
        message?: string;
    };

    if (maybeAxios.response?.status === 401) {
        return 'Потрібна авторизація адміністратора.';
    }

    if (maybeAxios.response?.status === 403) {
        return 'Недостатньо прав для виконання цієї дії.';
    }

    const errors = maybeAxios.response?.data?.errors;
    if (errors && errors.length > 0) {
        return errors.join(', ');
    }

    return maybeAxios.response?.data?.message || maybeAxios.message || 'Не вдалося виконати запит.';
};

const extractSurveyList = (response: unknown): SurveyLinkItem[] => {
    if (Array.isArray(response)) {
        return response as SurveyLinkItem[];
    }

    if (response && typeof response === 'object') {
        const maybeResponse = response as {
            data?: unknown;
            items?: unknown;
        };

        if (Array.isArray(maybeResponse.data)) {
            return maybeResponse.data as SurveyLinkItem[];
        }

        if (Array.isArray(maybeResponse.items)) {
            return maybeResponse.items as SurveyLinkItem[];
        }

        if (
            maybeResponse.data &&
            typeof maybeResponse.data === 'object' &&
            Array.isArray((maybeResponse.data as { items?: unknown }).items)
        ) {
            return (maybeResponse.data as { items: SurveyLinkItem[] }).items;
        }
    }

    return [];
};

function SurveyFormDialog({
    open,
    title,
    initialValues,
    loading,
    onClose,
    onSubmit,
}: {
    open: boolean;
    title: string;
    initialValues?: Partial<SurveyLinkItem>;
    loading: boolean;
    onClose: () => void;
    onSubmit: (values: SurveyFormValues) => Promise<void>;
}) {
    const formKey = [
        open ? 'open' : 'closed',
        initialValues?.id ?? 'new',
        initialValues?.nameUa ?? '',
        initialValues?.nameEn ?? '',
        initialValues?.url ?? '',
        initialValues?.publishDate ?? '',
        initialValues?.sortOrder ?? 0,
    ].join('-');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const values: SurveyFormValues = {
            nameUa: String(formData.get('nameUa') ?? '').trim(),
            nameEn: String(formData.get('nameEn') ?? '').trim(),
            shortDescriptionUa: String(formData.get('shortDescriptionUa') ?? '').trim(),
            shortDescriptionEn: String(formData.get('shortDescriptionEn') ?? '').trim(),
            url: String(formData.get('url') ?? '').trim(),
            publishDate: String(formData.get('publishDate') ?? '').trim(),
            sortOrder: Number(formData.get('sortOrder') ?? 0) || 0,
            photo: (formData.get('photo') as File) || null,
        };

        if (!values.nameUa || !values.nameEn || !values.url || !values.publishDate) {
            return;
        }

        if (values.photo && values.photo.size === 0) {
            values.photo = null;
        }

        await onSubmit(values);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>

            <Box key={formKey} component="form" onSubmit={(event) => void handleSubmit(event)}>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                name="nameUa"
                                label="Назва (UA)"
                                defaultValue={initialValues?.nameUa || initialValues?.name || ''}
                                fullWidth
                                required
                            />
                            <TextField
                                name="nameEn"
                                label="Name (EN)"
                                defaultValue={initialValues?.nameEn || ''}
                                fullWidth
                                required
                            />
                        </Stack>

                        <TextField
                            name="shortDescriptionUa"
                            label="Опис (UA)"
                            defaultValue={
                                initialValues?.shortDescriptionUa ||
                                initialValues?.shortDescription ||
                                ''
                            }
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <TextField
                            name="shortDescriptionEn"
                            label="Description (EN)"
                            defaultValue={initialValues?.shortDescriptionEn || ''}
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <TextField
                            name="url"
                            label="Google Form URL або iframe"
                            defaultValue={initialValues?.url || ''}
                            fullWidth
                            required
                            helperText="Можна вставити звичайне посилання Google Form, embed URL або весь iframe."
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                name="publishDate"
                                label="Дата публікації"
                                type="datetime-local"
                                defaultValue={
                                    formatDateTimeLocal(initialValues?.publishDate) ||
                                    formatDateTimeLocal(new Date().toISOString())
                                }
                                fullWidth
                                required
                                slotProps={{ inputLabel: { shrink: true } }}
                            />

                            <TextField
                                name="sortOrder"
                                label="Порядок відображення"
                                type="number"
                                defaultValue={initialValues?.sortOrder ?? 0}
                                fullWidth
                            />
                        </Stack>

                        <Box
                            sx={{
                                p: 2,
                                border: '1px dashed #ccc',
                                borderRadius: '12px',
                                bgcolor: '#fcfcfc',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    mb: 1,
                                    fontWeight: 700,
                                    color: '#555',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Обкладинка / зображення
                            </Typography>

                            <input
                                name="photo"
                                type="file"
                                accept="image/*"
                                style={{ fontSize: '14px' }}
                            />
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} color="inherit">
                        Скасувати
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

function DeleteConfirmDialog({
    open,
    title,
    description,
    loading,
    onClose,
    onConfirm,
}: {
    open: boolean;
    title: string;
    description: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <Typography>{description}</Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit">
                    Скасувати
                </Button>

                <Button
                    onClick={() => void onConfirm()}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Видалення...' : 'Видалити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function SurveysAdminPage() {
    const [items, setItems] = useState<SurveyLinkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SurveyLinkItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<SurveyLinkItem | null>(null);

    const dialogTitle = useMemo(
        () => (editingItem ? 'Редагувати опитування' : 'Створити опитування'),
        [editingItem]
    );

    const fetchSurveys = async () => {
        const rawResponse = await agent.UsefulInformation.list();
        const normalized = extractSurveyList(rawResponse);

        return normalized
            .filter((item) => isGoogleFormUrl(item.url))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    };

    const reloadSurveys = async () => {
        try {
            setLoading(true);
            setError('');

            const surveys = await fetchSurveys();
            setItems(surveys);
        } catch (err) {
            console.error('Surveys load error:', err);
            setError(getApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadInitialSurveys = async () => {
            try {
                const surveys = await fetchSurveys();

                if (active) {
                    setItems(surveys);
                }
            } catch (err) {
                console.error('Initial surveys load error:', err);

                if (active) {
                    setError(getApiError(err));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadInitialSurveys();

        return () => {
            active = false;
        };
    }, []);

    const buildFormData = (values: SurveyFormValues, keepOldPhoto: boolean) => {
        const formData = new FormData();

        formData.set('NameUa', values.nameUa);
        formData.set('NameEn', values.nameEn);
        formData.set('ShortDescriptionUa', values.shortDescriptionUa);
        formData.set('ShortDescriptionEn', values.shortDescriptionEn);
        formData.set('Url', normalizeGoogleFormUrl(values.url));
        formData.set('PublishDate', new Date(values.publishDate).toISOString());
        formData.set('SortOrder', String(values.sortOrder));

        if (values.photo) {
            formData.set('Photo', values.photo);
            formData.set('KeepOldPhoto', 'false');
        } else if (keepOldPhoto) {
            formData.set('KeepOldPhoto', 'true');
        }

        return formData;
    };

    const handleCreateClick = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const handleEditClick = (item: SurveyLinkItem) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const handleDeleteClick = (item: SurveyLinkItem) => {
        setDeletingItem(item);
        setDeleteOpen(true);
    };

    const handleSubmit = async (values: SurveyFormValues) => {
        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            const formData = buildFormData(values, !!editingItem);

            if (editingItem) {
                await agent.UsefulInformation.update(editingItem.id, formData);
                setSuccessMessage('Опитування оновлено.');
            } else {
                await agent.UsefulInformation.create(formData);
                setSuccessMessage('Опитування створено.');
            }

            setFormOpen(false);
            setEditingItem(null);
            await reloadSurveys();
        } catch (err) {
            console.error('Survey save error:', err);
            setError(getApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;

        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            await agent.UsefulInformation.delete(deletingItem.id);

            setSuccessMessage('Опитування видалено.');
            setDeleteOpen(false);
            setDeletingItem(null);

            await reloadSurveys();
        } catch (err) {
            console.error('Survey delete error:', err);
            setError(getApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <PageHeader
                title="Опитування"
                description="Керуйте опитуваннями, які відображаються на сайті."
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            <Paper
                sx={{
                    borderRadius: '24px',
                    border: '1px solid #EAEAEA',
                    p: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Список опитувань
                        </Typography>
                        <Typography sx={{ color: '#666' }}>
                            Тут відображаються всі записи з Google Forms URL.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleCreateClick}
                        sx={{ borderRadius: '18px', px: 2.5, py: 1.2 }}
                    >
                        Створити опитування
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : items.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: 220,
                            borderRadius: '20px',
                            border: '1px dashed #D7D7D7',
                            bgcolor: '#FAFAFA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            p: 3,
                        }}
                    >
                        <Typography sx={{ color: '#777' }}>
                            Поки що немає жодного опитування.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Назва (UA)</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Name (EN)</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>URL</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Порядок</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        Дії
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nameUa || item.name || '—'}</TableCell>
                                        <TableCell>{item.nameEn || '—'}</TableCell>
                                        <TableCell sx={{ maxWidth: 260 }}>
                                            <Link
                                                href={normalizeGoogleFormUrl(item.url)}
                                                target="_blank"
                                                rel="noreferrer"
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    color: '#BA0000',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <OpenInNewRoundedIcon fontSize="small" />
                                                Відкрити
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.sortOrder ?? 0}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEditClick(item)}>
                                                <EditRoundedIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                                                <DeleteRoundedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>

            <SurveyFormDialog
                open={formOpen}
                title={dialogTitle}
                initialValues={editingItem || undefined}
                loading={submitting}
                onClose={() => {
                    setFormOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                title="Видалити опитування?"
                description={`Ви впевнені, що хочете видалити "${deletingItem?.nameUa || deletingItem?.name || ''}"?`}
                loading={submitting}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingItem(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
        </Box>
    );
}