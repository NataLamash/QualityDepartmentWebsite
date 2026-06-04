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
import DocumentForm from './DocumentForm';
import PageHeader from '../../components/ui/PageHeader';

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

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '—';
        const normalizedDate = dateString.endsWith('Z') ? dateString : dateString + 'Z';
        const date = new Date(normalizedDate);
        return isNaN(date.getTime()) ? '—' : date.toLocaleString('uk-UA', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
        }).replace(',', '');
    };

    const handleOpen = async (item: any = null) => {
        if (item) {
            setLoadingDetails(true);
            try {
                const details = await agent.Documents.details(item.id);
                setSelectedDoc(details?.data || details); 
            } catch (error) {
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

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей документ?")) {
            await agent.Documents.delete(id);
            loadDocs();
        }
    };

    return (
        <Box sx={{ p: 4 }}>
                        <PageHeader title="Документи"
                                    description="Керування документами відділу якості."
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
                            <TableCell sx={{ fontWeight: 700 }}>Назва (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Категорія</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                             <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
                        ) : (
                            docs.map((doc) => {
                                const normalizedDate = doc.publishDate?.endsWith('Z') ? doc.publishDate : doc.publishDate + 'Z';
                                const isPublished = new Date(normalizedDate) <= new Date();

                                return (
                                    <TableRow key={doc.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{doc.nameUa}</TableCell>
                                        <TableCell>{doc.categoryNameUa || doc.categoryName}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(doc.publishDate)}</TableCell>
                                        <TableCell>
                                            {isPublished ? 
                                                <Chip label="Опубліковано" color="success" size="small" /> : 
                                                <Chip label="Заплановано" color="warning" size="small" />
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(doc)} color="primary" disabled={loadingDetails}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(doc.id)} color="error">
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
                <DialogTitle sx={{ fontWeight: 800, color: '#BA0000' }}>
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