import { useEffect, useState } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Dialog, DialogTitle, DialogContent, Stack, CircularProgress 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../../api/agent';
import NewsForm from './NewsForm'; 

export default function NewsAdminPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    const loadNews = async () => {
        setLoading(true);
        try {
            const response: any = await agent.News.list(1, 50); 
            const items = response?.items || response?.data?.items || [];
            setNews(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Failed to load news", error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

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
                console.error("Delete error", error);
            }
        }
    };

    if (loading && news.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: '#BA0000' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Керування новинами</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '12px', textTransform: 'none', px: 3, bgcolor: '#BA0000', '&:hover': { bgcolor: '#8e0000' } }}
                >
                    Створити новину
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Заголовок (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {news.length > 0 ? (
                            news.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.titleUa}</TableCell>
                                    <TableCell>{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '—'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(item)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={3} align="center">Новин не знайдено</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    {selectedNews ? 'Редагування новини' : 'Створення новини'}
                </DialogTitle>
                <DialogContent>
                    <NewsForm 
                        initialData={selectedNews} 
                        onSuccess={() => { handleClose(); loadNews(); }} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}