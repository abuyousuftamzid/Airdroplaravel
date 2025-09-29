import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Card,
    CardHeader,
    Divider,
    Stack,
    Typography,
    Alert,
    Fade,
    IconButton
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import TextField from '@/Components/MUI/TextField';
import Button from '@/Components/MUI/Button';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            user_first_last_name: user.user_first_last_name,
            user_email: user.user_email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
            <Card>
                <CardHeader
                    title="Profile Information"
                    subheader="Update your account's profile information and email address."
                    sx={{ mb: 3 }}
                />

                <Divider />

                <form onSubmit={submit}>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <TextField
                            name="user_first_last_name"
                            label="Name"
                            value={data.user_first_last_name}
                            onChange={(e) => setData('user_first_last_name', e.target.value)}
                            error={errors.user_first_last_name}
                            required
                            autoComplete="name"
                        />

                        <TextField
                            name="user_email"
                            label="Email Address"
                            type="email"
                            value={data.user_email}
                            onChange={(e) => setData('user_email', e.target.value)}
                            error={errors.user_email}
                            required
                            autoComplete="username"
                        />

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="body2" component="span">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        style={{
                                            color: 'inherit',
                                            textDecoration: 'underline',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </Typography>

                                {status === 'verification-link-sent' && (
                                    <Alert severity="success" sx={{ mt: 1 }}>
                                        A new verification link has been sent to your email address.
                                    </Alert>
                                )}
                            </Alert>
                        )}

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
                                        Profile updated successfully!
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
