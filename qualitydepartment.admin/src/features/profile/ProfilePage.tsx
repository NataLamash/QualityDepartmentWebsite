import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import agent from '../../api/agent';

interface ProfileForm {
    lastName: string;
    firstName: string;
    patronymic: string;
    email: string;
    phoneNumber: string;
}

interface FormErrors {
    lastName?: string;
    firstName?: string;
    patronymic?: string;
    email?: string;
    phoneNumber?: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordFormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const emptyForm: ProfileForm = {
    lastName: '',
    firstName: '',
    patronymic: '',
    email: '',
    phoneNumber: '',
};

const emptyPasswordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getBackendError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            data?: {
                errors?: string[] | null;
                message?: string | null;
            };
        };
    };
    

    const errors =
        maybeAxios.response?.data?.errors ?? [];

    if (errors.includes('EMAIL_ALREADY_IN_USE')) {
        return 'Користувач з такою електронною адресою вже існує.';
    }

    if (errors.includes('InvalidEmail')) {
        return 'Вкажіть коректну електронну адресу.';
    }

    return (
        maybeAxios.response?.data?.message ||
        'Не вдалося зберегти зміни. Спробуйте ще раз.'
    );
};

const passwordErrorMessages: Record<string, string> = {
    PasswordMismatch:
        'Поточний пароль вказано неправильно.',

    PasswordTooShort:
        'Новий пароль занадто короткий.',

    PasswordRequiresLower:
        'Новий пароль має містити хоча б одну малу літеру.',

    PasswordRequiresUpper:
        'Новий пароль має містити хоча б одну велику літеру.',

    PasswordRequiresDigit:
        'Новий пароль має містити хоча б одну цифру.',

    PasswordRequiresNonAlphanumeric:
        'Новий пароль має містити хоча б один спеціальний символ.',

    PasswordRequiresUniqueChars:
        'Новий пароль не відповідає вимогам щодо унікальних символів.',
};

const getChangePasswordError = (error: unknown) => {
    const maybeAxios = error as {
        response?: {
            data?: {
                errors?: string[] | null;
                message?: string | null;
            };
        };
    };

    const errors =
        maybeAxios.response?.data?.errors ?? [];

    if (errors.length === 0) {
        return (
            maybeAxios.response?.data?.message ||
            'Не вдалося змінити пароль. Спробуйте ще раз.'
        );
    }

    return errors
        .map(
            (code) =>
                passwordErrorMessages[code] ??
                'Не вдалося змінити пароль.'
        )
        .join(' ');
};

