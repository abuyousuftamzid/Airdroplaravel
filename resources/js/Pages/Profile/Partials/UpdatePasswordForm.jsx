import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import {
    Box,
    Card,
    CardHeader,
    Divider,
    Stack,
    Typography,
    Fade
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import TextField from '@/Components/MUI/TextField';
import Button from '@/Components/MUI/Button';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
            <Card>
                <CardHeader
                    title="Update Password"
                    subheader="Ensure your account is using a long, random password to stay secure."
                    sx={{ mb: 3 }}
                />

                <Divider />

                <form onSubmit={updatePassword}>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <TextField
                            name="current_password"
                            label="Current Password"
                            type="password"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            error={errors.current_password}
                            required
                            autoComplete="current-password"
                            inputRef={currentPasswordInput}
                        />

                        <TextField
                            name="password"
                            label="New Password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                            inputRef={passwordInput}
                        />

                        <TextField
                            name="password_confirmation"
                            label="Confirm Password"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            required
                            autoComplete="new-password"
                        />

                        <Box
                            sx={{
                                gap: 3,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 3
                            }}
                        >
                            <Fade in={recentlySuccessful}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle color="success" fontSize="small" />
                                    <Typography variant="body2" color="success.main">
                                        Password updated successfully!
                                    </Typography>
                                </Box>
                            </Fade>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={processing}
                                disabled={processing}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Card>
        </Stack>
    );
}
