import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress, Link } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import agent from '../../api/agent';

interface NewsFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export default function NewsForm({ initialData, onSuccess }: NewsFormProps) {
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
            formData.set('PublishDate', new Date(localTime).toISOString());
        }

        if (photo) {
            formData.set('Photo', photo);
            formData.set('KeepOldPhoto', 'false');
        } else if (initialData) {
            formData.set('KeepOldPhoto', 'true');
        }

        try {
            if (initialData) {
                await agent.News.update(initialData.id, formData);
            } else {
                await agent.News.create(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("News save error:", error);
            alert("Помилка при збереженні новини.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-news-form'}>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2}>
                    <TextField 
                        name="TitleUa" label="Заголовок (UA)" fullWidth 
                        defaultValue={initialData?.titleUa || ''} required 
                    />
                    <TextField 
                        name="TitleEn" label="Title (EN)" fullWidth 
                        defaultValue={initialData?.titleEn || ''} required 
                    />
                </Stack>

                <TextField 
                    name="FullTextUa" label="Текст новини (UA)" multiline rows={4} 
                    defaultValue={initialData?.fullTextUa || ''} required 
                />
                <TextField 
                    name="FullTextEn" label="News Text (EN)" multiline rows={4} 
                    defaultValue={initialData?.fullTextEn || ''} required 
                />
                 <TextField 
                 label="Дата публікації" 
                 name="PublishDate" 
                 type="datetime-local" 
                 fullWidth
                 defaultValue={formatToLocal(initialData?.publishDate)}
                 slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
                required
                />

                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#666' }}>
                        {initialData ? "ЗМІНИТИ ФОТО (необов'язково)" : "ЗАВАНТАЖИТИ ГОЛОВНЕ ФОТО*"}
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
                            <Typography variant="body2">
                                Поточне фото: 
                                <Link 
                                    href={`${import.meta.env.VITE_API_URL}${initialData.photoPath}`}                                    
                                    target="_blank" 
                                    sx={{ ml: 1, color: '#BA0000', textDecoration: 'none' }}
                                >
                                    {initialData.photoPath.split('/').pop()}
                                </Link>
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Button 
                    type="submit" variant="contained" size="large" disabled={loading}
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px', py: 1.5, fontWeight: 700 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Зберегти зміни" : "Опублікувати")}
                </Button>
            </Stack>
        </form>
    );
}