export default function ProfilePage() {
    const [form, setForm] =
        useState<ProfileForm>(emptyForm);

    const [formErrors, setFormErrors] =
        useState<FormErrors>({});

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(
        emptyPasswordForm
    );

    const [passwordFormErrors, setPasswordFormErrors] =
        useState<PasswordFormErrors>({});

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [passwordError, setPasswordError] =
        useState('');

    const [passwordSuccessOpen, setPasswordSuccessOpen] =
        useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await agent.Profile.get();

                if (cancelled)
                    return;

                setForm({
                    lastName:
                        response.data.lastName ?? '',
                    firstName:
                        response.data.firstName ?? '',
                    patronymic:
                        response.data.patronymic ?? '',
                    email:
                        response.data.email ?? '',
                    phoneNumber:
                        response.data.phoneNumber ?? '',
                });
            } catch {
                if (!cancelled) {
                    setError(
                        'Не вдалося завантажити профіль.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    const updateField = (
        field: keyof ProfileForm,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setFormErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    };

    const updatePasswordField = (
        field: keyof PasswordForm,
        value: string
    ) => {
        setPasswordForm((current) => ({
            ...current,
            [field]: value,
        }));

        setPasswordFormErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        setPasswordError('');
    };

    const validate = () => {
        const nextErrors: FormErrors = {};

        const lastName =
            form.lastName.trim();

        const firstName =
            form.firstName.trim();

        const patronymic =
            form.patronymic.trim();

        const email =
            form.email.trim();

        const phoneNumber =
            form.phoneNumber.trim();

        if (!lastName) {
            nextErrors.lastName =
                'Вкажіть прізвище.';
        } else if (lastName.length > 100) {
            nextErrors.lastName =
                'Максимум 100 символів.';
        }

        if (!firstName) {
            nextErrors.firstName =
                'Вкажіть ім’я.';
        } else if (firstName.length > 100) {
            nextErrors.firstName =
                'Максимум 100 символів.';
        }

        if (patronymic.length > 100) {
            nextErrors.patronymic =
                'Максимум 100 символів.';
        }

        if (!email) {
            nextErrors.email =
                'Вкажіть електронну адресу.';
        } else if (!emailPattern.test(email)) {
            nextErrors.email =
                'Вкажіть коректну електронну адресу.';
        }

        if (phoneNumber.length > 32) {
            nextErrors.phoneNumber =
                'Максимум 32 символи.';
        }

        setFormErrors(nextErrors);

        return (
            Object.keys(nextErrors).length === 0
        );
    };

    const validatePassword = () => {
        const nextErrors: PasswordFormErrors = {};

        if (!passwordForm.currentPassword) {
            nextErrors.currentPassword =
                'Вкажіть поточний пароль.';
        }

        if (!passwordForm.newPassword) {
            nextErrors.newPassword =
                'Вкажіть новий пароль.';
        }

        if (!passwordForm.confirmPassword) {
            nextErrors.confirmPassword =
                'Підтвердіть новий пароль.';
        } else if (
            passwordForm.newPassword !==
            passwordForm.confirmPassword
        ) {
            nextErrors.confirmPassword =
                'Паролі не збігаються.';
        }

        setPasswordFormErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validate())
            return;

        try {
            setSaving(true);
            setError('');

            const response =
                await agent.Profile.update({
                    lastName:
                        form.lastName.trim(),

                    firstName:
                        form.firstName.trim(),

                    patronymic:
                        form.patronymic.trim()
                        || null,

                    email:
                        form.email.trim(),

                    phoneNumber:
                        form.phoneNumber.trim()
                        || null,
                });

            setForm({
                lastName:
                    response.data.lastName ?? '',

                firstName:
                    response.data.firstName ?? '',

                patronymic:
                    response.data.patronymic ?? '',

                email:
                    response.data.email ?? '',

                phoneNumber:
                    response.data.phoneNumber ?? '',
            });

            setSuccessOpen(true);
        } catch (err) {
            setError(
                getBackendError(err)
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validatePassword())
            return;

        try {
            setPasswordSaving(true);
            setPasswordError('');

            await agent.Profile.changePassword({
                currentPassword:
                    passwordForm.currentPassword,

                newPassword:
                    passwordForm.newPassword,
            });

            setPasswordForm(
                emptyPasswordForm
            );

            setPasswordFormErrors({});

            setPasswordSuccessOpen(true);
        } catch (err) {
            setPasswordError(
                getChangePasswordError(err)
            );
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 8,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 850,
                mx: 'auto',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                }}
            >
                Мій профіль
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={(event) =>
                        void handleSubmit(event)
                    }
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr',
                        },
                        gap: 2.5,
                    }}
                >
                    <TextField
                        label="Прізвище"
                        value={form.lastName}
                        onChange={(event) =>
                            updateField(
                                'lastName',
                                event.target.value
                            )
                        }
                        error={
                            Boolean(
                                formErrors.lastName
                            )
                        }
                        helperText={
                            formErrors.lastName
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="Ім’я"
                        value={form.firstName}
                        onChange={(event) =>
                            updateField(
                                'firstName',
                                event.target.value
                            )
                        }
                        error={
                            Boolean(
                                formErrors.firstName
                            )
                        }
                        helperText={
                            formErrors.firstName
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="По батькові"
                        value={form.patronymic}
                        onChange={(event) =>
                            updateField(
                                'patronymic',
                                event.target.value
                            )
                        }
                        error={
                            Boolean(
                                formErrors.patronymic
                            )
                        }
                        helperText={
                            formErrors.patronymic
                        }
                        fullWidth
                    />

                    <TextField
                        label="Електронна пошта"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            updateField(
                                'email',
                                event.target.value
                            )
                        }
                        error={
                            Boolean(
                                formErrors.email
                            )
                        }
                        helperText={
                            formErrors.email
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="Телефон"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={(event) =>
                            updateField(
                                'phoneNumber',
                                event.target.value
                            )
                        }
                        error={
                            Boolean(
                                formErrors.phoneNumber
                            )
                        }
                        helperText={
                            formErrors.phoneNumber
                        }
                        fullWidth
                        sx={{
                            gridColumn: {
                                xs: 'auto',
                                md: '1 / -1',
                            },
                        }}
                    />

                    <Box
                        sx={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent:
                                'flex-end',
                            mt: 1,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            sx={{
                                minWidth: 190,
                            }}
                        >
                            {saving ? (
                                <CircularProgress
                                    size={22}
                                    color="inherit"
                                />
                            ) : (
                                'Зберегти зміни'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: {
                        xs: 2,
                        md: 4,
                    },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        mb: 1,
                        fontWeight: 700,
                    }}
                >
                    Зміна пароля
                </Typography>

                <Typography
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                    }}
                >
                    Вкажіть поточний пароль та задайте новий.
                </Typography>

                {passwordError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {passwordError}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={(event) =>
                        void handlePasswordSubmit(event)
                    }
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr',
                        },
                        gap: 2.5,
                    }}
                >
                    <TextField
                        label="Поточний пароль"
                        type="password"
                        value={
                            passwordForm.currentPassword
                        }
                        onChange={(event) =>
                            updatePasswordField(
                                'currentPassword',
                                event.target.value
                            )
                        }
                        error={Boolean(
                            passwordFormErrors.currentPassword
                        )}
                        helperText={
                            passwordFormErrors.currentPassword
                        }
                        autoComplete="current-password"
                        required
                        fullWidth
                        sx={{
                            gridColumn: {
                                xs: 'auto',
                                md: '1 / -1',
                            },
                        }}
                    />

                    <TextField
                        label="Новий пароль"
                        type="password"
                        value={
                            passwordForm.newPassword
                        }
                        onChange={(event) =>
                            updatePasswordField(
                                'newPassword',
                                event.target.value
                            )
                        }
                        error={Boolean(
                            passwordFormErrors.newPassword
                        )}
                        helperText={
                            passwordFormErrors.newPassword
                        }
                        autoComplete="new-password"
                        required
                        fullWidth
                    />

                    <TextField
                        label="Підтвердіть новий пароль"
                        type="password"
                        value={
                            passwordForm.confirmPassword
                        }
                        onChange={(event) =>
                            updatePasswordField(
                                'confirmPassword',
                                event.target.value
                            )
                        }
                        error={Boolean(
                            passwordFormErrors.confirmPassword
                        )}
                        helperText={
                            passwordFormErrors.confirmPassword
                        }
                        autoComplete="new-password"
                        required
                        fullWidth
                    />

                    <Box
                        sx={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 1,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={passwordSaving}
                            sx={{
                                minWidth: 190,
                            }}
                        >
                            {passwordSaving ? (
                                <CircularProgress
                                    size={22}
                                    color="inherit"
                                />
                            ) : (
                                'Змінити пароль'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() =>
                    setSuccessOpen(false)
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccessOpen(false)
                    }
                >
                    Профіль успішно оновлено.
                </Alert>
            </Snackbar>
            
            <Snackbar
                open={passwordSuccessOpen}
                autoHideDuration={4000}
                onClose={() =>
                    setPasswordSuccessOpen(false)
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setPasswordSuccessOpen(false)
                    }
                >
                    Пароль успішно змінено.
                </Alert>
            </Snackbar>
        </Box>
    );
}