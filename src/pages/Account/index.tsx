import react, { useEffect, useState } from 'react';
import { Rings } from 'react-loading-icons';
import { AuthState } from '~/constants';
import { useAuth } from '~/context/AuthProvider';
import Account from './account';
import AccountPassword from './account_password';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const { accountAuthed = AuthState.UNAUTHED, signOutForAccount } = useAuth();

  useEffect(() => {
    return signOutForAccount();
  }, []);

  if (accountAuthed === AuthState.UNAUTHED) {
    return <AccountPassword />;
  } else {
    return <Account />;
  }
};

export default AccountPage;
