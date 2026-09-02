import { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, CardMedia, CircularProgress, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import agent, { type NewsItem, type AdministrationMember } from '../../api/agent';
import AboutBlock from '../../app/layout/AboutBlock';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { type Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

const commonGlassStyle = {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    backdropFilter: 'blur(15px)',
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    p: 2.5,
    borderRadius: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '80px',
    zIndex: 2,
    transition: '0.3s ease-in-out',
};

const navBtnStyle = {
    bgcolor: '#fff',
    color: '#b71c1c',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    width: 48,
    height: 48,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    transition: 'all 0.3s ease',
    '&:hover': {
        bgcolor: '#b71c1c',
        color: '#fff',
        transform: 'translateY(-50%) scale(1.1)'
    },
    '&:focus-visible': {
        outline: '2px solid #BA0000',
        outlineOffset: '2px'
    },
    display: { xs: 'none', md: 'flex' }
};

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [news, setNews] = useState<NewsItem[]>([]);
    const [adminMembers, setAdminMembers] = useState<AdministrationMember[]>([]);
    const [loading, setLoading] = useState(true);

    const newsSwiperRef = useRef<SwiperType | null>(null);
    const adminSwiperRef = useRef<SwiperType | null>(null);

    const getFullImagePath = (path: string | undefined) => {
        if (!path) return "/placeholder.png";
        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    const getAdminImagePath = (path: string | undefined) => {
        if (!path) return "/user-placeholder.png";
        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const currentLang = i18n.language.startsWith('en') ? 'en' : 'ua';
            try {
                const newsRes = await agent.News.list(5, currentLang);
                const adminRes = await agent.Administration.list(currentLang);

                setNews(newsRes);
                setAdminMembers([...adminRes].sort((a, b) => a.sortOrder - b.sortOrder));
            } catch (err) {
                console.error("Помилка завантаження:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [i18n.language]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress sx={{ color: '#b71c1c' }} />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
            <Container sx={{ py: 10 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 4, md: 8 }
                }}>
                    <Box sx={{ flex: 1.5 }}>
                        <Typography component="h1" variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' }, color: '#1a1a1a' }}>
                            {t('home.title')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555', fontSize: '1.2rem', lineHeight: 1.8 }}>
                            {t('home.description')}
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '520px',
                            mx: 'auto',
                            px: { xs: 0, md: 7 }
                        }}>
                            <IconButton
                                onClick={() => newsSwiperRef.current?.slidePrev()}
                                aria-label={t('accessibility.prevSlide')}
                                sx={{ ...navBtnStyle, left: 0 }}
                            >
                                <ChevronLeft />
                            </IconButton>

                            <Swiper
                                onBeforeInit={(swiper) => { newsSwiperRef.current = swiper; }}
                                modules={[Pagination, Autoplay, Navigation]}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000 }}
                                style={{ borderRadius: '40px', height: '580px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            >
                                {news.map((item) => (
                                    <SwiperSlide
                                        key={item.id}
                                        onClick={() => navigate(`/news/${item.id}`)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={item.title}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                navigate(`/news/${item.id}`);
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Box sx={{
                                            position: 'relative',
                                            height: '100%',
                                            '&:hover .glass': { bottom: 30, bgcolor: 'rgba(255, 255, 255, 0.9)' },
                                            '&:focus-visible': { outline: '2px solid #BA0000', borderRadius: '40px' }
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={getFullImagePath(item.photoPath)}
                                                alt={item.title}
                                                loading="lazy"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                    e.currentTarget.src = '/placeholder.png';
                                                }}
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Box className="glass" sx={commonGlassStyle}>
                                                <Typography variant="body1" sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '1.1rem' }}>
                                                    {item.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <IconButton
                                onClick={() => newsSwiperRef.current?.slideNext()}
                                aria-label={t('accessibility.nextSlide')}
                                sx={{ ...navBtnStyle, right: 0 }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Container>

            <AboutBlock />

            <Container sx={{ py: 12 }}>
                <Typography variant="h2" sx={{ mb: 6, fontWeight: 800, color: '#1a1a1a', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                    {t('home.ourTeam')}
                </Typography>

                <Box sx={{ position: 'relative' }}>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 0, md: 8 }
                    }}>
                        <IconButton
                            onClick={() => adminSwiperRef.current?.slidePrev()}
                            aria-label={t('accessibility.prevSlide')}
                            sx={{ ...navBtnStyle, left: 0 }}
                        >
                            <ChevronLeft />
                        </IconButton>

                        <Swiper
                            onBeforeInit={(swiper) => { adminSwiperRef.current = swiper; }}
                            modules={[Autoplay, Navigation]}
                            spaceBetween={30}
                            autoplay={{ delay: 6000 }}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                700: { slidesPerView: 2 },
                                1100: { slidesPerView: 3 }
                            }}
                        >
                            {adminMembers.map((person) => (
                                <SwiperSlide key={person.id}>
                                    <Box sx={{
                                        borderRadius: '80px 80px 30px 30px',
                                        height: 520,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                        bgcolor: '#fff',
                                        '&:hover img': { transform: 'scale(1.05)' }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={getAdminImagePath(person.photoPath)}
                                            alt={person.fullName}
                                            loading="lazy"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                e.currentTarget.src = '/user-placeholder.png';
                                            }}
                                            sx={{
                                                height: '100%',
                                                width: '100%',
                                                objectPosition: 'top',
                                                objectFit: 'cover',
                                                transition: '0.6s'
                                            }}
                                        />
                                        <Box sx={commonGlassStyle}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1.1rem', mb: 0.5 }}>
                                                {person.fullName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#555',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.4,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {person.position}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <IconButton
                            onClick={() => adminSwiperRef.current?.slideNext()}
                            aria-label={t('accessibility.nextSlide')}
                            sx={{ ...navBtnStyle, right: 0 }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}