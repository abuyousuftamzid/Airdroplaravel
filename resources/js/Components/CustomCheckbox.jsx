import React from 'react';
import { Checkbox } from '@mui/material';
import { useTheme } from '../Contexts/ThemeContext';

const CustomCheckbox = ({
    checked = false,
    onChange,
    disabled = false,
    color = 'success',
    size = 20,
    ...rest
}) => {
    const { isDark } = useTheme();

    // Get colors from Tailwind config
    const colors = {
        darkTertiary: '#374151',
        darkTextPrimary: '#ffffff',
        textMuted: '#9ca3af',
        darkBorderColor: '#333E47'
    };

    // Define color variants
    const colorVariants = {
        primary: '#2563eb', // Blue
        success: '#16a34a', // Green
        secondary: '#6b7280', // Gray
        error: '#dc2626', // Red
        warning: '#d97706', // Orange
    };

    // Get the actual color value
    const checkedColor = colorVariants[color] || colorVariants.success;

    // Default sx styles
    const defaultSx = {
        color: isDark ? colors.darkBorderColor : colors.textMuted, // Dark gray for unchecked state in dark mode
        '&.Mui-checked': {
            color: isDark ? colors.darkTextPrimary : checkedColor,
        },
        '&.Mui-disabled': {
            opacity: 0.5,
        },
        '& .MuiSvgIcon-root': {
            // fontSize: size,
            borderRadius: '50px',
        },
        // Handle hover state for dark mode
        '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        },
    };

    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            sx={defaultSx}
            {...rest}
        />
    );
};

export default CustomCheckbox;
