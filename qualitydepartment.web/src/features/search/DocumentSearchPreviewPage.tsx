import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import agent, { type DocumentItem } from '../../api/agent';
import LanguageFallbackNotice from '../../components/common/LanguageFallbackNotice';

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
    const { i18n, t } = useTranslation();

    const lang = i18n.language.startsWith('en') ? 'en' : 'ua';

    const [documentItem, setDocumentItem] = useState<DocumentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadDocument = async () => {
            if (!id) {
                setLoading(false);
                setError(t('notfound.title'));
                return;
            }

            try {
                setLoading(true);
                setError('');

                const response = await agent.Documents.list(lang);
                const found = response.items.find((item) => item.id === Number(id)) || null;

                if (!active) return;

                if (!found) {
                    setError(t('notfound.title'));
                    setDocumentItem(null);
                } else {
                    setDocumentItem(found);
                }
            } catch (err) {
                console.error('Document preview load error:', err);
                if (active) {
                    setError(t('content.docLoadError'));
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
    }, [id, lang, t]);

    const fileUrl = documentItem?.filePath ? getFullFilePath(documentItem.filePath) : '';
    const title =
        (lang === 'en'
            ? documentItem?.nameEn || documentItem?.name
            : documentItem?.nameUa || documentItem?.name) || 'PDF';

    const hasTranslation = Boolean(lang === 'ua' || (documentItem && (documentItem.nameEn || documentItem.name)));

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
                        '&:focus-visible': {
                            outline: '2px solid #BA0000',
                            outlineOffset: '2px'
                        }
                    }}
                >
                    {t('content.backToArchive')}
                </Button>

                <LanguageFallbackNotice hasTranslation={hasTranslation} />

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#BA0000' }} />
                    </Box>
                )}

                {!loading && error && (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: '#BA0000', fontWeight: 700, mb: 2 }}>
                            {error}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                            {t('notfound.description')}
                        </Typography>
                    </Box>
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
                            <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
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
                                    '&:focus-visible': {
                                        outline: '2px solid #BA0000',
                                        outlineOffset: '2px'
                                    }
                                }}
                            >
                                {t('content.download')}
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