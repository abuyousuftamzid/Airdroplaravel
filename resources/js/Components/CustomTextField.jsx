import { TextField } from '@mui/material';
import { useTheme } from '../Contexts/ThemeContext';
import { inputLabelClasses } from '@mui/material/InputLabel';


const CustomTextField = ({
    borderColor = 'gray',
    customSx = {},
    fullWidth = true,
    variant = 'outlined',
    ...rest
}) => {
    const { isDark } = useTheme();

    // Get colors from Tailwind config
    const colors = {
        // darkQuaternary: '#1C252E',
        darkQuaternary: 'transparent',
        darkTertiary: '#374151',
        darkTextPrimary: '#ffffff !important',
        darkTextSecondary: '#d1d5db',
        brandPrimary: '#1c252e',
        darkBorderColor: '#333E47',
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
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
        },
        '& .MuiInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
        },
        // Handle label color for better consistency
        '& .MuiInputLabel-root': {
            color: '#637381 !important',
            '&.Mui-focused': {
                color: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&.MuiInputLabel-shrink': {
                color: isDark ? colors.darkTextPrimary : 'black !important',
            },
        },
        // Handle input text color
        '& .MuiInputBase-input': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&::placeholder': {
                color: isDark ? '#637381 !important' : 'inherit',
                opacity: isDark ? 0.7 : 1,
            },
        },
    };

    // Merge custom sx with default sx
    const finalSx = {
        ...defaultSx,
        ...customSx,
    };

    return (
        <TextField
            variant={variant}
            fullWidth={fullWidth}
            sx={finalSx}
            {...rest}
        />
    );
};

export default CustomTextField;
