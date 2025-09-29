import React from 'react';
import { IconButton as MUIIconButton, Tooltip } from '@mui/material';

export default function IconButton({
  children,
  onClick,
  tooltip,
  color = 'default',
  size = 'medium',
  disabled = false,
  className,
  ...other
}) {
  const button = (
    <MUIIconButton
      onClick={onClick}
      color={color}
      size={size}
      disabled={disabled}
      className={className}
      {...other}
    >
      {children}
    </MUIIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
