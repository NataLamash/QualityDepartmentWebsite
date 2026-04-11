import { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Button,
    CardMedia, CircularProgress, Popover, TextField, Stack, IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import agent from '../../api/agent';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

export default function NewsPage() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [isGridView, setIsGridView] = useState(true);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [tempSearch, setTempSearch] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const getFullImagePath = (path: string) => {
        if (!path) return "/placeholder.png";
        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    const fetchNews = async (pageNum: number, isLoadMore = false) => {
        setLoading(true);
        const lang = i18n.language.startsWith('en') ? 'en' : 'ua';
        try {
            const res = await agent.News.listPaged(pageNum, 9, lang, sortOrder, appliedSearch, appliedDate);
            if (isLoadMore) {
                setNews(prev => [...prev, ...res.items]);
            } else {
                setNews(res.items);
            }
            setTotalCount(res.totalCount);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchNews(1, false);
    }, [i18n.language, sortOrder, appliedSearch, appliedDate]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage, true);
    };

    const handleApplyFilters = () => {
        const dateStr = dateRange.start && dateRange.end ? `${dateRange.start}:${dateRange.end}` : dateRange.start || '';
        setAppliedSearch(tempSearch);
        setAppliedDate(dateStr);
        setAnchorEl(null);
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
            <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: { xs: 4, md: 8 }, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                {i18n.language === 'en' ? 'News' : 'Новини'}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 6, gap: 2, borderBottom: '1px solid #eee', pb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<Box component="img" src="/Filter.png" sx={{ width: 20 }} />}
                    sx={{ borderRadius: '20px', borderColor: '#BA0000', color: '#BA0000', textTransform: 'none', px: 3, fontWeight: 600, '&:hover': { borderColor: '#900000', bgcolor: 'rgba(186,0,0,0.05)' } }}
                >
                    {i18n.language === 'en' ? 'Filters' : 'Фільтри'}
                </Button>

                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <IconButton onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} sx={{ transition: '0.3s', transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' }}>
                        <Box component="img" src="/bx_sort.png" sx={{ width: 24 }} />
                    </IconButton>
                    <Box onClick={() => setIsGridView(!isGridView)} sx={{ bgcolor: isGridView ? '#BA0000' : 'transparent', p: 1, borderRadius: '12px', cursor: 'pointer', display: 'flex', transition: '0.3s', border: '1px solid', borderColor: isGridView ? '#BA0000' : '#eee' }}>
                        <Box component="img" src="/mdi_grid.png" sx={{ width: 24, filter: isGridView ? 'brightness(0) invert(1)' : 'none' }} />
                    </Box>
                </Stack>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: isGridView ? { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } : '1fr',
                gap: { xs: 4, md: isGridView ? 4 : 8 },
                justifyItems: 'center',
                maxWidth: isGridView ? 'none' : { xs: '100%', md: '800px' },
                mx: 'auto'
            }}>
                {news.map((item) => (
                    <Box key={item.id} onClick={() => navigate(`/news/${item.id}`)}
                        sx={{
                            cursor: 'pointer', borderRadius: '32px', overflow: 'hidden',
                            position: 'relative', width: '100%',
                            transition: '0.4s ease',
                            bgcolor: '#fff',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }
                        }}>

                        <Box sx={{ position: 'relative', height: { xs: '350px', md: isGridView ? '400px' : '500px' } }}>
                            <CardMedia component="img" image={getFullImagePath(item.photoPath)} sx={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                            {isGridView && (
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }} />
                            )}
                        </Box>

                        <Box sx={isGridView ? {
                            position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, color: 'white'
                        } : {
                            p: { xs: 3, md: 4 }, bgcolor: '#fff', display: 'flex', flexDirection: 'column'
                        }}>
                            <Typography variant={isGridView ? "h6" : "h4"}
                                sx={{
                                    fontWeight: 800, mb: 2, lineHeight: 1.2,
                                    color: isGridView ? 'white' : '#1a1a1a',
                                    fontSize: isGridView ? '1.25rem' : { xs: '1.5rem', md: '2.2rem' }
                                }}>
                                {item.title}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                mt: 'auto'
                            }}>
                                <Typography variant="caption" sx={{ color: isGridView ? 'rgba(255,255,255,0.7)' : 'text.secondary', fontWeight: 600, fontSize: '1rem' }}>
                                    {new Date(item.publishDate).toLocaleDateString()}
                                </Typography>

                                {!isGridView && (
                                    <Typography sx={{ color: '#BA0000', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
                                        {i18n.language === 'en' ? 'Read more →' : 'Читати далі →'}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            {news.length < totalCount && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <Button onClick={handleLoadMore} disabled={loading} variant="outlined"
                        startIcon={!loading && <Box component="img" src="/material-symbols_replay.png" sx={{ width: 24 }} />}
                        sx={{ borderRadius: '30px', px: 8, py: 2, borderColor: '#BA0000', color: '#BA0000', fontWeight: 800, textTransform: 'none' }}>
                        {loading ? <CircularProgress size={24} sx={{ color: '#BA0000' }} /> : (i18n.language === 'en' ? 'Load more' : 'Завантажити більше')}
                    </Button>
                </Box>
            )}

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: { borderRadius: '24px', width: { xs: '90vw', sm: '350px' }, mt: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }
                    }
                }}
            >
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>{i18n.language === 'en' ? 'Filters' : 'Фільтри'}</Typography>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: '#666' }}>{i18n.language === 'en' ? 'Date range' : 'Період публікації'}</Typography>
                            <Stack spacing={1}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                                />
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                                />
                            </Stack>
                        </Box>
                        <TextField
                            fullWidth
                            placeholder={i18n.language === 'en' ? 'Search...' : 'Пошук...'}
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                            slotProps={{ input: { sx: { borderRadius: '15px' } } }}
                        />
                    </Stack>
                </Box>
                <Button fullWidth onClick={handleApplyFilters} variant="contained" sx={{ bgcolor: '#BA0000', py: 2.5, borderRadius: '0 0 24px 24px', fontWeight: 800, '&:hover': { bgcolor: '#900000' } }}>
                    {i18n.language === 'en' ? 'APPLY' : 'ЗАСТОСУВАТИ'}
                </Button>
            </Popover>
        </Container>
    );
}