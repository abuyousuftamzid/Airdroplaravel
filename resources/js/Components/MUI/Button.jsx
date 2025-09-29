import React from 'react';
import { Button as MUIButton, CircularProgress } from '@mui/material';

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className,
  ...other
}) {
  return (
    <MUIButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      className={className}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      {...other}
    >
      {children}
    </MUIButton>
  );
}
