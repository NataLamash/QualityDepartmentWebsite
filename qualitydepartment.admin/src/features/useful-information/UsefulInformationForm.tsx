import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import agent from '../../api/agent';

interface UsefulInformationFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export default function UsefulInformationForm({ initialData, onSuccess }: UsefulInformationFormProps) {
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);

    const formatToLocal = (dateString?: string) => {
        if (!dateString) return '';
        const normalizedDate = dateString.endsWith('Z') ? dateString : dateString + 'Z';
        const date = new Date(normalizedDate);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        
        const localTime = formData.get('PublishDate') as string;
        if (localTime) {
            const inputDate = new Date(localTime);
            const now = new Date();

            
            if (initialData && inputDate <= now) {
                const safeDate = new Date(now.getTime() + 60000);
                formData.set('PublishDate', safeDate.toISOString());
            } else {
                formData.set('PublishDate', inputDate.toISOString());
            }
        }

        if (photo) {
            formData.set('Photo', photo);
            formData.set('KeepOldPhoto', 'false');
        } else if (initialData) {
            formData.set('KeepOldPhoto', 'true');
        }

        try {
            if (initialData) {
                await agent.UsefulInformation.update(initialData.id, formData);
            } else {
                await agent.UsefulInformation.create(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Save error:", error);
            const errorMsg = error.response?.data?.errors?.[0] || "Помилка при збереженні.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-link'}>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2}>
                    <TextField 
                        name="NameUa" label="Назва (UA)" fullWidth 
                        defaultValue={initialData?.nameUa || ''} required 
                    />
                    <TextField 
                        name="NameEn" label="Name (EN)" fullWidth 
                        defaultValue={initialData?.nameEn || ''} required 
                    />
                </Stack>

                <TextField 
                    name="Url" label="Посилання (URL)" fullWidth 
                    defaultValue={initialData?.url || ''} required 
                />

                <TextField 
                    name="ShortDescriptionUa" label="Опис (UA)" multiline rows={2} 
                    defaultValue={initialData?.shortDescriptionUa || ''} 
                />
                <TextField 
                    name="ShortDescriptionEn" label="Description (EN)" multiline rows={2} 
                    defaultValue={initialData?.shortDescriptionEn || ''} 
                />

                <TextField 
                    label="Дата публікації" 
                    name="PublishDate" 
                    type="datetime-local" 
                    fullWidth
                    defaultValue={formatToLocal(initialData?.publishDate) || formatToLocal(new Date().toISOString())}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                />

                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#666' }}>
                        {initialData ? "ЗМІНИТИ ФОТО (необов'язково)" : "ФОТО ДЛЯ КАРТКИ*"}
                    </Typography>
                    
                    <input 
                        type="file" accept="image/*"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
                        required={!initialData}
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
                    sx={{ 
                        bgcolor: '#BA0000', 
                        borderRadius: '10px', 
                        py: 1.5, 
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#8e0000' }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Зберегти зміни" : "Додати посилання")}
                </Button>
            </Stack>
        </form>
    );
}