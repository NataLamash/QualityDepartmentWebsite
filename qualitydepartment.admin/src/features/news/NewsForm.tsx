import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography } from '@mui/material';
import agent from '../../api/agent';

interface NewsFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export default function NewsForm({ initialData, onSuccess }: NewsFormProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const formData = new FormData(formElement);
        
        
        if (file) {
            formData.delete('File'); 
            formData.append('File', file); 
        }

        try {
            if (initialData) {
                await agent.News.update(initialData.id, formData);
            } else {
                await agent.News.create(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Помилка при збереженні:", error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField 
                    name="TitleUa" 
                    label="Заголовок (UA)" 
                    fullWidth 
                    defaultValue={initialData?.titleUa} 
                    required 
                />
                <TextField 
                    name="TitleEn" 
                    label="Заголовок (EN)" 
                    fullWidth 
                    defaultValue={initialData?.titleEn} 
                    required 
                />
                <TextField 
                    name="FullTextUa" 
                    label="Текст (UA)" 
                    multiline 
                    rows={4} 
                    fullWidth 
                    defaultValue={initialData?.fullTextUa} 
                />
                <TextField 
                    name="FullTextEn" 
                    label="Text (EN)" 
                    multiline 
                    rows={4} 
                    fullWidth 
                    defaultValue={initialData?.fullTextEn} 
                />
                
                <TextField 
                    label="Дата публікації" 
                    name="PublishDate" 
                    type="datetime-local"
                    fullWidth
                    defaultValue={initialData?.publishDate ? initialData.publishDate.substring(0, 16) : ''}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                        Зображення новини
                    </Typography>
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)} 
                        accept="image/*" 
                    />
                </Box>

                <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    fullWidth
                    sx={{ borderRadius: '12px', py: 1.5, bgcolor: '#BA0000', '&:hover': { bgcolor: '#8e0000' } }}
                >
                    Зберегти
                </Button>
            </Stack>
        </form>
    );
}