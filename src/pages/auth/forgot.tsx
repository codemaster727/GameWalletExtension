/*global chrome*/
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthProvider';
import './auth.scss';

const Forgot = () => {
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

  useEffect(() => {
    if (authed) navigate('/balances');
  }, [authed]);

  return (
    <Box className='extension-box'>
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
        Welcome!
      </Typography>
      <Input
        className='pw-input'
        sx={{ color: 'white', width: '80%', fontSize: 12 }}
        size='medium'
        placeholder='Type your password'
        value={password}
        onChange={handlePasswordChange}
      />
      <Button className='login-button' variant='contained' onClick={signInHere}>
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
        <Link to='/' style={{ fontSize: '12px', textDecoration: 'underline', color: '#0abab5' }}>
          Forgot Password?
        </Link>
        <Link to='/' style={{ fontSize: '12px', textDecoration: 'underline', color: '#0abab5' }}>
          Free to Sign Up
        </Link>
      </Box>
    </Box>
  );
};

export default Forgot;
