import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useTheme } from '../Contexts/ThemeContext';

const CustomSelectField = ({
    borderColor = 'gray',
    customSx = {},
    fullWidth = true,
    variant = 'outlined',
    label,
    options = [],
    ...rest
}) => {
    const { isDark } = useTheme();

    // Get colors from Tailwind config
    const colors = {
        midnightBlue: '#1C252E !important',
        darkQuaternary: 'transparent',
        darkTertiary: '#374151',
        darkTextPrimary: '#ffffff !important',
        darkTextSecondary: '#d1d5db',
        brandPrimary: '#1c252e',
        darkBorderColor: '#333E47',
        backgroundSecondary: '#f9fafb',
        rgba: 'rgba(28, 37, 46, 0.9)',
    };

    // Define border color variants
    const borderColorVariants = {
        red: '#dc2626',
        gray: '#eaeceb',
        black: '#000000',
        blue: '#3b82f6',
        green: '#16a34a',
        custom: '#eaeceb' // fallback for custom
    };

    // Get the actual color value
    const actualBorderColor = borderColorVariants[borderColor] || borderColorVariants.gray;

    // Default sx styles
    const defaultSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '& fieldset': {
                borderColor: isDark ? colors.darkBorderColor : actualBorderColor,
            },
            '&:hover fieldset': {
                borderColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
                borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
                borderWidth: '2px',
            },
        },
        '& .MuiFilledInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&:before': {
                borderBottomColor: isDark ? colors.darkBorderColor : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
        },
        '& .MuiInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&:before': {
                borderBottomColor: isDark ? colors.darkBorderColor : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
        },
        // Handle label color for better consistency
        '& .MuiInputLabel-root': {
            color: '#637381 !important',
            '&.Mui-focused': {
                color: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
            '&.MuiInputLabel-shrink': {
                color: isDark ? colors.darkTextPrimary : 'black !important',
            },
        },
        // Handle select text color
        '& .MuiSelect-select': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
        },
        // Handle dropdown icon color
        '& .MuiSelect-icon': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
        },
        // Handle dropdown menu colors - these styles need to be applied via MenuProps
        '& .MuiPaper-root': {
            backgroundColor: isDark ? colors.midnightBlue : 'white',
            color: isDark ? colors.darkTextPrimary : 'inherit',
        },
        // Handle menu item colors
        '& .MuiMenuItem-root': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&:hover': {
                backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
            },
        },
    };

    // Merge custom sx with default sx
    const finalSx = {
        ...defaultSx,
        ...customSx,
    };

    // MenuProps for dropdown styling
    const menuProps = {
        PaperProps: {
            sx: {
                backgroundColor: isDark ? colors.rgba : 'white',
                color: isDark ? colors.darkTextPrimary : 'inherit',
                '& .MuiMenuItem-root': {
                    color: isDark ? colors.darkTextPrimary : 'inherit',
                    '&:hover': {
                        backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
                    },
                },
            },
        },
    };

    return (
        <FormControl fullWidth={fullWidth} variant={variant} sx={finalSx}>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                label={label}
                MenuProps={menuProps}
                {...rest}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomSelectField;
