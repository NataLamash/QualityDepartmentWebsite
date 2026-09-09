import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Navigate } from 'react-router-dom';
import agent, {
    type AdminRole,
    type AdminUserDto,
} from '../../api/agent';
import { useAuth } from '../auth/AuthProvider';

interface EditForm {
    lastName: string;
    firstName: string;
    patronymic: string;
    email: string;
    phoneNumber: string;
}

interface EditErrors {
    lastName?: string;
    firstName?: string;
    patronymic?: string;
    email?: string;
    phoneNumber?: string;
}

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errorMessages: Record<string, string> = {
    EMAIL_ALREADY_IN_USE:
        'Користувач з такою електронною адресою вже існує.',

    INVALID_ROLE:
        'Обрана роль недоступна.',

    SELF_ROLE_CHANGE_FORBIDDEN:
        'Ви не можете змінити власну роль.',

    SELF_BLOCK_FORBIDDEN:
        'Ви не можете заблокувати власний обліковий запис.',

    USER_NOT_FOUND:
        'Адміністратора не знайдено.',

    InvalidEmail:
        'Вкажіть коректну електронну адресу.',
};

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

    if (errors.length > 0) {
        return errors
            .map(
                (code) =>
                    errorMessages[code] ??
                    'Не вдалося виконати операцію.'
            )
            .join(' ');
    }

    return (
        maybeAxios.response?.data?.message ||
        'Не вдалося виконати операцію.'
    );
};

const getFullName = (user: AdminUserDto) => {
    const name = [
        user.lastName,
        user.firstName,
        user.patronymic,
    ]
        .filter(Boolean)
        .join(' ');

    return name || '—';
};

