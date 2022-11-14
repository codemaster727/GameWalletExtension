import React from 'react';
import { Button, Box } from '@mui/material';
import { useAuth } from '~/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { AuthState } from '~/constants';

interface LayoutProps {
  children: React.ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { authed } = useAuth();
  if (authed !== AuthState.AUTHED) {
    return <div>{children}</div>;
  } else {
    return (
      <Box className='extension-box'>
        <NavBar />
        {children}
      </Box>
    );
  }
};

export default Layout;
