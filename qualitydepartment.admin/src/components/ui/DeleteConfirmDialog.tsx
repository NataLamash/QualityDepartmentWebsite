import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

interface Props {
    open: boolean;
    title: string;
    description: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteConfirmDialog({
    open,
    title,
    description,
    loading = false,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <Typography>{description}</Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit">
                    Скасувати
                </Button>

                <Button
                    onClick={() => void onConfirm()}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Видалення...' : 'Видалити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}