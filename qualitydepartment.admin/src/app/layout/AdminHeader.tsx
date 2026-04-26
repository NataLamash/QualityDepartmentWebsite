import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/login': 'Login',
    '/news': 'News',
    '/documents': 'Documents',
    '/administration-members': 'Administration Members',
    '/useful-information': 'Useful Information',
    '/categories': 'Categories',
};

export default function AdminHeader() {
    const location = useLocation();

    const currentTitle = titleMap[location.pathname] ?? 'Admin Panel';

    return (
        <Box
            sx={{
                bgcolor: '#fff',
                borderBottom: '1px solid #EAEAEA',
                mb: 4,
                borderRadius: '0 0 24px 24px',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            }}
        >
            <Box
                sx={{
                    px: { xs: 2, md: 4 },
                    py: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography sx={{ color: '#777', fontSize: '0.85rem', mb: 0.5 }}>
                        Quality Department / Admin
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#1a1a1a' }}>
                        {currentTitle}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        px: 1.5,
                        py: 0.8,
                        borderRadius: '999px',
                        bgcolor: 'rgba(184,0,0,0.08)',
                        color: '#B80000',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                    }}
                >
                    Admin panel
                </Box>
            </Box>

            <Box
                component="img"
                src="/LineBilding.png"
                sx={{
                    width: '100%',
                    display: 'block',
                    mt: '-8px',
                }}
            />
        </Box>
    );
}