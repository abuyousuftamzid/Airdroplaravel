import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#1c252e',
                secondary: '#6b7280',
                muted: '#9ca3af',
                inverse: '#ffffff',
                quaternary: '#333E47',
                charcoal: '#333E47',
                darkCharcoal: '#252E37',

                // Dark theme colors
                dark: {
                    primary: '#141A21',
                    secondary: '#1f2937',
                    tertiary: '#374151',
                    quaternary: '#1C252E',
                    text: {
                        primary: '#ffffff',
                        secondary: '#d1d5db',
                        muted: '#9ca3af',
                    }
                },
                // Brand colors
                brand: {
                    primary: '#1c252e',
                    secondary: '#00a76f',
                    accent: '#5be49b',
                    muted: '#919eab',
                },
                // Status colors
                status: {
                    success: {
                        light: '#e8f5e8',
                        DEFAULT: '#c8e6c9',
                        dark: '#4caf50',
                        text: '#2e7d32',
                    },
                    error: {
                        light: '#ffebee',
                        DEFAULT: '#ffcdd2',
                        dark: '#f44336',
                        text: '#c62828',
                    },
                    warning: {
                        light: '#fff3e0',
                        DEFAULT: '#ffcc02',
                        dark: '#ff9800',
                        text: '#f57c00',
                    },
                    info: {
                        light: '#e3f2fd',
                        DEFAULT: '#bbdefb',
                        dark: '#2196f3',
                        text: '#1565c0',
                    },
                },
                // Role badge colors
                role: {
                    admin: {
                        light: '#ffebee',
                        DEFAULT: '#ffcdd2',
                        text: '#c62828',
                    },
                    master: {
                        light: '#f3e5f5',
                        DEFAULT: '#e1bee7',
                        text: '#7b1fa2',
                    },
                    manager: {
                        light: '#e3f2fd',
                        DEFAULT: '#bbdefb',
                        text: '#1565c0',
                    },
                    supervisor: {
                        light: '#e8f5e8',
                        DEFAULT: '#c8e6c9',
                        text: '#2e7d32',
                    },
                    operations: {
                        light: '#fff3e0',
                        DEFAULT: '#ffcc02',
                        text: '#f57c00',
                    },
                    customer: {
                        light: '#f5f5f5',
                        DEFAULT: '#e0e0e0',
                        text: '#424242',
                    },
                    pos: {
                        light: '#e8eaf6',
                        DEFAULT: '#c5cae9',
                        text: '#3f51b5',
                    },
                },
                // Table colors
                table: {
                    header: '#f9fafb',
                    row: {
                        hover: '#f9fafb',
                        even: '#ffffff',
                        odd: '#fafafa',
                    },
                    border: '#e5e7eb',
                    cell: {
                        primary: '#111827',
                        secondary: '#6b7280',
                    },
                },
                // Form colors
                form: {
                    border: {
                        default: '#d1d5db',
                        focus: '#3b82f6',
                        error: '#ef4444',
                    },
                    background: {
                        default: '#ffffff',
                        disabled: '#f9fafb',
                    },
                    text: {
                        primary: '#111827',
                        secondary: '#6b7280',
                        placeholder: '#9ca3af',
                    },
                },
                // Button colors
                button: {
                    primary: {
                        background: '#1c252e',
                        hover: '#374151',
                        text: '#ffffff',
                    },
                    secondary: {
                        background: '#6b7280',
                        hover: '#4b5563',
                        text: '#ffffff',
                    },
                    success: {
                        background: '#10b981',
                        hover: '#059669',
                        text: '#ffffff',
                    },
                    danger: {
                        background: '#ef4444',
                        hover: '#dc2626',
                        text: '#ffffff',
                    },
                    warning: {
                        background: '#f59e0b',
                        hover: '#d97706',
                        text: '#ffffff',
                    },
                },
                // Shadow colors
                shadow: {
                    card: '0 0 2px 0 rgba(145,158,171,0.2),0 12px 24px -4px rgba(145,158,171,0.12)',
                    dropdown: '0 2px 8px rgba(0,0,0,0.15)',
                    modal: '0 -4px 40px 80px rgba(0,0,0,0.3)',
                },
                // Background colors
                background: {
                    primary: '#ffffff',
                    secondary: '#f9fafb',
                    tertiary: '#f3f4f6',
                    dark: {
                        primary: '#141A21',
                        secondary: '#1f2937',
                        tertiary: '#374151',
                    },
                },
            },
            // Spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '300': '75rem',
            },
            // Border radius
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            // Box shadow
            boxShadow: {
                'card': '0 0 2px 0 rgba(145,158,171,0.2),0 12px 24px -4px rgba(145,158,171,0.12)',
                'dropdown': '0 2px 8px rgba(0,0,0,0.15)',
                'modal': '0 -4px 40px 80px rgba(0,0,0,0.3)',
            },
            // Z-index
            zIndex: {
                '60': '60',
                '9999': '9999',
            },
        },
    },

    plugins: [forms],
};
