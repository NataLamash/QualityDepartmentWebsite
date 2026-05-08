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
import DocumentForm from './DocumentForm';

export default function DocumentsAdminPage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const loadDocs = async () => {
        setLoading(true);
        try {
            const response = await agent.Documents.list(1, 50);
            const items = response?.data?.items || response?.items || [];
            setDocs(items);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDocs(); }, []);

    const handleOpen = async (item: any = null) => {
        if (item) {
            setLoadingDetails(true);
            try {
                const details = await agent.Documents.details(item.id);
                setSelectedDoc(details?.data || details); 
            } catch (error) {
                console.error("Помилка завантаження деталей", error);
                setSelectedDoc(item); 
            } finally {
                setLoadingDetails(false);
            }
        } else {
            setSelectedDoc(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoc(null);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Реєстр документів</Typography>
                <Button 
                    variant="contained" 
                    startIcon={loadingDetails ? <CircularProgress size={20} color="inherit" /> : <AddIcon />} 
                    disabled={loadingDetails}
                    onClick={() => handleOpen()} 
                    sx={{ bgcolor: '#BA0000' }}
                >
                    Додати документ
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Назва (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Категорія</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                             <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                            docs.map((doc) => (
                                <TableRow key={doc.id} hover>
                                    <TableCell>{doc.nameUa}</TableCell>
                                    <TableCell>{doc.categoryNameUa}</TableCell>
                                    <TableCell>{new Date(doc.publishDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(doc)} color="primary" disabled={loadingDetails}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => { if(window.confirm("Видалити?")) agent.Documents.delete(doc.id).then(loadDocs) }} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    {selectedDoc ? 'Редагування документа' : 'Додавання документа'}
                </DialogTitle>
                <DialogContent>
                    <DocumentForm 
                        initialData={selectedDoc} 
                        onSuccess={() => { handleClose(); loadDocs(); }} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}