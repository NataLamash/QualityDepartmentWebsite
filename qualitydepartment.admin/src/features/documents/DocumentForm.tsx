import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Box, Typography, MenuItem, CircularProgress } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import agent from '../../api/agent';

interface DocumentFormProps {
    initialData?: any;
    onSuccess: () => void;
    forcedCategoryId?: number | null;
    forcedCategoryName?: string;
}

export default function DocumentForm({
    initialData,
    onSuccess,
    forcedCategoryId,
    forcedCategoryName,
}: DocumentFormProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
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
                const response: any = await agent.Documents.categories(); 
                
                const catData = response?.items 
                    || (response?.data && response.data.items ? response.data.items : response?.data)
                    || (Array.isArray(response) ? response : []);
                
                setCategories(catData);
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
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        
        const localTime = formData.get('PublishDate') as string;
        if (localTime) {
            formData.set('PublishDate', new Date(localTime).toISOString());
        }

        if (file) {
            formData.set('File', file);
        } else if (initialData) {
            formData.delete('File');
        }
        if (forcedCategoryId) {
            formData.set('CategoryId', String(forcedCategoryId));
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
        } finally {
            setLoading(false);
        }
    };

    if (loadingCats) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <form onSubmit={handleSubmit} key={initialData?.id || 'new-document-form'}>
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
                    label="Дата публікації" 
                    name="PublishDate" 
                    type="datetime-local"
                    fullWidth
                    defaultValue={initialData?.publishDate
            ? formatToLocal(initialData.publishDate)
            : formatToLocal(new Date().toISOString())}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                />
                
                {forcedCategoryId ? (
                    <TextField
                        label="Категорія"
                        value={forcedCategoryName || ''}
                        fullWidth
                        disabled
                    />
                ) : (
                    <TextField
                        select
                        name="CategoryId"
                        label="Категорія"
                        defaultValue={initialData?.categoryId || ''}
                        required
                        fullWidth
                    >
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.nameUa || cat.name || 'Категорія'}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled value="">
                                <em>Категорії не знайдено</em>
                            </MenuItem>
                        )}
                    </TextField>
                )}

                <TextField 
                    name="DescriptionUa" label="Опис (UA)" multiline rows={3} 
                    defaultValue={initialData?.descriptionUa || ''} 
                />
                <TextField 
                    name="DescriptionEn" label="Description (EN)" multiline rows={3} 
                    defaultValue={initialData?.descriptionEn || ''} 
                />
                

                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#666' }}>
                        {initialData ? "ЗМІНИТИ ФАЙЛ (необов'язково)" : "ФАЙЛ ДОКУМЕНТА*"}
                    </Typography>
                    
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)} 
                        required={!initialData} 
                        style={{ marginBottom: '8px', display: 'block' }}
                    />

                    {initialData?.filePath && !file && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFileIcon sx={{ fontSize: 16, color: '#BA0000' }} />
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Поточний файл: <strong>{initialData.filePath.split('/').pop()}</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Button 
                    type="submit" variant="contained" size="large" disabled={loading}
                    sx={{ bgcolor: '#BA0000', borderRadius: '10px', py: 1.5, fontWeight: 700 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Зберегти зміни" : "Створити документ")}
                </Button>
            </Stack>
        </form>
    );
}