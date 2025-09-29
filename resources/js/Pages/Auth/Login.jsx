import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign in to your account" />

            {/* Left Side - Teal Gradient */}
            <div className="hidden lg:flex lg:w-1/4 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/80 via-teal-500/80 to-cyan-500/80"></div>
                <div className="absolute inset-0"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md text-center">
                        <ApplicationLogo className="h-16 w-16 fill-current text-white mx-auto mb-8" />
                        <h2 className="text-3xl font-bold mb-4">
                            Hi, Welcome back
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                    <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-4/5 flex items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <ApplicationLogo className="h-12 w-12 fill-current text-teal-600" />
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Sign in to your account
                        </h1>
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                            >
                                Get started
                            </Link>
                        </p>
                    </div>

                    {/* Status Messages */}
            {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800">{status}</p>
                </div>
            )}

                    {/* Main Form */}
                    <form onSubmit={submit} className="space-y-6">
                <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email address"
                                className="text-sm font-medium text-gray-700 mb-2 block"
                            />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                                value={data.user_email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                placeholder="Enter your email"
                        autoComplete="username"
                        isFocused={true}
                                onChange={(e) => setData('user_email', e.target.value)}
                    />
                            <InputError message={errors.user_email} className="mt-1" />
                </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-sm font-medium text-gray-700"
                                />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                    <TextInput
                        id="password"
                                    type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                    placeholder="6+ characters"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                </div>

                        <div className="flex items-center">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me for 30 days
                        </span>
                    </label>
                </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wide"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'SIGN IN'
                                )}
                            </button>
                        </div>
                    </form>


                </div>
            </div>
        </GuestLayout>
    );
}
