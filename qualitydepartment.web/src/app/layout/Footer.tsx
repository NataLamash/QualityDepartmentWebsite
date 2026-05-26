import { Box, Container, Typography, Stack, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { i18n } = useTranslation();

    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.9118557088455!2d30.511100376857116!3d50.44274998725838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cef00099684b%3A0x673412571217343!2z0KfQtdGA0LLQvtC90LjQuSDQutC-0YDQv9GD0YEg0JrQndCjINC_0L7RgdC10LvQtdC90L3Rjw!5e0!3m2!1suk!2sua!4v1712835000000!5m2!1suk!2sua";

    return (
        <Box sx={{ mt: 'auto', width: '100%', bgcolor: '#BA0000', position: 'relative', overflow: 'hidden' }}>

            <Box
                component="img"
                src="/LineBilding2.png"
                sx={{
                    width: '100%',
                    display: 'block',
                    position: 'absolute',
                    top: '20px',
                    left: 0,
                    zIndex: 1,
                }}
            />

            <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 12 }, pb: { xs: 8, md: 10 }, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: 4
                }}>

                    <Box sx={{
                        flex: { xs: '1 1 auto', lg: '0 0 58%' },
                        bgcolor: 'white',
                        color: '#333',
                        p: { xs: 3, md: 5 },
                        borderRadius: '30px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: 4
                        }}>
                            <Stack spacing={2.5} sx={{ flex: { xs: '1 1 auto', md: '0 0 60%' }, width: '100%' }}>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                    <Box component="img" src="/Location.png" sx={{ width: 22, height: 22 }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 }}>
                                        {i18n.language === 'en' ? '60 Volodymyrska str., Kyiv' : 'вулиця Володимирська, 60, Київ'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                    <Box component="img" src="/phone.png" sx={{ width: 22, height: 22 }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>+38(044)239-34-21</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                    <Box component="img" src="/location-pin.png" sx={{ width: 22, height: 22 }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                        {i18n.language === 'en' ? 'Red Building, room 223' : 'Червоний корпус, 223 каб.'}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <IconButton
                                        component="a"
                                        href="https://fb.com/department.quality"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ p: 0, '&:hover': { transform: 'scale(1.1)' }, transition: '0.2s' }}
                                    >
                                        <Box component="img" src="/Facebook.png" sx={{ width: 48, height: 48 }} />
                                    </IconButton>

                                    <IconButton
                                        component="a"
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=department_quality@univ.net.ua"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ p: 0, '&:hover': { transform: 'scale(1.1)' }, transition: '0.2s' }}
                                    >
                                        <Box component="img" src="/Gmail.png" sx={{ width: 48, height: 48 }} />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        flex: { xs: '1 1 auto', lg: '0 0 38%' },
                        height: { xs: 280, lg: 'auto' },
                        minHeight: 280,
                        borderRadius: '30px',
                        overflow: 'hidden',
                        border: '6px solid white',
                        bgcolor: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        position: 'relative'
                    }}>
                        <iframe
                            title="map"
                            src={mapSrc}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}