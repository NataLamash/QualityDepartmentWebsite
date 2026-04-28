import { Box, Typography } from '@mui/material';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

const modules = [
    { title: 'News', path: '/news', icon: FeedRoundedIcon },
    { title: 'Documents', path: '/documents', icon: DescriptionRoundedIcon },
    { title: 'Administration', path: '/administration-members', icon: GroupsRoundedIcon },
    { title: 'Useful Information', path: '/useful-information', icon: InfoRoundedIcon },
    { title: 'Categories', path: '/categories', icon: CategoryRoundedIcon },
];

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <PageHeader
                title="Dashboard"
                description="Стартова точка адмінки. Звідси команда може переходити до CRUD-модулів."
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

                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {item.title}
                            </Typography>

                            <Typography sx={{ color: '#666' }}>
                                Вхід у модуль керування {item.title.toLowerCase()}.
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}