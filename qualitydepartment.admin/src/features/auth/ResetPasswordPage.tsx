import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Link as MuiLink,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {
    Link as RouterLink,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import agent from '../../api/agent';

const resetErrorMessages: Record<string, string> = {
    InvalidToken:
        'Посилання для відновлення пароля недійсне або прострочене.',
    PasswordTooShort:
        'Новий пароль занадто короткий.',
    PasswordRequiresLower:
        'Пароль має містити хоча б одну малу літеру.',
    PasswordRequiresUpper:
        'Пароль має містити хоча б одну велику літеру.',
    PasswordRequiresDigit:
        'Пароль має містити хоча б одну цифру.',
    PasswordRequiresNonAlphanumeric:
        'Пароль має містити хоча б один спеціальний символ.',
    PasswordRequiresUniqueChars:
        'Пароль не відповідає вимогам щодо унікальних символів.',
};

const getResetError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            data?: {
                errors?: string[] | null;
            };
        };
    };

    const errors = maybeAxios.response?.data?.errors;

    if (!errors || errors.length === 0) {
        return 'Не вдалося змінити пароль. Спробуйте ще раз.';
    }

    return errors
        .map(
            (code) =>
                resetErrorMessages[code] ??
                'Новий пароль не відповідає вимогам безпеки.'
        )
        .join(' ');
};

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const hasResetData = Boolean(email && token);

    const handleSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!hasResetData) {
            setError(
                'Посилання для відновлення пароля недійсне або неповне.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Паролі не збігаються.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await agent.Auth.resetPassword({
                email,
                token,
                newPassword,
            });

            setSuccess(true);

            window.setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500);
        } catch (err) {
            setError(getResetError(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                bgcolor: '#f6f6f6',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 460,
                    p: 4,
                    borderRadius: '28px',
                    border: '1px solid #EAEAEA',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.05)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box
                        component="img"
                        src="/logo-knu.png"
                        sx={{
                            width: 72,
                            height: 72,
                            objectFit: 'contain',
                        }}
                    />
                </Box>

                <Typography
                    variant="h4"
                    sx={{ textAlign: 'center', mb: 1 }}
                >
                    Новий пароль
                </Typography>

                <Typography
                    sx={{
                        textAlign: 'center',
                        color: '#666',
                        mb: 4,
                    }}
                >
                    Вкажіть новий пароль для облікового запису
                </Typography>

                {!hasResetData && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Посилання для відновлення пароля недійсне або неповне.
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Пароль успішно змінено. Повертаємо вас на сторінку входу.
                    </Alert>
                )}

                {hasResetData && !success && (
                    <Box
                        component="form"
                        onSubmit={(event) => void handleSubmit(event)}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2.5,
                            }}
                        >
                            <TextField
                                label="Новий пароль"
                                type="password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                                autoComplete="new-password"
                                fullWidth
                                required
                            />

                            <TextField
                                label="Підтвердження нового пароля"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                autoComplete="new-password"
                                fullWidth
                                required
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting}
                                sx={{
                                    mt: 1,
                                    py: 1.4,
                                    borderRadius: '18px',
                                }}
                            >
                                {submitting ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    'Змінити пароль'
                                )}
                            </Button>
                        </Box>
                    </Box>
                )}

                <MuiLink
                    component={RouterLink}
                    to="/login"
                    sx={{
                        display: 'block',
                        mt: 3,
                        textAlign: 'center',
                    }}
                >
                    Повернутися до входу
                </MuiLink>
            </Paper>
        </Box>
    );
}