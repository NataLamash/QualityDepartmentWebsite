import { useEffect, useState } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Dialog, DialogTitle, DialogContent, Stack, CircularProgress, Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import agent from '../../api/agent';
import UsefulInformationForm from './UsefulInformationForm';

export default function UsefulInformationPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<any>(null);

    const loadLinks = async () => {
        setLoading(true);
        try {
            const response: any = await agent.UsefulInformation.list();
            const rawData = response?.data || response;
            const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
            const sortedData = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            setLinks(sortedData);
        } catch (error) {
            console.error("Failed to load links", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLinks(); }, []);

    const handleReorder = async (id: number, currentIndex: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= links.length) return;

        const updatedLinks = [...links];
        const [movedItem] = updatedLinks.splice(currentIndex, 1);
        updatedLinks.splice(newIndex, 0, movedItem);
        setLinks(updatedLinks);

        try {
            await agent.UsefulInformation.reorder(id, newIndex + 1); 
            setTimeout(() => loadLinks(), 500); 
        } catch (error) {
            console.error("Reorder failed", error);
            loadLinks(); 
        }
    };

    const handleOpen = async (link: any = null) => {
        if (link) {
            try {
                const details = await agent.UsefulInformation.details(link.id);
                setSelectedLink(details?.data || details);
            } catch {
                setSelectedLink(link);
            }
        } else {
            setSelectedLink(null);
        }
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити це посилання?")) {
            try {
                await agent.UsefulInformation.delete(id);
                loadLinks();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Корисні посилання</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpen()} 
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                    Додати
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #eee' }}>
                <Table size="small"> 
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Назва (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>URL</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'center', width: 100 }}>Порядок</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, width: 120 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && links.length === 0 ? (
                             <TableRow><TableCell colSpan={4} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
                        ) : (
                            links.map((link, index) => (
                                <TableRow key={link.id} hover>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                        {link.nameUa}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: '300px' }}>
                                        <Link 
                                            href={link.url} 
                                            target="_blank"
                                            sx={{ 
                                                fontSize: '0.8rem', 
                                                textDecoration: 'none',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis', 
                                                whiteSpace: 'nowrap',
                                                color: '#666',
                                                '&:hover': { color: 'blue' }
                                            }}
                                        >
                                            {link.url}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0} sx={{ justifyContent: 'center' }}>
                                            <IconButton 
                                                size="small" 
                                                disabled={index === 0}
                                                onClick={() => handleReorder(link.id, index, 'up')}
                                                sx={{ color: '#BA0000' }}
                                            >
                                                <KeyboardArrowUpIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                disabled={index === links.length - 1}
                                                onClick={() => handleReorder(link.id, index, 'down')}
                                                sx={{ color: '#BA0000' }}
                                            >
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpen(link)} color="primary"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(link.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        {!loading && links.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    Записів не знайдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={open} 
                onClose={() => setOpen(false)} 
                maxWidth="sm" 
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#BA0000' }}>
                    {selectedLink ? 'Редагування' : 'Створення'}
                </DialogTitle>
                <DialogContent>
                    <UsefulInformationForm 
                        initialData={selectedLink} 
                        onSuccess={() => { setOpen(false); loadLinks(); }} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}