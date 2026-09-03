import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import agent, { type ExternalLink } from '../../api/agent';
import LanguageFallbackNotice from '../../components/common/LanguageFallbackNotice';

const isGoogleFormUrl = (url?: string | null) =>
    !!url && url.toLowerCase().includes('docs.google.com/forms');

const normalizeGoogleFormUrl = (url: string) => {
    const trimmed = url.trim();

    if (trimmed.includes('<iframe')) {
        const match = trimmed.match(/src="([^"]+)"/i);
        if (match?.[1]) {
            return normalizeGoogleFormUrl(match[1]);
        }
    }

    const withoutPli = trimmed.replace(/([?&])pli=1(&|$)/i, '$1').replace(/[?&]$/, '');

    if (withoutPli.includes('embedded=true')) {
        return withoutPli;
    }

    return withoutPli.includes('?')
        ? `${withoutPli}&embedded=true`
        : `${withoutPli}?embedded=true`;
};

export default function SurveyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

    const [survey, setSurvey] = useState<ExternalLink | null>(null);
    const [loading, setLoading] = useState(true);

    const lang = i18n.language.startsWith('en') ? 'en' : 'ua';

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                setLoading(true);
                const response = await agent.ExternalLinks.list(lang);
                const found =
                    response.find(
                        (item) =>
                            item.id === Number(id) && isGoogleFormUrl(item.url)
                    ) || null;

                setSurvey(found);
            } catch (err) {
                console.error('Failed to fetch survey:', err);
                setSurvey(null);
            } finally {
                setLoading(false);
            }
        };

        void fetchSurvey();
    }, [id, lang]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: '#BA0000' }} />
            </Box>
        );
    }

    if (!survey) {
        return (
            <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
                        {t('notfound.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                        {t('notfound.description')}
                    </Typography>
                    <Button
                        onClick={() => navigate('/surveys')}
                        startIcon={<ArrowBackRoundedIcon />}
                        variant="contained"
                        sx={{
                            bgcolor: '#BA0000',
                            color: '#fff',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#8B0000' },
                            '&:focus-visible': { outline: '2px solid #BA0000', outlineOffset: '2px' }
                        }}
                    >
                        {t('content.backToSurveys')}
                    </Button>
                </Container>
            </Box>
        );
    }

    const hasTranslation = Boolean(lang === 'ua' || survey.name);

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Button
                    onClick={() => navigate('/surveys')}
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{
                        mb: 3,
                        borderRadius: '18px',
                        border: '1px solid #E5E5E5',
                        bgcolor: '#fff',
                        color: '#B80000',
                        px: 2,
                        '&:hover': {
                            bgcolor: 'rgba(184,0,0,0.04)',
                            borderColor: '#B80000',
                        },
                        '&:focus-visible': {
                            outline: '2px solid #BA0000',
                            outlineOffset: '2px'
                        }
                    }}
                >
                    {t('content.backToSurveys')}
                </Button>

                <LanguageFallbackNotice hasTranslation={hasTranslation} />

                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: '2rem', md: '2.8rem' },
                        color: '#1a1a1a',
                    }}
                >
                    {survey.name}
                </Typography>

                {survey.shortDescription && (
                    <Typography
                        sx={{
                            color: '#555',
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            mb: 4,
                            maxWidth: '900px',
                        }}
                    >
                        {survey.shortDescription}
                    </Typography>
                )}

                <Box
                    sx={{
                        borderRadius: '28px',
                        overflow: 'hidden',
                        border: '1px solid #EAEAEA',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        bgcolor: '#fff',
                    }}
                >
                    <Box
                        component="iframe"
                        src={normalizeGoogleFormUrl(survey.url)}
                        title={survey.name}
                        sx={{
                            width: '100%',
                            height: { xs: '85vh', md: '1300px' },
                            border: 'none',
                            display: 'block',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}