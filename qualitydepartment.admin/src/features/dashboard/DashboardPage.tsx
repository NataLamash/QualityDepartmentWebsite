import { Box, Typography } from '@mui/material';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

const modules = [
    { title: 'Новини', path: '/news', icon: FeedRoundedIcon },
    { title: 'Документи', path: '/documents', icon: DescriptionRoundedIcon },
    { title: 'Адміністрація', path: '/administration', icon: GroupsRoundedIcon },
    { title: 'Корисна інформація', path: '/useful-information', icon: InfoRoundedIcon },
    { title: 'Категорії', path: '/categories', icon: CategoryRoundedIcon },
    { title: 'Теги', path: '/tags', icon: SellRoundedIcon },
    { title: 'Опитування', path: '/surveys', icon: QuizRoundedIcon },
];

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <PageHeader
                title="Панель керування"
                description="Стартова точка адмін-панелі. Звідси можна перейти до всіх CRUD-модулів."
                showBackButton={false}
            />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        xl: 'repeat(3, minmax(0, 1fr))',
                    },
                    gap: 3,
                }}
            >
                {modules.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Box
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: '28px',
                                border: '1px solid #EAEAEA',
                                p: 3,
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                transition: '0.25s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '18px',
                                    bgcolor: '#B80000',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <Icon />
                            </Box>

                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                                {item.title}
                            </Typography>

                            <Typography sx={{ color: '#666' }}>
                                Перейти до модуля керування: {item.title.toLowerCase()}.
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}