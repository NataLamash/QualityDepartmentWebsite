import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';

interface FormValues {
    nameUa: string;
    nameEn: string;
}

interface Props {
    open: boolean;
    title: string;
    initialValues?: FormValues;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (values: FormValues) => Promise<void>;
}

export default function TaxonomyFormDialog({
    open,
    title,
    initialValues,
    loading = false,
    onClose,
    onSubmit,
}: Props) {
    const formKey = `${open}-${initialValues?.nameUa ?? ''}-${initialValues?.nameEn ?? ''}`;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const nameUa = String(formData.get('nameUa') ?? '').trim();
        const nameEn = String(formData.get('nameEn') ?? '').trim();

        if (!nameUa || !nameEn) {
            return;
        }

        await onSubmit({
            nameUa,
            nameEn,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 800, color: '#BA0000' }}>{title}</DialogTitle>

            <Box
                component="form"
                id="taxonomy-form"
                key={formKey}
                onSubmit={(event) => {
                    void handleSubmit(event);
                }}
            >
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, color: '#BA0000' }}>
                        <TextField
                            name="nameUa"
                            label="Назва (UA)"
                            defaultValue={initialValues?.nameUa ?? ''}
                            fullWidth
                            required
                        />

                        <TextField
                            name="nameEn"
                            label="Name (EN)"
                            defaultValue={initialValues?.nameEn ?? ''}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} color="inherit">
                        Скасувати
                    </Button>

                    <Button
                        type="submit"
                        form="taxonomy-form"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}