import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';

const StyledMenu: any = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: alpha('#555555', 1) + ' !important',
    borderRadius: 20,
    minWidth: 160,
    color: theme.palette.mode === 'light' ? 'white' : 'white',
    marginTop: '-20px',
    marginLeft: '-10px',
    padding: 0,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '20px 0',
    },
    '& .MuiMenuItem-root': {
      backgroundColor: alpha('#555555', 1),
      '& .MuiSvgIcon-root': {
        fontSize: 24,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active, &:hover': {
        backgroundColor: alpha('#777777', 1) + ' !important',
      },
    },
  },
}));

export default StyledMenu;
