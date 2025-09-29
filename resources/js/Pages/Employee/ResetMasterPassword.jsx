import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InputAdornment, IconButton, Box, Typography, Alert } from '@mui/material';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';
import { Visibility, VisibilityOff, Warning } from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ResetMasterPassword({ employee }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        new_master_password: '',
        confirm_master_password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { isDark } = useTheme();

    const colors = {
        darkTextPrimary: '#ffffff',
        darkTextSecondary: '#637381',
    };

    const submit = (e) => {
        e.preventDefault();

        if (data.new_master_password !== data.confirm_master_password) {
            alert('Passwords do not match!');
            return;
        }

        patch(route('admin.employees.update-master-password', employee.user_id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Set Master Password: ${employee.user_first_last_name}`} />

            <div className="py-12">
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl leading-9 font-bold text-primary dark:text-dark-text-primary mb-2">Set Master Password</h2>
                        <p className="text-sm leading-[22px] text-primary dark:text-dark-text-primary">
                            Set a new master password for <strong>{employee.user_first_last_name}</strong>.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg">
                        <div className="p-6">
                            {/* Employee Info Card */}
                            <div className="mb-6 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                                            <span className="text-lg font-medium text-white">
                                                {(employee.user_first_last_name || 'U').charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                                            {employee.user_first_last_name}
                                            {employee.user_second_last_name && ` ${employee.user_second_last_name}`}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-dark-text-primary">{employee.user_email}</div>
                                        <div className="text-sm text-gray-500 dark:text-dark-text-primary">ID: {employee.user_account_number || employee.user_id}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Master Password Info */}
                            <Alert
                                severity="warning"
                                icon={<Warning />}
                                sx={{ mb: 3 }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    About Master Password
                                </Typography>
                                <Typography variant="body2">
                                    The master password provides administrative access and should be highly secure.
                                    It is used for sensitive operations and should be different from the login password.
                                </Typography>
                            </Alert>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="flex flex-col lg:flex-row gap-6 w-full">
                                    {/* New Master Password */}
                                    <div className="w-full">
                                        <CustomTextField
                                            id="new_master_password"
                                            label="New Master Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.new_master_password}
                                            onChange={(e) => setData('new_master_password', e.target.value)}
                                            required
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.new_master_password}
                                            helperText={errors.new_master_password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{
                                                                color: isDark ? '#ffffff' : 'inherit',
                                                                '&:hover': {
                                                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                                                },
                                                            }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>

                                    {/* Confirm Master Password */}
                                    <div className="w-full">
                                        <CustomTextField
                                            id="confirm_master_password"
                                            label="Confirm New Master Password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.confirm_master_password}
                                            onChange={(e) => setData('confirm_master_password', e.target.value)}
                                            required
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.confirm_master_password}
                                            helperText={errors.confirm_master_password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle confirm password visibility"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            sx={{
                                                                color: isDark ? '#ffffff' : 'inherit',
                                                                '&:hover': {
                                                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                                                },
                                                            }}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(139, 92, 246, 0.1)'
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6b21a8', mb: 2, color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                        Master Password Requirements:
                                    </Typography>
                                    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                                        {[
                                            'Minimum 12 characters long (higher security)',
                                            'Contains at least one uppercase letter',
                                            'Contains at least one lowercase letter',
                                            'Contains at least one number',
                                            'Contains at least one special character',
                                            'Should be different from login password'
                                        ].map((requirement, index) => (
                                            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#8b5cf6',
                                                        mr: 1.5,
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ color: isDark ? colors.darkTextPrimary : '#6b21a8' }}>
                                                    {requirement}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-charcoal">
                                    <Link
                                        href={route('admin.employees.index')}
                                    >
                                        <BlackButton>
                                            Cancel
                                        </BlackButton>
                                    </Link>

                                    <BlackButton
                                        type="submit"
                                        disabled={processing}
                                        loading={processing}
                                        loadingText="Setting..."
                                    >
                                        {processing ? 'Setting...' : 'Set Master Password'}
                                    </BlackButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
