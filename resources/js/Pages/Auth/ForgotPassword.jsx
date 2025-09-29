import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        user_email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                            Reset Your Password
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed">
                            Enter your email address and we'll send you a password reset link
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                    <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
                </div>
            </div>

            {/* Right Side - Reset Form */}
            <div className="w-full lg:w-4/5 flex items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <ApplicationLogo className="h-12 w-12 fill-current text-teal-600" />
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Forgot your password?
                        </h1>
                        <p className="text-gray-600">
                            No worries! Enter your email and we'll send you reset instructions.
                        </p>
                    </div>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-sm font-medium text-green-800">
                                    {status}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Email Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                        </div>

                        {/* Reset Form */}
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.user_email}
                                    onChange={(e) => setData('user_email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    autoFocus
                                />
                                {errors.user_email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wide"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    'Email Password Reset Link'
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ← Back to sign in
                            </Link>
                        </div>

                        {/* Help Text */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Remember your password?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-teal-600 hover:text-teal-500 font-medium transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
