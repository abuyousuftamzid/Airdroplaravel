import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function MasterPasswordLogin({ auth, errors: serverErrors }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        master_password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.master-login.verify'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Password Login" />

            <div className="py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl leading-9 font-bold text-blue-600 mb-2">
                                    Login With Master Password
                                </h3>
                                <p className="text-sm leading-[22px] text-primary dark:text-dark-text-primary">
                                    Please enter your master password to access Employee Management. Access will remain active while browsing within this section.
                                </p>
                            </div>

                            {/* Error Messages */}
                            {(errors.master_password || serverErrors?.master_password) && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {errors.master_password || serverErrors?.master_password}
                                </div>
                            )}

                            {serverErrors?.general && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {serverErrors.general}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <CustomTextField
                                        id="master_password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.master_password}
                                        onChange={(e) => setData('master_password', e.target.value)}
                                        label="Enter Your Master Password"
                                        required
                                        error={!!errors.master_password}
                                        helperText={errors.master_password}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>

                                <BlackButton
                                    type="submit"
                                    disabled={processing || !data.master_password}
                                    loading={processing}
                                    loadingText="Verifying..."
                                    className="w-full"
                                >
                                    Login
                                </BlackButton>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    This is a secure area. Access persists while browsing within employee management section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
