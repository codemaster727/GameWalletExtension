import { Box, Button, Input, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthProvider';
import './auth.scss';

const Signup = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [password_1, setPassword_1] = useState<string>();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'password_1':
        setPassword_1(value);
        break;

      default:
        break;
    }
  };

  const signUpHere = () => {
    signUp();
    navigate('/balances/0');
  };

  return (
    <Box className='extension-box' sx={{ backgroundColor: '#202328' }}>
      <Typography variant='h3' component={'article'} fontWeight='bold' marginTop={8}>
        Create Password
      </Typography>
      <Input
        className='pw-input'
        name='email'
        sx={{ color: 'white', width: '80%', fontSize: 14, mt: '6rem' }}
        size='medium'
        placeholder='Your email'
        value={email}
        onChange={handleChange}
        disableUnderline
      />
      <Input
        className='pw-input'
        name='password'
        type='password'
        disableUnderline
        sx={{ color: 'white', width: '80%', fontSize: 14 }}
        size='medium'
        placeholder='Password'
        value={password}
        onChange={handleChange}
      />
      <Input
        className='pw-input'
        name='password_1'
        disableUnderline
        sx={{ color: 'white', width: '80%', fontSize: 14 }}
        size='medium'
        placeholder='Confirm password'
        type='password'
        value={password_1}
        onChange={handleChange}
      />
      <Button className='login-btn' sx={{ marginTop: 8 }} variant='contained' onClick={signUpHere}>
        Create
      </Button>
    </Box>
  );
};

export default Signup;
