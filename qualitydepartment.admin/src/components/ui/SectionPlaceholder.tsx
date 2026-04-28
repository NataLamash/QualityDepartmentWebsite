import { Box, Button, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PageHeader from './PageHeader';

interface Props {
    title: string;
    description: string;
    buttonLabel?: string;
}

export default function SectionPlaceholder({
    title,
    description,
    buttonLabel = 'Створити',
}: Props) {
    return (
        <Box>
            <PageHeader title={title} description={description} />

            <Box
                sx={{
                    bgcolor: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #EAEAEA',
                    p: { xs: 3, md: 4 },
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Модуль у розробці
                        </Typography>
                        <Typography sx={{ color: '#666' }}>
                            Тут буде список, фільтри, таблиця й форми створення/редагування.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            borderRadius: '18px',
                            px: 2.5,
                            py: 1.2,
                        }}
                    >
                        {buttonLabel}
                    </Button>
                </Box>

                <Box
                    sx={{
                        minHeight: 280,
                        borderRadius: '20px',
                        border: '1px dashed #D7D7D7',
                        bgcolor: '#FAFAFA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 3,
                    }}
                >
                    <Typography sx={{ color: '#777', maxWidth: 480 }}>
                        Команда вже може використовувати цю сторінку як точку входу для CRUD-логіки,
                        таблиць, форм і API-інтеграції.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}