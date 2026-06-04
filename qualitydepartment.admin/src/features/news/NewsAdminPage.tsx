import { useEffect, useState } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Dialog, DialogTitle, DialogContent, Stack, CircularProgress, Chip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../../api/agent';
import NewsForm from './NewsForm';
import PageHeader from '../../components/ui/PageHeader';

export default function NewsAdminPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    const loadNews = async () => {
        setLoading(true);
        try {
            const response = await agent.News.list(1, 50);
            const items = response?.data?.items || response?.items || [];
            setNews(items);
        } catch (error) {
            console.error("Помилка завантаження новин:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNews(); }, []);

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '—';
        const normalizedDate = dateString.endsWith('Z') ? dateString : dateString + 'Z';
        const date = new Date(normalizedDate);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleString('uk-UA').replace(',', ''); 
    };

    const handleOpen = (item: any = null) => {
        setSelectedNews(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedNews(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю новину?")) {
            try {
                await agent.News.delete(id);
                loadNews();
            } catch (error) {
                console.error("Помилка видалення:", error);
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
                <PageHeader title="Новини"
                            description="Керування новинами відділу якості."
                            showBackButton={true}
                />
            
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mb: 3,
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpen()}
                                sx={{
                                    bgcolor: '#BA0000',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2.5,
                                    py: 1.2,
                                    boxShadow: '0 8px 20px rgba(186,0,0,0.18)',
                                    '&:hover': {
                                        bgcolor: '#980000',
                                    },
                                }}
                            >
                                Додати
                            </Button>
                        </Box>   

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Заголовок (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Автор</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                             <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
                        ) : (
                            news.map((item) => {
                                const normalizedDate = item.publishDate?.endsWith('Z') ? item.publishDate : item.publishDate + 'Z';
                                const isPublished = new Date(normalizedDate) <= new Date();
                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{item.titleUa}</TableCell>
                                        <TableCell>{item.creatorName}</TableCell>
                                        <TableCell>{formatDateTime(item.publishDate)}</TableCell>
                                        <TableCell>
                                            <Chip label={isPublished ? "Опубліковано" : "Заплановано"} color={isPublished ? "success" : "warning"} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(item)} color="primary"><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
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
                    {selectedNews ? 'Редагування новини' : 'Створення новини'}
                </DialogTitle>
                <DialogContent>
                    {/* КЛЮЧОВИЙ МОМЕНТ: Додано перевірку, щоб форма перерендерилася при зміні новини */}
                    <NewsForm
                        key={selectedNews?.id || 'new'}
                        initialData={selectedNews}
                        mode="news"
                        onSuccess={() => {
                            handleClose();
                            loadNews();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}