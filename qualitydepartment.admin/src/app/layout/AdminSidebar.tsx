import { Box, Typography } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useLocation, useNavigate } from 'react-router-dom';

const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
    { label: 'News', path: '/news', icon: FeedRoundedIcon },
    { label: 'Documents', path: '/documents', icon: DescriptionRoundedIcon },
    { label: 'Administration', path: '/administration', icon: GroupsRoundedIcon },
    { label: 'Useful Information', path: '/useful-information', icon: InfoRoundedIcon },
    { label: 'Categories', path: '/categories', icon: CategoryRoundedIcon },
    { label: 'Login', path: '/login', icon: LoginRoundedIcon },
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 280,
                bgcolor: '#fff',
                borderRight: '1px solid #EAEAEA',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'sticky',
                top: 0,
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 3,
                    borderBottom: '1px solid #EAEAEA',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Box
                        component="img"
                        src="/logo-knu.png"
                        sx={{ width: 52, height: 52, objectFit: 'contain' }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>
                            Quality Admin
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#777' }}>
                            KNU panel
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Box
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.4,
                                borderRadius: '16px',
                                cursor: 'pointer',
                                bgcolor: isActive ? '#B80000' : 'transparent',
                                color: isActive ? '#fff' : '#333',
                                transition: '0.2s',
                                '&:hover': {
                                    bgcolor: isActive ? '#B80000' : 'rgba(184,0,0,0.05)',
                                },
                            }}
                        >
                            <Icon fontSize="small" />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}