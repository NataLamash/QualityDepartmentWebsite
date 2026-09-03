import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CardMedia,
    Container,
    CircularProgress,
    Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import agent, { type ExternalLink } from '../../api/agent';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

const isGoogleFormUrl = (url?: string | null) =>
    !!url && url.toLowerCase().includes('docs.google.com/forms');

const getFullImagePath = (path: string | undefined) => {
    if (!path) return '/placeholder.png';
    const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return `${API_BASE}/${cleanPath}`;
};

export default function SurveysPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [surveys, setSurveys] = useState<ExternalLink[]>([]);
    const [loading, setLoading] = useState(true);

    const lang = i18n.language.startsWith('en') ? 'en' : 'ua';

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                const response = await agent.ExternalLinks.list(lang);

                const onlyGoogleForms = response
                    .filter((item) => isGoogleFormUrl(item.url))
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

                setSurveys(onlyGoogleForms);
            } catch (err) {
                console.error('Failed to fetch surveys:', err);
            } finally {
                setLoading(false);
            }
        };

        void fetchSurveys();
    }, [lang]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: '#BA0000' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    sx={{
                        fontWeight: 800,
                        mb: { xs: 4, md: 7 },
                        fontSize: { xs: '2.3rem', md: '3.5rem' },
                        color: '#1a1a1a',
                    }}
                >
                    {t('pages.surveys')}
                </Typography>

                {surveys.length === 0 ? (
                    <Typography align="center" sx={{ color: '#666', fontSize: '1.1rem' }}>
                        {t('pages.noSurveys')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, minmax(0, 1fr))',
                            },
                            gap: 4,
                        }}
                    >
                        {surveys.map((survey) => (
                            <Box
                                key={survey.id}
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: '32px',
                                    border: '1px solid #EAEAEA',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    transition: '0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
                                    },
                                    '&:focus-within': {
                                        outline: '2px solid #BA0000',
                                        outlineOffset: '2px'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={getFullImagePath(survey.photoPath)}
                                    alt={survey.name}
                                    loading="lazy"
                                    sx={{
                                        height: { xs: 240, md: 280 },
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />

                                <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            fontSize: { xs: '1.6rem', md: '2rem' },
                                            color: '#1a1a1a',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {survey.name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: '#555',
                                            fontSize: '1.05rem',
                                            lineHeight: 1.8,
                                            mb: 4,
                                            flexGrow: 1,
                                        }}
                                    >
                                        {survey.shortDescription || ''}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        endIcon={<ArrowForwardRoundedIcon />}
                                        onClick={() => navigate(`/surveys/${survey.id}`)}
                                        sx={{
                                            alignSelf: 'flex-start',
                                            borderRadius: '24px',
                                            borderColor: '#BA0000',
                                            color: '#BA0000',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            px: 3,
                                            py: 1.1,
                                            '&:hover': {
                                                borderColor: '#900000',
                                                bgcolor: 'rgba(186,0,0,0.05)',
                                            },
                                            '&:focus-visible': {
                                                outline: '2px solid #BA0000',
                                                outlineOffset: '2px'
                                            }
                                        }}
                                    >
                                        {t('pages.openSurvey')}
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}