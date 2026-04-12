import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function AboutBlock() {
    const { i18n } = useTranslation();

    const content = {
        ua: {
            title: 'Про нас',
            description: 'Відділ забезпечення якості освіти є структурним підрозділом університету, який відповідає за впровадження внутрішньої системи забезпечення якості, моніторинг освітніх програм та підтримку академічної доброчесності для досягнення найвищих стандартів навчання.'
        },
        en: {
            title: 'About Us',
            description: 'The Quality Assurance Department is a structural unit of the university responsible for implementing the internal quality assurance system, monitoring educational programs, and supporting academic integrity to achieve the highest standards of education.'
        }
    };

    const currentText = i18n.language === 'en' ? content.en : content.ua;

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
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
                        {currentText.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95, lineHeight: 1.8, fontSize: '1.1rem' }}>
                        {currentText.description}
                    </Typography>
                </Container>

                <Box
                    component="img"
                    src="/bilding.png"
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