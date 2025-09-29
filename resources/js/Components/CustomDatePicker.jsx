import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '../Contexts/ThemeContext';

const CustomDatePicker = ({
    borderColor = 'gray',
    customSx = {},
    fullWidth = true,
    variant = 'outlined',
    ...rest
}) => {
    const { isDark } = useTheme();

    // Get colors from Tailwind config
    const colors = {
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

    // Default sx styles - matching CustomSelectField exactly
    const defaultSx = {
        // Main container styling
        '& .MuiPickersTextField-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            height: '100%',
        },
        // Outlined input styling
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
        // Filled input styling
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
        // Standard input styling
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
        // Label styling - matching CustomSelectField
        '& .MuiInputLabel-root': {
            color: '#637381 !important',
            '&.Mui-focused': {
                color: isDark ? colors.darkTextPrimary : colors.brandPrimary,
            },
            '&.MuiInputLabel-shrink': {
                color: isDark ? colors.darkTextPrimary : 'black !important',
            },
        },
        // Input text styling
        '& .MuiInputBase-input': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
            '&::placeholder': {
                color: isDark ? '#637381 !important' : 'inherit',
                opacity: isDark ? 0.7 : 1,
            },
        },
        // Date picker specific styling
        '& .MuiPickersInputBase-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : 'inherit',
            height: '100%',
        },
        '& .MuiPickersOutlinedInput-root': {
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
        // Calendar icon styling
        '& .MuiIconButton-root': {
            color: isDark ? colors.darkTextPrimary : 'inherit',
        },
        // Notched outline styling
        '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: isDark ? colors.darkBorderColor : actualBorderColor,
        },
    };

    // Merge custom sx with default sx
    const finalSx = {
        ...defaultSx,
        ...customSx,
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                slotProps={{
                    textField: {
                        variant: variant,
                        fullWidth: fullWidth,
                        sx: finalSx,
                        InputLabelProps: {
                            shrink: true, // This ensures the label is always positioned above the input
                        },
                        ...rest
                    },
                    popper: {
                        sx: {
                            '& .MuiPaper-root': {
                                backgroundColor: isDark ? colors.brandPrimary : 'white',
                                color: isDark ? colors.darkTextPrimary : 'inherit',
                                '& .MuiPickersDay-root': {
                                    color: isDark ? colors.darkTextPrimary : 'inherit',
                                    '&.Mui-selected': {
                                        backgroundColor: colors.darkTertiary,
                                        color: 'white',
                                    },
                                    '&:hover': {
                                        backgroundColor: isDark ? 'gray' : '#f0f0f0',
                                    },
                                },
                                '& .MuiPickersCalendarHeader-label': {
                                    color: isDark ? colors.darkTextPrimary : 'inherit',
                                },
                                '& .MuiDayCalendar-weekDayLabel': {
                                    color: isDark ? colors.darkTextPrimary : 'inherit',
                                },
                                '& .MuiPickersArrowSwitcher-root .MuiSvgIcon-root': {
                                    color: isDark ? colors.darkTextPrimary : 'inherit',
                                },
                                '& .MuiPickersToolbar-root': {
                                    backgroundColor: isDark ? colors.brandPrimary : colors.brandPrimary,
                                    color: 'white',
                                },
                                '& .MuiPickersToolbarText-root': {
                                    color: 'white',
                                },
                                '& .MuiPickersToolbarButton-root': {
                                    color: 'white',
                                },
                            },
                        },
                    }
                }}
                {...rest}
            />
        </LocalizationProvider>
    );
};

export default CustomDatePicker;
