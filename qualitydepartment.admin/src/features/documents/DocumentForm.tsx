import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Box, Typography, MenuItem, CircularProgress } from '@mui/material';
import agent from '../../api/agent';

interface DocumentFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export default function DocumentForm({ initialData, onSuccess }: DocumentFormProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [file, setFile] = useState<File | null>(null);

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

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await agent.Documents.categories();
                const catData = response?.data || response || [];
                setCategories(Array.isArray(catData) ? catData : []);
            } catch (err) {
                console.error("Помилка завантаження категорій", err);
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCats();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const localTime = formData.get('PublishDate') as string;
        if (localTime) {
            const date = new Date(localTime);
            formData.set('PublishDate', date.toISOString());
        }

        if (file) {
            formData.set('File', file);
        } else if (initialData) {
            formData.delete('File');
        }

        try {
            if (initialData) {
                await agent.Documents.update(initialData.id, formData);
            } else {
                await agent.Documents.create(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Save error:", error);
            alert("Помилка при збереженні.");
        }
    };

    if (loadingCats) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-document-form'}>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField 
                    name="NameUa" 
                    label="Назва (UA)" 
                    fullWidth 
                    defaultValue={initialData?.nameUa || ''} 
                    required 
                />
                <TextField 
                    name="NameEn" 
                    label="Name (EN)" 
                    fullWidth 
                    defaultValue={initialData?.nameEn || ''} 
                    required 
                />
                
                <TextField
                    select
                    name="CategoryId"
                    label="Категорія"
                    defaultValue={initialData?.categoryId || ''}
                    required
                    fullWidth
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField 
                    name="DescriptionUa" 
                    label="Опис (UA)" 
                    multiline 
                    rows={3} 
                    defaultValue={initialData?.descriptionUa || ''} 
                />
                <TextField 
                    name="DescriptionEn" 
                    label="Description (EN)" 
                    multiline 
                    rows={3} 
                    defaultValue={initialData?.descriptionEn || ''} 
                />
                
                <TextField 
                    label="Дата публікації" 
                    name="PublishDate" 
                    type="datetime-local"
                    fullWidth
                    defaultValue={formatToLocal(initialData?.publishDate)}
                    InputLabelProps={{ shrink: true }}
                    required
                />

                <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                        {initialData ? "Змінити файл(залиште порожнім, щоб зберегти старий)" : "Файл документа *"}
                    </Typography>
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)} 
                        required={!initialData} 
                    />
                </Box>

                <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px', py: 1.5, fontWeight: 700 }}
                >
                    {initialData ? "Зберегти зміни" : "Створити"}
                </Button>
            </Stack>
        </form>
    );
}