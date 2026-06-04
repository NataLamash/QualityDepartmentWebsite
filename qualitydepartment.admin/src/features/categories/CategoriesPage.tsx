import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PageHeader from '../../components/ui/PageHeader';
import TaxonomyFormDialog from '../../components/ui/TaxonomyFormDialog';
import DeleteConfirmDialog from '../../components/ui/DeleteConfirmDialog';
import agent, {
    type CategoryAdminDto,
    type CategoryCreateUpdateDto,
} from '../../api/agent';

const getApiError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            data?: {
                errors?: string[] | null;
                message?: string | null;
            };
        };
    };

    const apiErrors = maybeAxios.response?.data?.errors;
    if (apiErrors && apiErrors.length > 0) {
        return apiErrors.join(', ');
    }

    return maybeAxios.response?.data?.message || 'Не вдалося виконати запит.';
};

export default function CategoriesPage() {
    const [items, setItems] = useState<CategoryAdminDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CategoryAdminDto | null>(null);
    const [deletingItem, setDeletingItem] = useState<CategoryAdminDto | null>(null);

    const dialogTitle = useMemo(() => {
        return editingItem ? 'Редагувати категорію' : 'Створити категорію';
    }, [editingItem]);

    const fetchCategories = async () => {
        const response = await agent.Categories.list();
        return response.data;
    };

    const reloadCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchCategories();
            setItems(data);
        } catch (err) {
            setError(getApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    let active = true;

    const loadInitialCategories = async () => {
        try {
            const data = await fetchCategories();

            if (active) {
                setItems(data);
            }
        } catch (err) {
            if (active) {
                setError(getApiError(err));
            }
        } finally {
            if (active) {
                setLoading(false);
            }
        }
    };

    void loadInitialCategories();

    return () => {
        active = false;
    };
}, []);

    const handleCreateClick = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const handleEditClick = (item: CategoryAdminDto) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const handleDeleteClick = (item: CategoryAdminDto) => {
        setDeletingItem(item);
        setDeleteOpen(true);
    };

    const handleSubmit = async (values: CategoryCreateUpdateDto) => {
        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            if (editingItem) {
                await agent.Categories.update(editingItem.id, values);
                setSuccessMessage('Категорію оновлено.');
            } else {
                await agent.Categories.create(values);
                setSuccessMessage('Категорію створено.');
            }

            setFormOpen(false);
            setEditingItem(null);
            await reloadCategories();
        } catch (err) {
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

            await agent.Categories.delete(deletingItem.id);
            setSuccessMessage('Категорію видалено.');
            setDeleteOpen(false);
            setDeletingItem(null);
            await reloadCategories();
        } catch (err) {
            setError(getApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <PageHeader
                title="Категорії документів"
                description="Керування категоріями документів для використання у формах документів."
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
                            Список категорій
                        </Typography>
                        <Typography sx={{ color: '#666' }}>
                            Створюй, редагуй та видаляй категорії документів.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleCreateClick}
                        sx={{ borderRadius: '18px', px: 2.5, py: 1.2 }}
                    >
                        Створити категорію
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
                            Поки що немає жодної категорії.
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
                                    <TableCell sx={{ fontWeight: 700 }}>Documents Count</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        Дії
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nameUa}</TableCell>
                                        <TableCell>{item.nameEn}</TableCell>
                                        <TableCell>{item.documentsCount}</TableCell>
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

            <TaxonomyFormDialog
                open={formOpen}
                title={dialogTitle}
                initialValues={
                    editingItem
                        ? { nameUa: editingItem.nameUa, nameEn: editingItem.nameEn }
                        : undefined
                }
                loading={submitting}
                onClose={() => {
                    setFormOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                title="Видалити категорію?"
                description={`Ви впевнені, що хочете видалити "${deletingItem?.nameUa ?? ''}"?`}
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