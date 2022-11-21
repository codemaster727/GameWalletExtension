import React from 'react';
import { Button, Box } from '@mui/material';
import { useAuth } from '~/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { AuthState } from '~/constants';
import { useSocket } from '~/context/SocketProvider';
import { Rings } from 'react-loading-icons';

interface LayoutProps {
  children: React.ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { authed } = useAuth();
  const { loading } = useSocket();
  if (authed !== AuthState.AUTHED) {
    return <div>{children}</div>;
  } else {
    return (
      <Box className='extension-box'>
        <NavBar />
        {loading ? <Rings style={{ marginTop: '50%' }} /> : children}
      </Box>
    );
  }
};

export default Layout;
