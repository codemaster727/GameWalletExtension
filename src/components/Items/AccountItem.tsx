import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { style_btn_copy } from 'src/components/styles';
import { useTheme } from '@mui/material';

const AccountItem = ({
  label,
  value,
  copyFn,
}: {
  label: string;
  value: string;
  copyFn: () => void;
}) => {
  const theme = useTheme();
  return (
    <>
      <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
      <Box p='10px 24px'>
        <Typography
          variant='h6'
          component='h6'
          textAlign='left'
          color={theme.palette.text.secondary}
        >
          {label}
        </Typography>
        <Box display='flex' justifyContent='center' alignItems='left' sx={{ gap: '10px' }} mt={0.5}>
          <Typography
            variant='h6'
            component='article'
            textAlign='left'
            fontSize='14px'
            fontWeight='bold'
            fontFamily='Arial, sans-serif'
            letterSpacing={0.5}
            lineHeight='normal'
            width={310}
            style={{ overflowWrap: 'break-word' }}
            color={theme.palette.primary.main}
          >
            {value}
          </Typography>
          <Button style={style_btn_copy} onClick={copyFn}>
            <ContentCopyIcon fontSize='large' color='info' />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AccountItem;
