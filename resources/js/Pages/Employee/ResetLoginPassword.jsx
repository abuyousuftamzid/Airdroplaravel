import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InputAdornment, IconButton, Box, Typography } from '@mui/material';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ResetLoginPassword({ employee }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        new_password: '',
        confirm_password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { isDark } = useTheme();

    const submit = (e) => {
        e.preventDefault();

        if (data.new_password !== data.confirm_password) {
            alert('Passwords do not match!');
            return;
        }

        patch(route('admin.employees.update-login-password', employee.user_id), {
            onSuccess: () => {
                reset();
            },
        });
    };
    const colors = {
        darkTextPrimary: '#ffffff',
        darkTextSecondary: '#637381',
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Reset Login Password: ${employee.user_first_last_name}`} />

            <div className="py-2">
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl leading-9 font-bold text-primary dark:text-dark-text-primary mb-2">Reset Login Password</h2>
                        <p className="text-sm leading-[22px] text-primary dark:text-dark-text-primary">
                            Set a new login password for <strong>{employee.user_first_last_name}</strong>.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg">
                        <div className="p-6">
                            {/* Employee Info Card */}
                            <div className="mb-6 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
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

                            <form onSubmit={submit} className="space-y-6">
                                <div className="flex flex-col lg:flex-row gap-6 w-full">
                                    {/* New Password */}
                                    <div className="w-full">
                                        <CustomTextField
                                            id="new_password"
                                            label="New Login Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.new_password}
                                            onChange={(e) => setData('new_password', e.target.value)}
                                            required
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.new_password}
                                            helperText={errors.new_password}
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

                                    {/* Confirm Password */}
                                    <div className="w-full">
                                        <CustomTextField
                                            id="confirm_password"
                                            label="Confirm New Password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.confirm_password}
                                            onChange={(e) => setData('confirm_password', e.target.value)}
                                            required
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.confirm_password}
                                            helperText={errors.confirm_password}
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
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(59, 130, 246, 0.1)'
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: isDark ? colors.darkTextPrimary : '#1e40af' }}>
                                        Password Requirements:
                                    </Typography>
                                    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                                        {[
                                            'Minimum 8 characters long',
                                            'Contains at least one uppercase letter',
                                            'Contains at least one lowercase letter',
                                            'Contains at least one number',
                                            'Contains at least one special character'
                                        ].map((requirement, index) => (
                                            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#3b82f6',
                                                        mr: 1.5,
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ color: isDark ? colors.darkTextPrimary : '#1e40af' }}>
                                                    {requirement}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-charcoal">
                                    <Link
                                        href={route('admin.employees.index')}>
                                        <BlackButton >
                                            Cancel
                                        </BlackButton>
                                    </Link>

                                    <BlackButton
                                        variant="contained"
                                        type="submit"
                                        disabled={processing}
                                        loading={processing}
                                        loadingText="Updating..."
                                    >
                                        {processing ? 'Updating...' : 'Reset Login Password'}
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
