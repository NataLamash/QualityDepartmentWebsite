import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Stack, Button,
    Divider, CircularProgress, Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import agent, { type NewsItem, type PagedResponse } from '../../api/agent';
import LanguageFallbackNotice from '../../components/common/LanguageFallbackNotice';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

export default function NewsDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

    const [news, setNews] = useState<NewsItem | null>(null);
    const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasTranslation, setHasTranslation] = useState(true);

    const isEventDetail = window.location.pathname.includes('/events');

    const getFullImagePath = (path: string | undefined) => {
        if (!path) return "/placeholder.png";
        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            const lang = i18n.language.startsWith('en') ? 'en' : 'ua';
            try {
                const details = await agent.News.details(Number(id), lang);
                setNews(details);

                // Перевірка перекладу (якщо мова EN, але прийшов текст з маркером відсутності або пустий)
                if (lang === 'en' && !details.title) {
                    setHasTranslation(false);
                } else {
                    setHasTranslation(true);
                }

                const latestRes = isEventDetail
                    ? await agent.Events.listPaged(1, 4, lang, 'desc')
                    : await agent.News.list(4, lang);

                const latestItems = (latestRes as PagedResponse<NewsItem>).items
                    ? (latestRes as PagedResponse<NewsItem>).items
                    : (latestRes as NewsItem[]);

                setLatestNews(latestItems.filter((n: NewsItem) => n.id !== Number(id)).slice(0, 3));
            } catch (err) {
                console.error(err);
                setNews(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
        window.scrollTo(0, 0);
    }, [id, i18n.language, isEventDetail]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: '#BA0000' }} />
        </Box>
    );

    if (!news) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a' }}>
                    {t('notfound.title')}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                    {t('notfound.description')}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate(isEventDetail ? '/events' : '/news')}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        bgcolor: '#BA0000',
                        color: '#fff',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#8B0000' },
                        '&:focus-visible': { outline: '2px solid #BA0000', outlineOffset: '2px' }
                    }}
                >
                    {isEventDetail ? t('content.backToEvents') : t('content.backToNews')}
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Box sx={{ position: 'relative', height: { xs: '400px', md: '600px' }, mb: 6 }}>
                <Box
                    component="img"
                    src={getFullImagePath(news.photoPath)}
                    alt={news.title || 'Header banner'}
                    loading="lazy"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                    display: 'flex', alignItems: 'flex-end', pb: 6
                }}>
                    <Container maxWidth="lg">
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(isEventDetail ? '/events' : '/news')}
                            sx={{
                                color: 'white',
                                mb: 4,
                                textTransform: 'none',
                                '&:focus-visible': { outline: '2px solid #fff', outlineOffset: '2px' }
                            }}
                        >
                            {isEventDetail ? t('content.backToEvents') : t('content.backToNews')}
                        </Button>

                        <Typography variant="h1" sx={{ color: 'white', fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            {news.title}
                        </Typography>
                        <Stack direction="row" spacing={3} sx={{ color: 'rgba(255,255,255,0.8)', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <CalendarMonthIcon fontSize="small" />
                                <Typography>{new Date(news.publishDate).toLocaleDateString()}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <AccessTimeIcon fontSize="small" />
                                <Typography>3 {t('content.minRead')}</Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>

            <Container maxWidth="lg">
                <LanguageFallbackNotice hasTranslation={hasTranslation} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{
                            '& p': { fontSize: '1.2rem', lineHeight: 1.8, mb: 3, color: '#333' },
                            '& img': { maxWidth: '100%', borderRadius: '20px', my: 2 },
                            '& ul, & ol': { fontSize: '1.2rem', lineHeight: 1.8, mb: 3, ml: 3 }
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: news.fullText || '' }} />
                        </Box>
                        <Divider sx={{ mt: 6, mb: 4 }} />
                    </Box>

                    {latestNews.length > 0 && (
                        <Box sx={{ mb: 6, width: '100%' }}>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 4, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                {isEventDetail ? t('content.latestEvents') : t('content.latestNews')}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                flexWrap: 'wrap',
                                gap: 4
                            }}>
                                {latestNews.map((item) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 22px)' },
                                            display: 'flex'
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            onClick={() => navigate(isEventDetail ? `/events/${item.id}` : `/news/${item.id}`)}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    navigate(isEventDetail ? `/events/${item.id}` : `/news/${item.id}`);
                                                }
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                bgcolor: '#f9f9f9',
                                                p: 2.5,
                                                borderRadius: '24px',
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: '0.3s',
                                                '&:hover': {
                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                                    '& img': { transform: 'scale(1.03)' }
                                                },
                                                '&:focus-visible': {
                                                    outline: '2px solid #BA0000',
                                                    outlineOffset: '2px'
                                                }
                                            }}
                                        >
                                            <Box sx={{ width: '100%', height: 180, borderRadius: '16px', overflow: 'hidden', mb: 2 }}>
                                                <Box
                                                    component="img"
                                                    src={getFullImagePath(item.photoPath)}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                                                />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1, fontSize: '1.1rem' }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
                                                {new Date(item.publishDate).toLocaleDateString()}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}