import { useEffect, useState } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Dialog, DialogTitle, DialogContent, Stack, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import agent from '../../api/agent';
import AdministrationMembersForm from './AdministrationMembersForm';

export default function AdministrationMembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const response = await agent.AdministrationMembers.list();
            const data = response?.data || response || [];
            
            const sortedData = Array.isArray(data) 
                ? [...data].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) 
                : [];
            
            setMembers(sortedData);
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMembers(); }, []);

    const handleReorder = async (id: number, currentIndex: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex < 0 || newIndex >= members.length) return;

        const updatedMembers = [...members];
        const [movedItem] = updatedMembers.splice(currentIndex, 1);
        updatedMembers.splice(newIndex, 0, movedItem);
        setMembers(updatedMembers);

        try {
            await agent.AdministrationMembers.reorder(id, newIndex + 1); 

              setTimeout(() => {
             loadMembers();
            }, 500); 
        } catch (error) {
           console.error("Reorder failed", error);
           alert("Помилка при зміні порядку");
           loadMembers(); 
        }
    };

    const handleOpen = async (member: any = null) => {
        if (member) {
            try {
                const details = await agent.AdministrationMembers.details(member.id);
                setSelectedMember(details?.data || details);
            } catch (error) {
                setSelectedMember(member);
            }
        } else {
            setSelectedMember(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMember(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити цього працівника?")) {
            await agent.AdministrationMembers.delete(id);
            loadMembers();
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Адміністрація</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpen()} 
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px' }}
                >
                    Додати працівника
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ПІБ (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Посада (UA)</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'center', width: 120 }}>Порядок</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                             <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                        ) : (
                            members.map((member, index) => (
                                <TableRow key={member.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{member.fullNameUa}</TableCell>
                                    <TableCell>{member.positionUa || '—'}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                            <IconButton 
                                                size="small" 
                                                disabled={index === 0}
                                                onClick={() => handleReorder(member.id, index, 'up')}
                                                sx={{ color: '#BA0000' }}
                                            >
                                                <KeyboardArrowUpIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                disabled={index === members.length - 1}
                                                onClick={() => handleReorder(member.id, index, 'down')}
                                                sx={{ color: '#BA0000' }}
                                            >
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(member)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(member.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '15px' } } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#BA0000' }}>
                    {selectedMember ? 'Редагування працівника' : 'Додати працівника'}
                </DialogTitle>
                <DialogContent>
                    <AdministrationMembersForm 
                        initialData={selectedMember} 
                        onSuccess={() => { handleClose(); loadMembers(); }} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}