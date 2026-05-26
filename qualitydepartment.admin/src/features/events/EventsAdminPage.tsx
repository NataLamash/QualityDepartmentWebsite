import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    CircularProgress,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../../api/agent';
import NewsForm from '../news/NewsForm';

export default function EventsAdminPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await agent.News.eventsList(1, 50);
            const items = response?.data?.items || response?.items || [];
            setEvents(items);
        } catch (error) {
            console.error('Помилка завантаження заходів:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadEvents();
    }, []);

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '—';
        const normalizedDate = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
        const date = new Date(normalizedDate);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('uk-UA').replace(',', '');
    };

    const handleOpen = (item: any = null) => {
        setSelectedEvent(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEvent(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей захід?')) {
            try {
                await agent.News.delete(id);
                await loadEvents();
            } catch (error) {
                console.error('Помилка видалення заходу:', error);
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Керування заходами
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px' }}
                >
                    Створити захід
                </Button>
            </Stack>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: '20px', border: '1px solid #eee' }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Заголовок (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Автор</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                Дії
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((item) => {
                                const normalizedDate = item.publishDate?.endsWith('Z')
                                    ? item.publishDate
                                    : `${item.publishDate}Z`;

                                const isPublished = new Date(normalizedDate) <= new Date();

                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{item.titleUa}</TableCell>
                                        <TableCell>{item.creatorName}</TableCell>
                                        <TableCell>{formatDateTime(item.publishDate)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={isPublished ? 'Опубліковано' : 'Заплановано'}
                                                color={isPublished ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(item)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(item.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#BA0000'}}>
                    {selectedEvent ? 'Редагування заходу' : 'Створення заходу'}
                </DialogTitle>

                <DialogContent>
                    <NewsForm
                        key={selectedEvent?.id || 'new-event'}
                        initialData={selectedEvent}
                        mode="events"
                        onSuccess={() => {
                            handleClose();
                            void loadEvents();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}