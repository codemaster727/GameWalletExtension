import React from 'react';
import { Box } from '@mui/material';

type ScrollBoxProps = {
  height?: number;
  children: boolean | React.ReactElement | (React.ReactElement | boolean)[];
};
const BottomBox = ({ height = 420, children }: ScrollBoxProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
      }}
    >
      {children}
    </Box>
  );
};

export default BottomBox;
