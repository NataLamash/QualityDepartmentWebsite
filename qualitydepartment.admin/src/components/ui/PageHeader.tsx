import { Box, Button, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';

interface Props {
    title: string;
    description?: string;
    fallbackTo?: string;
    showBackButton?: boolean;
}

export default function PageHeader({
    title,
    description,
    fallbackTo = '/dashboard',
    showBackButton = true,
}: Props) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate(fallbackTo);
    };

    return (
        <Box sx={{ mb: 4 }}>
            {showBackButton && (
                <Button
                    onClick={handleBack}
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{
                        mb: 2,
                        borderRadius: '18px',
                        border: '1px solid #E5E5E5',
                        bgcolor: '#fff',
                        color: '#B80000',
                        px: 2,
                        '&:hover': {
                            bgcolor: 'rgba(184,0,0,0.04)',
                            borderColor: '#B80000',
                        },
                    }}
                >
                    Назад
                </Button>
            )}

            <Typography component="h1" variant="h4" sx={{ mb: 1.5, color: '#1a1a1a' }}>
                {title}
            </Typography>

            {description && (
                <Typography sx={{ color: '#666', maxWidth: 760 }}>
                    {description}
                </Typography>
            )}
        </Box>
    );
}