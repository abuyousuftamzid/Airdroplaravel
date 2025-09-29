import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

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
                            Verify Your Email
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed">
                            We've sent you a verification link to complete your registration
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                    <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
                </div>
            </div>

            {/* Right Side - Verification Form */}
            <div className="w-full lg:w-4/5 flex items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <ApplicationLogo className="h-12 w-12 fill-current text-teal-600" />
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Check Your Email
                        </h1>
                        <p className="text-gray-600">
                            We need to verify your email address before you can continue
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Email Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Main Message */}
                        <div className="text-center">
                            <p className="text-gray-700 leading-relaxed">
                                Thanks for signing up! We've sent a verification link to your email address.
                                Please check your inbox and click the link to verify your account.
                            </p>
                        </div>

                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-sm font-medium text-green-800">
                                        A new verification link has been sent to your email address.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <form onSubmit={submit}>
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
                                        'Resend Verification Email'
                                    )}
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Sign out and use a different account
                                </Link>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={submit}
                                    disabled={processing}
                                    className="text-teal-600 hover:text-teal-500 font-medium transition-colors"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
