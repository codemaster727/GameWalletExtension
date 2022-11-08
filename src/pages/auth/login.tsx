/*global chrome*/
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthState } from '~/constants';
import { useAuth } from '~/context/AuthProvider';
import './auth.scss';

const Login = () => {
  const [password, setPassword] = useState('');
  const { authed, signIn } = useAuth();
  const navigate = useNavigate();
  const signInHere = async () => {
    const unlock_result = await signIn(password);
    console.log(unlock_result);

    if (unlock_result) {
      console.log('go to balances');
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // useEffect(() => {
  //   if (authed) navigate('/balances');
  // }, [authed]);

  return (
    <Box className='extension-box' sx={{ backgroundColor: '#202328' }}>
      <div
        style={{
          backgroundColor: '#ffff80',
          borderRadius: '50%',
          width: 170,
          height: 170,
          margin: 'auto',
          marginTop: '80px',
          textAlign: 'center',
          verticalAlign: 'center',
          paddingTop: '25%',
          color: 'black',
          fontSize: '30px',
        }}
      ></div>
      <Typography variant='h3' component={'article'} fontWeight='bold' marginTop={2}>
        Welcome back!
      </Typography>
      <Input
        className='pw-input'
        disableUnderline
        sx={{
          color: 'white',
          width: '80%',
          fontSize: 12,
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
            style={{ fontSize: '12px', textDecoration: 'underline' }}
          >
            Forgot Password?
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
