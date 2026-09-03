import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function AboutBlock() {
    const { t } = useTranslation();

    return (
        <Box sx={{ position: 'relative', width: '100%', bgcolor: 'background.default' }}>
            <Box sx={{
                bgcolor: '#BA0000',
                color: 'white',
                pt: 8,
                pb: 0,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2, mb: { xs: 5, md: 10 } }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                        {t('about.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95, lineHeight: 1.8, fontSize: '1.1rem' }}>
                        {t('about.description')}
                    </Typography>
                </Container>

                <Box
                    component="img"
                    src="/bilding.png"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    sx={{
                        width: '100%',
                        display: 'block',
                        position: 'relative',
                        zIndex: 1,
                        mt: -5
                    }}
                />
            </Box>
        </Box>
    );
}