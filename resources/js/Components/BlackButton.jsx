import React from 'react';
import { Button as MUIButton } from '@mui/material';
import { useTheme } from '../Contexts/ThemeContext';

export default function BlackButton({
    children,
    variant = 'contained',
    type = 'button',
    disabled = false,
    loading = false,
    loadingText = 'Loading...',
    onClick,
    className,
    sx = {},
    ...other
}) {
    const { isDark } = useTheme();

    // Get colors from Tailwind config
    const colors = {
        darkQuaternary: '#1C252E',
        backgroundPrimary: '#ffffff',
        backgroundTertiary: '#f3f4f6',
        brandPrimary: '#000000',
        textInverse: '#ffffff'
    };

    const defaultSx = {
        backgroundColor: isDark ? colors.backgroundPrimary : colors.brandPrimary,
        color: isDark ? colors.darkQuaternary : colors.textInverse,
        '&:hover': {
            backgroundColor: isDark ? colors.backgroundTertiary : colors.brandPrimary,
        },
        ...sx
    };

    return (
        <MUIButton
            variant={variant}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={className}
            sx={defaultSx}
            {...other}
        >
            {loading ? loadingText : children}
        </MUIButton>
    );
}
