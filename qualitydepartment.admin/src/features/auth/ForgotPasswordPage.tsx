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
import { Link as RouterLink } from 'react-router-dom';
import agent from '../../api/agent';

const neutralMessage =
    'Якщо обліковий запис з такою електронною адресою існує, ми надіслали інструкції для відновлення пароля.';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            const response = await agent.Auth.forgotPassword({
                email: email.trim(),
            });

            setSuccessMessage(response.message ?? neutralMessage);
        } catch {
            setError(
                'Не вдалося надіслати запит. Спробуйте ще раз пізніше.'
            );
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
                    Відновлення пароля
                </Typography>

                <Typography
                    sx={{
                        textAlign: 'center',
                        color: '#666',
                        mb: 4,
                    }}
                >
                    Введіть електронну адресу вашого облікового запису
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
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
                                'Надіслати інструкції'
                            )}
                        </Button>

                        <MuiLink
                            component={RouterLink}
                            to="/login"
                            sx={{ textAlign: 'center' }}
                        >
                            Повернутися до входу
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}