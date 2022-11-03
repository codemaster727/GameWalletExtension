import react, { useEffect, useState } from 'react';
import { Rings } from 'react-loading-icons';
import Login from './login';
import Signup from './signup';

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    const fetchStorage = async () => {
      const { email } = await chrome.storage?.local.get('email');
      setLoading(false);
      setEmail(email);
    };
    fetchStorage();
  }, []);

  if (loading && false) return <Rings />;
  else {
    if (!email && email !== '') {
      return <Login />;
    } else {
      return <Signup />;
    }
  }
};

export default AuthPage;
