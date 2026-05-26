import { Box, Typography } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';

const sidebarItems = [
    { label: 'Панель керування', path: '/dashboard', icon: DashboardRoundedIcon },
    { label: 'Новини', path: '/news', icon: FeedRoundedIcon },
    { label: 'Заходи', path: '/events', icon: EventAvailableRoundedIcon },
    { label: 'Документи', path: '/documents', icon: DescriptionRoundedIcon },
    { label: 'Оцінювання якості вищої освіти', path: '/quality-assessment/internal', icon: FactCheckRoundedIcon },
    { label: 'Адміністрація', path: '/administration', icon: GroupsRoundedIcon },
    { label: 'Корисні посилання', path: '/useful-information', icon: InfoRoundedIcon },
    { label: 'Категорії', path: '/categories', icon: CategoryRoundedIcon },
    { label: 'Теги', path: '/tags', icon: SellRoundedIcon },
    { label: 'Опитування', path: '/surveys', icon: QuizRoundedIcon },
    { label: 'Логін', path: '/login', icon: LoginRoundedIcon },
    
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
                            Адмін-панель ВЗЯО
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#777' }}>
                            КНУ
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sidebarItems.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.path === '/quality-assessment/internal' &&
                            location.pathname.startsWith('/quality-assessment'));
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