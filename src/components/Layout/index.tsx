import React from 'react';
import { Button, Box } from '@mui/material';
import Logo from 'src/assets/logo/128px_Logo.png';
import Setting from 'src/assets/logo/setting.jpg';
import { useAuth } from '~/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

interface LayoutProps {
  children: React.ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { authed } = useAuth();
  if (!authed) {
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
