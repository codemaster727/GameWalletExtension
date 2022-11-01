/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastPosition, Theme } from 'react-toastify';
import { Container, Section, Description, Warning } from '../../components/styles';
import { useSocket } from '../../context/SocketProvider';
import { useWalletModal } from '../../context/WalletModalProvider';
import { Link } from 'react-router-dom';

// toast.configure();

const toastify_option = {
  position: 'bottom-left' as ToastPosition | undefined,
  autoClose: 20000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark' as Theme | undefined,
};

const Home = () => {
  const { errorResult, successResult } = useSocket();
  const { setOpen } = useWalletModal();

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    toast.success(successResult?.message, toastify_option);
  }, [successResult]);

  useEffect(() => {
    toast.error(errorResult?.message, toastify_option);
  }, [errorResult]);

  return (
    <Container>
      <Section>
        <Description>"This is our Game Platform"</Description>
        <Description>"Deposit right now if you want to get income"</Description>
        <Warning>"Don't hesitate"</Warning>
      </Section>
      <Link to='/login'>To Login</Link>
      <Link to='/balances'>To Balances</Link>
      <Button onClick={handleOpen} variant='contained' size='large' sx={{ fontSize: 16 }}>
        Deposit here
      </Button>
    </Container>
  );
};

export default Home;
