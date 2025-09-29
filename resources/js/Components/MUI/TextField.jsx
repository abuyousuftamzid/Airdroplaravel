import React from 'react';
import { TextField as MUITextField } from '@mui/material';

export default function TextField({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  fullWidth = true,
  required = false,
  autoComplete,
  className,
  inputRef,
  ...other
}) {
  return (
    <MUITextField
      name={name}
      label={label}
      value={value || ''}
      onChange={onChange}
      type={type}
      fullWidth={fullWidth}
      required={required}
      autoComplete={autoComplete}
      error={!!error}
      helperText={error || helperText}
      className={className}
      variant="outlined"
      size="medium"
      slotProps={{
        htmlInput: {
          autoComplete: autoComplete || 'new-password',
          ref: inputRef,
        },
      }}
      {...other}
    />
  );
}
