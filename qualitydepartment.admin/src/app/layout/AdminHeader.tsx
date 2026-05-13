import { Box, Button, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/news': 'News',
    '/documents': 'Documents',
    '/administration': 'Administration Members',
    '/useful-information': 'Useful Information',
    '/categories': 'Categories',
    '/tags': 'Tags',
};

export default function AdminHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const currentTitle = titleMap[location.pathname] ?? 'Admin Panel';

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

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
                    flexWrap: 'wrap',
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
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
                        {user?.username || 'Admin'}
                    </Box>

                    <Button
                        onClick={handleLogout}
                        startIcon={<LogoutRoundedIcon />}
                        sx={{
                            borderRadius: '999px',
                            border: '1px solid #E5E5E5',
                            color: '#B80000',
                            px: 2,
                            '&:hover': {
                                borderColor: '#B80000',
                                bgcolor: 'rgba(184,0,0,0.04)',
                            },
                        }}
                    >
                        Logout
                    </Button>
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