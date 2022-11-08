import React from 'react';
import { Button, useTheme } from '@mui/material';
import { style_type_btn_active_ext, style_type_btn_ext } from '../styles';

interface VoidFn {
  (): void;
}

interface Props {
  isActive: boolean;
  label: string;
  size?: 'small' | 'large' | 'medium' | undefined;
  width?: string | number;
  handleFn: () => void;
}

const ButtonWithActive = ({ isActive, handleFn, label, size, width = 'fit-content' }: Props) => {
  const theme = useTheme();

  return (
    <Button
      variant={isActive ? 'outlined' : 'contained'}
      color={isActive ? 'primary' : 'secondary'}
      size={size}
      style={isActive ? style_type_btn_active_ext : style_type_btn_ext}
      sx={{
        backgroundColor: isActive
          ? theme.palette.primary.main + '35'
          : theme.palette.secondary.main,
        borderColor: isActive ? theme.palette.primary.main : theme.palette.secondary.main,
        color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
        width: width,
      }}
      onClick={handleFn}
    >
      {label}
    </Button>
  );
};

export default ButtonWithActive;
