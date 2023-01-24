import React from 'react';
import { Button, Box } from '@mui/material';
import { useAuth } from '~/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { AuthState } from '~/constants';
import { useSocket } from '~/context/SocketProvider';
import { Rings } from 'react-loading-icons';
import LoadingIcon from 'src/assets/utils/loading.gif';

interface LayoutProps {
  children: React.ReactElement;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { authed } = useAuth();
  const { loading, networkError } = useSocket();
  // if (authed !== AuthState.AUTHED) {
  //   return <div>{children}</div>;
  // } else {
  return (
    <Box className='extension-box'>
      {networkError ? (
        <Box style={{ marginTop: '60%' }}>Network Error...</Box>
      ) : (
        // ) : loading ? (
        // <Rings style={{ marginTop: '60%' }}  />
        // <img src={LoadingIcon} width={80} style={{ marginTop: '0%' }} />
        <>
          <NavBar />
          {children}
        </>
      )}
    </Box>
  );
  // }
};

export default Layout;
