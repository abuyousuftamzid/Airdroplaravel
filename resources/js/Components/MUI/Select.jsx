import React from 'react';
import {
    FormControl,
    InputLabel,
    Select as MUISelect,
    MenuItem,
    FormHelperText
} from '@mui/material';

export default function Select({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  options = [],
  fullWidth = true,
  required = false,
  className,
  ...other
}) {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!error}
      required={required}
      className={className}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <MUISelect
        labelId={`${name}-label`}
        name={name}
        value={value || ''}
        onChange={onChange}
        label={label}
        {...other}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MUISelect>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
