import React from 'react';
import { useTheme } from '@mui/material';

export function withTheme(Component: any) {
  return (props: any) => <Component {...props} theme={useTheme()} />;
}
