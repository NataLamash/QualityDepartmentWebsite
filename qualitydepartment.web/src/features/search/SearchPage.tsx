import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import agent, { type GlobalSearchResultItem } from '../../api/agent';

const getTypeMeta = (type: string, lang: 'ua' | 'en') => {
    switch (type) {
        case 'News':
            return {
                label: lang === 'en' ? 'News' : 'Новина',
                icon: <ArticleRoundedIcon fontSize="small" />,
            };
        case 'Document':
            return {
                label: lang === 'en' ? 'Document' : 'Документ',
                icon: <DescriptionRoundedIcon fontSize="small" />,
            };
        case 'ExternalLink':
            return {
                label: lang === 'en' ? 'Useful information' : 'Корисна інформація',
                icon: <LinkRoundedIcon fontSize="small" />,
            };
        default:
            return {
                label: type,
                icon: <SearchRoundedIcon fontSize="small" />,
            };
    }
};

const formatDate = (date: string, lang: 'ua' | 'en') => {
    const locale = lang === 'en' ? 'en-GB' : 'uk-UA';
    return new Date(date).toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export default function SearchPage() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const lang = i18n.language.startsWith('en') ? 'en' : 'ua';
    const query = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return (params.get('q') || '').trim();
    }, [location.search]);

    const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const text = {
        title: lang === 'en' ? 'Search results' : 'Результати пошуку',
        searchingFor: lang === 'en' ? 'Search query' : 'Пошуковий запит',
        empty:
            lang === 'en'
                ? 'No results found for your query.'
                : 'За вашим запитом нічого не знайдено.',
        tooShort:
            lang === 'en'
                ? 'Enter at least 3 characters.'
                : 'Введіть щонайменше 3 символи.',
        error:
            lang === 'en'
                ? 'Failed to load search results.'
                : 'Не вдалося завантажити результати пошуку.',
        open: lang === 'en' ? 'Open' : 'Відкрити',
    };

    useEffect(() => {
        let active = true;

        const loadResults = async () => {
            if (!query) {
                setResults([]);
                setError('');
                return;
            }

            if (query.length < 3) {
                setResults([]);
                setError(text.tooShort);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const response = await agent.Search.global(query, lang);

                if (active) {
                    setResults(response);
                }
            } catch (err) {
                console.error('Search error:', err);
                if (active) {
                    setError(text.error);
                    setResults([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadResults();

        return () => {
            active = false;
        };
    }, [query, lang, text.error, text.tooShort]);

    const handleOpenResult = (item: GlobalSearchResultItem) => {
        if (item.type === 'ExternalLink') {
            window.open(item.link, '_blank', 'noopener,noreferrer');
            return;
        }

        navigate(item.link);
    };

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    sx={{
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: '2.3rem', md: '3.5rem' },
                    }}
                >
                    {text.title}
                </Typography>

                <Typography
                    align="center"
                    sx={{
                        color: '#666',
                        mb: 6,
                        fontSize: '1.05rem',
                    }}
                >
                    {text.searchingFor}: <strong>{query || '—'}</strong>
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#BA0000' }} />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="warning" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && results.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '28px',
                            border: '1px solid #EAEAEA',
                            p: { xs: 3, md: 5 },
                            textAlign: 'center',
                            bgcolor: '#fafafa',
                        }}
                    >
                        <Typography sx={{ color: '#666', fontSize: '1.05rem' }}>
                            {text.empty}
                        </Typography>
                    </Paper>
                )}

                {!loading && !error && results.length > 0 && (
                    <Stack spacing={3}>
                        {results.map((item) => {
                            const typeMeta = getTypeMeta(item.type, lang);

                            return (
                                <Paper
                                    key={`${item.type}-${item.id}`}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '28px',
                                        border: '1px solid #EAEAEA',
                                        p: { xs: 3, md: 4 },
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: { xs: 'flex-start', md: 'center' },
                                            gap: 2,
                                            flexDirection: { xs: 'column', md: 'row' },
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 2,
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <Chip
                                                    icon={typeMeta.icon}
                                                    label={typeMeta.label}
                                                    sx={{
                                                        bgcolor: 'rgba(186,0,0,0.08)',
                                                        color: '#BA0000',
                                                        fontWeight: 700,
                                                    }}
                                                />

                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: '#888', fontWeight: 600 }}
                                                >
                                                    {formatDate(item.publishDate, lang)}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 800,
                                                    mb: 1.5,
                                                    color: '#1a1a1a',
                                                    fontSize: { xs: '1.3rem', md: '1.6rem' },
                                                }}
                                            >
                                                {item.title}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: '#555',
                                                    lineHeight: 1.8,
                                                    mb: 0,
                                                }}
                                            >
                                                {item.shortDescription || ''}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            endIcon={<OpenInNewRoundedIcon />}
                                            onClick={() => handleOpenResult(item)}
                                            sx={{
                                                borderRadius: '24px',
                                                borderColor: '#BA0000',
                                                color: '#BA0000',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                px: 3,
                                                py: 1.1,
                                                whiteSpace: 'nowrap',
                                                '&:hover': {
                                                    borderColor: '#900000',
                                                    bgcolor: 'rgba(186,0,0,0.05)',
                                                },
                                            }}
                                        >
                                            {text.open}
                                        </Button>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}