/*global chrome*/
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthState } from '~/constants';
import { useAuth } from '~/context/AuthProvider';
import Logo from 'src/assets/logo/logo512.png';
import './auth.scss';

const Login = () => {
  const [password, setPassword] = useState('');
  const { authed, signIn } = useAuth();
  const navigate = useNavigate();
  const signInHere = async () => {
    const unlock_result = await signIn(password);

    if (unlock_result) {
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // useEffect(() => {
  //   if (authed) navigate('/balances/0');
  // }, [authed]);

  return (
    <Box className='extension-box' sx={{ backgroundColor: '#202328' }}>
      <img src={Logo} width={170} height={170} style={{ borderRadius: '50%', marginTop: '70px' }} />
      <Typography variant='h3' component={'article'} fontWeight='bold' marginTop={2}>
        Welcome back!
      </Typography>
      <Input
        type='password'
        className='pw-input'
        disableUnderline
        sx={{
          color: 'white',
          width: '80%',
          fontSize: 14,
        }}
        size='medium'
        placeholder='Type your password'
        value={password}
        onChange={handlePasswordChange}
      />
      <Button
        className='login-btn'
        sx={{ marginTop: 5, textTransform: 'unset' }}
        variant='contained'
        onClick={signInHere}
      >
        Unlock
      </Button>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: '30px',
        }}
      >
        <Typography color='primary' component='article'>
          <a
            onClick={() => {
              chrome.tabs.create({
                url: 'index.html#/forgot',
              });
            }}
            style={{ fontSize: '14px', textDecoration: 'underline' }}
          >
            Forgot Password?
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
