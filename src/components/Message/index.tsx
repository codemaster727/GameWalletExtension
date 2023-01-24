import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import { style_type_btn_active_ext, style_type_btn_ext } from '../styles';

interface Props {
  type: string;
  msg: string;
}

const Message = ({ type = 'error', msg }: Props) => {
  const theme = useTheme();

  return (
    <Typography
      variant='h5'
      component='article'
      textAlign='left'
      fontWeight='bold'
      alignItems='left'
      mt={2}
      color={theme.palette.error.main}
      style={{ overflowWrap: 'break-word' }}
    >
      {msg}
    </Typography>
  );
};

export default Message;
