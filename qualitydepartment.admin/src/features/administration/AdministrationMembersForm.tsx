import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import agent from '../../api/agent';

interface AdministrationMembersFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export default function AdministrationMembersForm({ initialData, onSuccess }: AdministrationMembersFormProps) {
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        
        if (photo) {
            formData.set('Photo', photo);
            formData.set('KeepOldPhoto', 'false');
        } else if (initialData) {
            formData.set('KeepOldPhoto', 'true');
        }

        try {
            if (initialData) {
                await agent.AdministrationMembers.update(initialData.id, formData);
            } else {
                await agent.AdministrationMembers.create(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Save error:", error);
            alert("Помилка при збереженні даних.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-member'}>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2}>
                    <TextField 
                        name="FullNameUa" label="ПІБ (UA)" fullWidth 
                        defaultValue={initialData?.fullNameUa || ''} required 
                    />
                    <TextField 
                        name="FullNameEn" label="Full Name (EN)" fullWidth 
                        defaultValue={initialData?.fullNameEn || ''} required 
                    />
                </Stack>

                <Stack direction="row" spacing={2}>
                    <TextField 
                        name="PositionUa" label="Посада (UA)" fullWidth 
                        defaultValue={initialData?.positionUa || ''} 
                    />
                    <TextField 
                        name="PositionEn" label="Position (EN)" fullWidth 
                        defaultValue={initialData?.positionEn || ''} 
                    />
                </Stack>

                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#666' }}>
                        {initialData ? "ЗМІНИТИ ФОТО (необов'язково)" : "ЗАВАНТАЖИТИ ФОТО ПРАЦІВНИКА*"}
                    </Typography>
                    
                    <input 
                        type="file" accept="image/*"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
                        required={!initialData}
                        style={{ marginBottom: '8px' }}
                    />

                    {initialData?.photoPath && !photo && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon sx={{ fontSize: 16, color: '#BA0000' }} />
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Поточне фото: <strong>{initialData.photoPath.split('/').pop()}</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Button 
                    type="submit" variant="contained" size="large" disabled={loading}
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px', py: 1.5, fontWeight: 700 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Зберегти зміни" : "Додати працівника")}
                </Button>
            </Stack>
        </form>
    );
}