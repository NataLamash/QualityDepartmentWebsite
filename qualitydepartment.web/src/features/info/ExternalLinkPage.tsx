import { useEffect, useState } from 'react';
import { 
    Box, Container, Typography, CardMedia, 
    CircularProgress, Stack, Link 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import agent, { type ExternalLink } from '../../api/agent';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

export default function ExternalLinkPage() {
    const { i18n } = useTranslation();
    const [links, setLinks] = useState<ExternalLink[]>([]);
    const [loading, setLoading] = useState(true);

    const getFullImagePath = (path: string | undefined) => {
        if (!path) return "/placeholder.png";
        const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
        return `${API_BASE}/${cleanPath}`;
    };

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true);
            const lang = i18n.language.startsWith('en') ? 'en' : 'ua';
            try {
                const res = await agent.ExternalLinks.list(lang);
                setLinks(res);
            } catch (err) {
                console.error("Failed to fetch external links:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, [i18n.language]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress sx={{ color: '#BA0000' }} />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#fff' }}>
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Stack spacing={12}> 
                    {links.map((link) => (
                        <Box 
                            key={link.id}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column-reverse', md: 'row' },
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: { xs: 4, md: 10 }
                            }}
                        >
                            <Box sx={{ flex: 1.2 }}>
                                <Typography 
                                    variant="h2" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        mb: 3, 
                                        fontSize: { xs: '2rem', md: '3.5rem' }, 
                                        color: '#1a1a1a',
                                        lineHeight: 1.1 
                                    }}
                                >
                                    {link.name}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: '#555', 
                                        fontSize: '1.2rem', 
                                        lineHeight: 1.8,
                                        mb: 4 
                                    }}
                                >
                                    {link.shortDescription || 'Впровадження стандартів та системний моніторинг якості освіти для забезпечення високого рівня підготовки фахівців.'}
                                </Typography>
                                
                                <Link 
                                    href={link.url} 
                                    target="_blank" 
                                    sx={{ 
                                        display: 'inline-block',
                                        color: '#BA0000', 
                                        fontWeight: 800, 
                                        fontSize: '1rem', 
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        letterSpacing: '1px',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    {i18n.language === 'en' ? 'Learn more →' : 'Дізнатися більше →'}
                                </Link>
                            </Box>

                            <Box sx={{ flex: 1, width: '100%' }}>
                                <Link href={link.url} target="_blank" sx={{ display: 'block' }}>
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        borderRadius: '40px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.4s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)'
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={getFullImagePath(link.photoPath)}
                                            sx={{ 
                                                height: { xs: '300px', md: '450px' }, 
                                                width: '100%', 
                                                objectFit: 'cover' 
                                            }}
                                        />
                                    </Box>
                                </Link>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                {links.length === 0 && (
                    <Typography align="center" color="text.secondary">
                        {i18n.language === 'en' ? 'No information available.' : 'Інформація відсутня.'}
                    </Typography>
                )}
            </Container>
        </Box>
    );
}