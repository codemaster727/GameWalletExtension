import react, { useEffect, useState } from 'react';
import { Rings } from 'react-loading-icons';
import { Navigate } from 'react-router-dom';
import { AuthState } from '~/constants';
import { useAuth } from '~/context/AuthProvider';
import Login from './login';
import Signup from './signup';

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>();
  console.log('here:', window.location);
  const { authed, signIn } = useAuth();

  useEffect(() => {
    const fetchStorage = async () => {
      const { email } = await chrome.storage?.local.get('email');
      setEmail(email);
      setLoading(false);
    };
    fetchStorage();
  }, []);

  if (authed === AuthState.LOADING) return <Rings />;
  else {
    if (authed === AuthState.UNAUTHED) {
      if (!email && email !== '') {
        return <Login />;
      } else {
        return <Signup />;
      }
    } else {
      return <Navigate to='balances' />;
    }
  }
};

export default AuthPage;
