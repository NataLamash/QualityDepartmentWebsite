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
            const dateObj = new Date(localTime);
            formData.set('PublishDate', dateObj.toISOString());
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
            const serverError = error.response?.data?.errors?.[0] || "Помилка при збереженні новини.";
            alert(serverError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-news-form'}>
            <Stack spacing={2.5} sx={{ mt: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField 
                        name="TitleUa" label="Заголовок (UA)" fullWidth 
                        defaultValue={initialData?.titleUa || ''} required 
                        size="small"
                    />
                    <TextField 
                        name="TitleEn" label="Title (EN)" fullWidth 
                        defaultValue={initialData?.titleEn || ''} required 
                        size="small"
                    />
                </Stack>

                <TextField 
                    label="Дата публікації"
                    name="PublishDate" 
                    type="datetime-local" 
                    fullWidth
                    defaultValue={formatToLocal(initialData?.publishDate) || formatToLocal(new Date().toISOString())}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                    size="small"
                />

                <TextField 
                    name="FullTextUa" label="Текст новини (UA)" multiline rows={4} 
                    defaultValue={initialData?.fullTextUa || ''} required 
                    size="small"
                />
                
                <TextField 
                    name="FullTextEn" label="News Text (EN)" multiline rows={4} 
                    defaultValue={initialData?.fullTextEn || ''} required 
                    size="small"
                />

                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '12px', bgcolor: '#fcfcfc' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>
                        {initialData ? "Оновити фото" : "Головне фото*"}
                    </Typography>
                    
                    <input 
                        type="file" accept="image/*"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
                        required={!initialData} 
                        style={{ fontSize: '14px' }}
                    />

                    {initialData?.photoPath && !photo && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
                            <ImageIcon sx={{ fontSize: 18, color: '#BA0000' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                Поточне: 
                                <Link 
                                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${initialData.photoPath.replace(/^\//, '')}`}                                    
                                    target="_blank" 
                                    sx={{ ml: 0.5, color: '#BA0000', textDecoration: 'none' }}
                                >
                                    {initialData.photoPath.split('/').pop()}
                                </Link>
                            </Typography>
                        </Stack>
                    )}
                </Box>

                <Button 
                    type="submit" variant="contained" size="large" disabled={loading}
                    sx={{ 
                        bgcolor: '#BA0000', 
                        borderRadius: '12px', 
                        py: 1.5, 
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#8e0000' }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Зберегти зміни" : "Опублікувати новину")}
                </Button>
            </Stack>
        </form>
    );
}