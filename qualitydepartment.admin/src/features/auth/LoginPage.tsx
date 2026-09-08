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
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { useAuth } from './AuthProvider';

const getApiError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            data?: {
                errors?: string[] | null;
                message?: string | null;
            };
        };
    };

    const errors = maybeAxios.response?.data?.errors;
    if (errors && errors.length > 0) {
        return errors.join(', ');
    }

    return maybeAxios.response?.data?.message || 'Не вдалося виконати вхід.';
};

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError('');

            await login({
                email: email.trim(),
                password,
            });

            const nextPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
            navigate(nextPath, { replace: true });
        } catch (err) {
            setError(getApiError(err));
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
                        sx={{ width: 72, height: 72, objectFit: 'contain' }}
                    />
                </Box>

                <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
                    Адмін-панель ВЗЯО
                </Typography>

                <Typography sx={{ textAlign: 'center', color: '#666', mb: 4 }}>
                    Увійдіть до адмін-панелі
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={(event) => void handleSubmit(event)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />

                        <MuiLink
                            component={RouterLink}
                            to="/forgot-password"
                            sx={{ alignSelf: 'flex-end' }}
                        >
                            Забули пароль?
                        </MuiLink>

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
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}