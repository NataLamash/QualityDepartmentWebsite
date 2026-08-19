import { Box, Container, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: '#f9f9f9',
        py: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Основна секція помилки */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '4rem', md: '6rem', lg: '8rem' }, 
              fontWeight: 900, 
              color: '#BA0000', 
              lineHeight: 1,
              mb: 2
            }}
          >
            404
          </Typography>

          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.5rem' }, 
              fontWeight: 800, 
              color: '#1a1a1a',
              mb: 2
            }}
          >
            {t('notfound.title')}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.2rem' }, 
              color: '#555',
              lineHeight: 1.8,
              maxWidth: '600px',
              mx: 'auto',
              mb: 4
            }}
          >
            {t('notfound.description')}
          </Typography>

          {/* CTA Кнопки */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#BA0000',
                color: '#fff',
                fontWeight: 700,
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                borderRadius: '8px',
                '&:hover': { bgcolor: '#8B0000' },
                '&:focus-visible': {
                  outline: '2px solid #555',
                  outlineOffset: '2px'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              startIcon={<HomeIcon />}
            >
              {t('notfound.goHome')}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                color: '#BA0000',
                borderColor: '#BA0000',
                fontWeight: 700,
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                borderRadius: '8px',
                '&:hover': { 
                  bgcolor: 'rgba(186, 0, 0, 0.08)',
                  borderColor: '#BA0000'
                },
                '&:focus-visible': {
                  outline: '2px solid #BA0000',
                  outlineOffset: '2px'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ArrowBackIcon />
              {t('header.back')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
