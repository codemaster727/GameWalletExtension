import { Box, Button, Input, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthProvider';
import './auth.scss';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const signUpHere = () => {
    signUp();
    navigate('/balances');
  };

  return (
    <Box className='extension-box'>
      <Typography variant='h3' component={'article'} fontWeight='bold' marginTop={2}>
        Free to SignUp
      </Typography>
      <Input className='pw-input' sx={{ color: 'white' }} placeholder='Type your password' />
      <Input className='pw-input' sx={{ color: 'white' }} placeholder='Type your password' />
      <Input className='pw-input' sx={{ color: 'white' }} placeholder='Type your password' />
      <Button className='login-button' variant='contained' onClick={signUpHere}>
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
        <Link to='/' style={{ fontSize: '1.20px', textDecoration: 'underline', color: '#95f204' }}>
          Forgot Password?
        </Link>
        <Link to='/' style={{ fontSize: '1.20px', textDecoration: 'underline', color: '#95f204' }}>
          Free to Sign Up
        </Link>
      </Box>
    </Box>
  );
};

export default Signup;
