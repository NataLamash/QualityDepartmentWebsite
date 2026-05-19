import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import agent, { type DocumentItem } from '../../api/agent';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '');

const getFullFilePath = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return `${API_BASE}/${cleanPath}`;
};

export default function DocumentSearchPreviewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const lang = i18n.language.startsWith('en') ? 'en' : 'ua';

    const [documentItem, setDocumentItem] = useState<DocumentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const text = useMemo(
        () => ({
            back: lang === 'en' ? 'Back to archive' : 'Назад до архіву',
            notFound: lang === 'en' ? 'Document not found.' : 'Документ не знайдено.',
            error:
                lang === 'en'
                    ? 'Failed to load document preview.'
                    : 'Не вдалося завантажити перегляд документа.',
            download: lang === 'en' ? 'Download' : 'Завантажити',
        }),
        [lang]
    );

    useEffect(() => {
        let active = true;

        const loadDocument = async () => {
            if (!id) {
                setLoading(false);
                setError(text.notFound);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const response = await agent.Documents.list(lang);
                const found = response.items.find((item) => item.id === Number(id)) || null;

                if (!active) return;

                if (!found) {
                    setError(text.notFound);
                    setDocumentItem(null);
                } else {
                    setDocumentItem(found);
                }
            } catch (err) {
                console.error('Document preview load error:', err);
                if (active) {
                    setError(text.error);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadDocument();

        return () => {
            active = false;
        };
    }, [id, lang, text.error, text.notFound]);

    const fileUrl = documentItem?.filePath ? getFullFilePath(documentItem.filePath) : '';
    const title =
        (lang === 'en'
            ? documentItem?.nameEn || documentItem?.name
            : documentItem?.nameUa || documentItem?.name) || 'PDF';

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Button
                    onClick={() => navigate('/archive')}
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
                    }}
                >
                    {text.back}
                </Button>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#BA0000' }} />
                    </Box>
                )}

                {!loading && error && (
                    <Typography sx={{ color: '#BA0000', fontWeight: 700 }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && documentItem && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', md: 'center' },
                                gap: 2,
                                flexDirection: { xs: 'column', md: 'row' },
                                mb: 3,
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {title}
                            </Typography>

                            <Button
                                component="a"
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                variant="outlined"
                                startIcon={<DownloadRoundedIcon />}
                                sx={{
                                    borderRadius: '24px',
                                    borderColor: '#BA0000',
                                    color: '#BA0000',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    '&:hover': {
                                        borderColor: '#900000',
                                        bgcolor: 'rgba(186,0,0,0.05)',
                                    },
                                }}
                            >
                                {text.download}
                            </Button>
                        </Box>

                        <Box
                            component="iframe"
                            src={`${fileUrl}#toolbar=1&navpanes=0`}
                            title={title}
                            sx={{
                                width: '100%',
                                height: { xs: '70vh', md: '80vh' },
                                border: '1px solid #EAEAEA',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                bgcolor: '#fff',
                            }}
                        />
                    </>
                )}
            </Container>
        </Box>
    );
}