export default function AdminUsersPage() {
    const { user } = useAuth();

    const isSuperAdmin =
        user?.roles.includes('SuperAdmin') ?? false;

    const [users, setUsers] =
        useState<AdminUserDto[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [successMessage, setSuccessMessage] =
        useState('');

    const [editUser, setEditUser] =
        useState<AdminUserDto | null>(null);

    const [editForm, setEditForm] =
        useState<EditForm | null>(null);

    const [editErrors, setEditErrors] =
        useState<EditErrors>({});

    const [editSaving, setEditSaving] =
        useState(false);

    const [roleUser, setRoleUser] =
        useState<AdminUserDto | null>(null);

    const [selectedRole, setSelectedRole] =
        useState<AdminRole>('Admin');

    const [blockTarget, setBlockTarget] =
        useState<{
            user: AdminUserDto;
            block: boolean;
        } | null>(null);

    const [actionSaving, setActionSaving] =
        useState(false);

    useEffect(() => {
        if (!isSuperAdmin) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadUsers = async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await agent.AdminUsers.list();

                if (!cancelled) {
                    setUsers(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        getBackendError(err)
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadUsers();

        return () => {
            cancelled = true;
        };
    }, [isSuperAdmin]);

    if (!isSuperAdmin) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const replaceUser = (
        updated: AdminUserDto
    ) => {
        setUsers((current) =>
            current.map((item) =>
                item.id === updated.id
                    ? updated
                    : item
            )
        );
    };

    const openEditDialog = (
        target: AdminUserDto
    ) => {
        setEditUser(target);

        setEditForm({
            lastName:
                target.lastName ?? '',
            firstName:
                target.firstName ?? '',
            patronymic:
                target.patronymic ?? '',
            email:
                target.email,
            phoneNumber:
                target.phoneNumber ?? '',
        });

        setEditErrors({});
        setError('');
    };

    const updateEditField = (
        field: keyof EditForm,
        value: string
    ) => {
        if (!editForm)
            return;

        setEditForm({
            ...editForm,
            [field]: value,
        });

        setEditErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    };

    const validateEditForm = () => {
        if (!editForm)
            return false;

        const errors: EditErrors = {};

        if (!editForm.lastName.trim()) {
            errors.lastName =
                'Вкажіть прізвище.';
        } else if (
            editForm.lastName.trim().length > 100
        ) {
            errors.lastName =
                'Максимум 100 символів.';
        }

        if (!editForm.firstName.trim()) {
            errors.firstName =
                'Вкажіть ім’я.';
        } else if (
            editForm.firstName.trim().length > 100
        ) {
            errors.firstName =
                'Максимум 100 символів.';
        }

        if (
            editForm.patronymic.trim().length > 100
        ) {
            errors.patronymic =
                'Максимум 100 символів.';
        }

        const email =
            editForm.email.trim();

        if (!email) {
            errors.email =
                'Вкажіть електронну адресу.';
        } else if (!emailPattern.test(email)) {
            errors.email =
                'Вкажіть коректну електронну адресу.';
        }

        if (
            editForm.phoneNumber.trim().length > 32
        ) {
            errors.phoneNumber =
                'Максимум 32 символи.';
        }

        setEditErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleEditSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !editUser ||
            !editForm ||
            !validateEditForm()
        ) {
            return;
        }

        try {
            setEditSaving(true);
            setError('');

            const response =
                await agent.AdminUsers.update(
                    editUser.id,
                    {
                        lastName:
                            editForm.lastName.trim(),

                        firstName:
                            editForm.firstName.trim(),

                        patronymic:
                            editForm.patronymic
                                .trim() || null,

                        email:
                            editForm.email.trim(),

                        phoneNumber:
                            editForm.phoneNumber
                                .trim() || null,
                    }
                );

            replaceUser(response.data);

            setEditUser(null);
            setEditForm(null);

            setSuccessMessage(
                'Дані адміністратора оновлено.'
            );
        } catch (err) {
            setError(
                getBackendError(err)
            );
        } finally {
            setEditSaving(false);
        }
    };

    const openRoleDialog = (
        target: AdminUserDto
    ) => {
        setRoleUser(target);
        setSelectedRole(target.role);
        setError('');
    };

    const handleRoleChange = async () => {
        if (!roleUser)
            return;

        try {
            setActionSaving(true);
            setError('');

            const response =
                await agent.AdminUsers.changeRole(
                    roleUser.id,
                    {
                        role: selectedRole,
                    }
                );

            replaceUser(response.data);

            setRoleUser(null);

            setSuccessMessage(
                'Роль адміністратора змінено.'
            );
        } catch (err) {
            setError(
                getBackendError(err)
            );
        } finally {
            setActionSaving(false);
        }
    };

    const handleBlockChange = async () => {
        if (!blockTarget)
            return;

        try {
            setActionSaving(true);
            setError('');

            const response =
                blockTarget.block
                    ? await agent.AdminUsers.block(
                        blockTarget.user.id
                    )
                    : await agent.AdminUsers.unblock(
                        blockTarget.user.id
                    );

            replaceUser(response.data);

            setSuccessMessage(
                blockTarget.block
                    ? 'Адміністратора заблоковано.'
                    : 'Адміністратора розблоковано.'
            );

            setBlockTarget(null);
        } catch (err) {
            setError(
                getBackendError(err)
            );
        } finally {
            setActionSaving(false);
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
        <Box>
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                }}
            >
                Адміністратори
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setError('')
                    }
                >
                    {error}
                </Alert>
            )}

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                ПІБ
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Телефон
                            </TableCell>

                            <TableCell>
                                Роль
                            </TableCell>

                            <TableCell>
                                Статус
                            </TableCell>

                            <TableCell align="right">
                                Дії
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((item) => (
                            <TableRow
                                key={item.id}
                                hover
                            >
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        {getFullName(item)}

                                        {item.isCurrentUser && (
                                            <Chip
                                                label="Ви"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    {item.email}
                                </TableCell>

                                <TableCell>
                                    {item.phoneNumber || '—'}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            item.role === 'SuperAdmin'
                                                ? 'SuperAdmin'
                                                : 'Admin'
                                        }
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            item.isBlocked
                                                ? 'Заблокований'
                                                : 'Активний'
                                        }
                                        color={
                                            item.isBlocked
                                                ? 'error'
                                                : 'success'
                                        }
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: 1,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            startIcon={
                                                <EditRoundedIcon />
                                            }
                                            onClick={() =>
                                                openEditDialog(item)
                                            }
                                        >
                                            Редагувати
                                        </Button>

                                        <Button
                                            size="small"
                                            startIcon={
                                                <AdminPanelSettingsRoundedIcon />
                                            }
                                            disabled={
                                                item.isCurrentUser
                                            }
                                            onClick={() =>
                                                openRoleDialog(item)
                                            }
                                        >
                                            Роль
                                        </Button>

                                        {item.isBlocked ? (
                                            <Button
                                                size="small"
                                                startIcon={
                                                    <LockOpenRoundedIcon />
                                                }
                                                disabled={
                                                    item.isCurrentUser
                                                }
                                                onClick={() =>
                                                    setBlockTarget({
                                                        user: item,
                                                        block: false,
                                                    })
                                                }
                                            >
                                                Розблокувати
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                startIcon={
                                                    <BlockRoundedIcon />
                                                }
                                                color="error"
                                                disabled={
                                                    item.isCurrentUser
                                                }
                                                onClick={() =>
                                                    setBlockTarget({
                                                        user: item,
                                                        block: true,
                                                    })
                                                }
                                            >
                                                Заблокувати
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}

                        {users.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                >
                                    Адміністраторів не знайдено.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={Boolean(editUser)}
                onClose={() => {
                    if (!editSaving) {
                        setEditUser(null);
                        setEditForm(null);
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <Box
                    component="form"
                    onSubmit={(event) =>
                        void handleEditSubmit(event)
                    }
                >
                    <DialogTitle>
                        Редагування адміністратора
                    </DialogTitle>

                    <DialogContent>
                        {editForm && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gap: 2,
                                    pt: 1,
                                }}
                            >
                                <TextField
                                    label="Прізвище"
                                    value={editForm.lastName}
                                    onChange={(event) =>
                                        updateEditField(
                                            'lastName',
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        editErrors.lastName
                                    )}
                                    helperText={
                                        editErrors.lastName
                                    }
                                    required
                                />

                                <TextField
                                    label="Ім’я"
                                    value={editForm.firstName}
                                    onChange={(event) =>
                                        updateEditField(
                                            'firstName',
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        editErrors.firstName
                                    )}
                                    helperText={
                                        editErrors.firstName
                                    }
                                    required
                                />

                                <TextField
                                    label="По батькові"
                                    value={editForm.patronymic}
                                    onChange={(event) =>
                                        updateEditField(
                                            'patronymic',
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        editErrors.patronymic
                                    )}
                                    helperText={
                                        editErrors.patronymic
                                    }
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(event) =>
                                        updateEditField(
                                            'email',
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        editErrors.email
                                    )}
                                    helperText={
                                        editErrors.email
                                    }
                                    required
                                />

                                <TextField
                                    label="Телефон"
                                    value={editForm.phoneNumber}
                                    onChange={(event) =>
                                        updateEditField(
                                            'phoneNumber',
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        editErrors.phoneNumber
                                    )}
                                    helperText={
                                        editErrors.phoneNumber
                                    }
                                />
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                setEditUser(null);
                                setEditForm(null);
                            }}
                            disabled={editSaving}
                        >
                            Скасувати
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={editSaving}
                        >
                            {editSaving
                                ? 'Збереження...'
                                : 'Зберегти'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog
                open={Boolean(roleUser)}
                onClose={() => {
                    if (!actionSaving) {
                        setRoleUser(null);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Зміна ролі
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{ mb: 3 }}
                    >
                        Ви впевнені, що хочете змінити роль цього адміністратора?
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel>
                            Роль
                        </InputLabel>

                        <Select
                            label="Роль"
                            value={selectedRole}
                            onChange={(event) =>
                                setSelectedRole(
                                    event.target.value as AdminRole
                                )
                            }
                        >
                            <MenuItem value="Admin">
                                Admin
                            </MenuItem>

                            <MenuItem value="SuperAdmin">
                                SuperAdmin
                            </MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setRoleUser(null)
                        }
                        disabled={actionSaving}
                    >
                        Скасувати
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() =>
                            void handleRoleChange()
                        }
                        disabled={
                            actionSaving ||
                            !roleUser ||
                            selectedRole ===
                            roleUser.role
                        }
                    >
                        Підтвердити
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={Boolean(blockTarget)}
                onClose={() => {
                    if (!actionSaving) {
                        setBlockTarget(null);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    {blockTarget?.block
                        ? 'Блокування адміністратора'
                        : 'Розблокування адміністратора'}
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        {blockTarget?.block
                            ? 'Ви впевнені, що хочете заблокувати цього адміністратора?'
                            : 'Ви впевнені, що хочете розблокувати цього адміністратора?'}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setBlockTarget(null)
                        }
                        disabled={actionSaving}
                    >
                        Скасувати
                    </Button>

                    <Button
                        variant="contained"
                        color={
                            blockTarget?.block
                                ? 'error'
                                : 'primary'
                        }
                        onClick={() =>
                            void handleBlockChange()
                        }
                        disabled={actionSaving}
                    >
                        Підтвердити
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={4000}
                onClose={() =>
                    setSuccessMessage('')
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
                        setSuccessMessage('')
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}