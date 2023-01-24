import react, { useEffect, useState } from 'react';
import { Rings } from 'react-loading-icons';
import { Navigate } from 'react-router-dom';
import { AuthState } from '~/constants';
import { useAuth } from '~/context/AuthProvider';
import Login from './login';
import Signup from './signup';
import { INITIALIZE_ROUTE } from '~/constants/routes';
import { useSelector } from 'react-redux';

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  // const [email, setEmail] = useState<string>();
  const { authed, signIn, initialized } = useAuth();
  const { completedOnboarding } = useSelector((state: any) => state.wallet);

  // useEffect(() => {
  //   const fetchStorage = async () => {
  //     const { email } = await chrome.storage?.local.get('email');
  //     setEmail(email);
  //     setLoading(false);
  //   };
  //   fetchStorage();
  // }, []);
  useEffect(() => {
    if (completedOnboarding === false) {
      window.open('index.html#' + INITIALIZE_ROUTE, '_blank');
    }
  }, []);

  // if (initialized === AuthState.LOADING) return <Rings style={{ marginTop: '50%' }} />;
  // else if (initialized === AuthState.UNAUTHED) {
  //   window.open(INITIALIZE_ROUTE, '_blank');
  //   return null;
  // }

  if (authed === AuthState.LOADING) return <Rings style={{ marginTop: '50%' }} />;
  else {
    if (authed === AuthState.UNAUTHED) {
      if (true) {
        return <Login />;
      } else {
        return <Signup />;
      }
    } else {
      return <Navigate to='/balances/0' />;
    }
  }
};

export default AuthPage;
