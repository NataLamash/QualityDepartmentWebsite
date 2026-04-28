import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Stack, Button,
    Divider, CircularProgress, Paper, Grid 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import agent, { type NewsItem } from '../../api/agent';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

export default function NewsDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const [news, setNews] = useState<NewsItem | null>(null);
    const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

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
                const latest = await agent.News.list(4, lang);
                setLatestNews(latest.filter((n) => n.id !== Number(id)).slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
        window.scrollTo(0, 0);
    }, [id, i18n.language]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: '#BA0000' }} />
        </Box>
    );

    if (!news) return <Typography align="center" sx={{ py: 10 }}>Новину не знайдено</Typography>;

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Box sx={{ position: 'relative', height: { xs: '400px', md: '600px' }, mb: 6 }}>
                <Box
                    component="img"
                    src={getFullImagePath(news.photoPath)}
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
                            onClick={() => navigate('/news')}
                            sx={{ color: 'white', mb: 4, textTransform: 'none' }}
                        >
                            {i18n.language === 'en' ? 'Back to News' : 'Назад до новин'}
                        </Button>
                        <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            {news.title}
                        </Typography>
                        <Stack direction="row" spacing={3} sx={{ color: 'rgba(255,255,255,0.8)', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <CalendarMonthIcon fontSize="small" />
                                <Typography>{new Date(news.publishDate).toLocaleDateString()}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <AccessTimeIcon fontSize="small" />
                                <Typography>3 {i18n.language === 'en' ? 'min read' : 'хв читання'}</Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={6}>

                    <Grid item xs={12} md={8}>
                        <Box sx={{
                            '& p': { fontSize: '1.2rem', lineHeight: 1.8, mb: 3, color: '#333' },
                            '& img': { maxWidth: '100%', borderRadius: '20px', my: 2 },
                            '& ul, & ol': { fontSize: '1.2rem', lineHeight: 1.8, mb: 3, ml: 3 }
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: news.fullText || '' }} />
                        </Box>
                        <Divider sx={{ my: 6 }} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{ p: 4, bgcolor: '#f9f9f9', borderRadius: '30px', position: { md: 'sticky' }, top: 100, mb: 4 }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
                                {i18n.language === 'en' ? 'Latest News' : 'Останні новини'}
                            </Typography>
                            <Stack spacing={4}>
                                {latestNews.map((item) => (
                                    <Box
                                        key={item.id}
                                        onClick={() => navigate(`/news/${item.id}`)}
                                        sx={{ cursor: 'pointer', '&:hover img': { transform: 'scale(1.05)' } }}
                                    >
                                        <Box sx={{ width: '100%', height: 150, borderRadius: '20px', overflow: 'hidden', mb: 2 }}>
                                            <Box
                                                component="img"
                                                src={getFullImagePath(item.photoPath)}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                                            />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(item.publishDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}