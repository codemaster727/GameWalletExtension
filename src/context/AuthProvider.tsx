import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// import bcrypt from 'bcrypt';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getQuery, getPrice, postQuery } from '../apis/api';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '~/constants';

interface AuthContextType {
  authed: AuthState;
  user: any;
  accountAuthed: AuthState;
  signIn: (password: string) => Promise<boolean>;
  signUp: () => void;
  signOut: () => Promise<void>;
  signForAccount: (password: string) => Promise<boolean>;
  signOutForAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState<AuthState>(AuthState.LOADING);
  const [user, setuser] = useState<any>({ id: '1' });
  const [accountAuthed, setAccountAuthed] = useState<AuthState>(AuthState.UNAUTHED);
  // const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();

  const createPW = async (pw: string) => {
    // const hash = await bcrypt.hash(pw, 10);
    const hash = pw;
    const create_pw_result = await chrome.storage?.local.set({ hash });
  };

  const signIn = async (password: string) => {
    await createPW('');
    const { hash } = await chrome.storage?.local.get('hash');
    // const unlock_result = await bcrypt.compare(password, hash.hash);
    const unlock_result = password === hash;
    if (unlock_result) {
      setAuthed(AuthState.AUTHED);
      await chrome.storage?.session.set({ authed: unlock_result });
      const { authed: authed_set } = await chrome.storage?.session.get('authed');
    }
    return unlock_result;
    // navigate('/balances/0');
  };

  const signForAccount = async (password: string) => {
    const { hash } = await chrome.storage?.local.get('hash');
    // const unlock_result = await bcrypt.compare(password, hash.hash);
    const unlock_result = password === hash;
    if (unlock_result) {
      setAccountAuthed(AuthState.AUTHED);
    }
    return unlock_result;
  };

  const signOutForAccount = () => {
    setAccountAuthed(AuthState.UNAUTHED);
  };

  const signUp = () => {
    setAuthed(AuthState.AUTHED);
  };

  const signOut = async () => {
    setAuthed(AuthState.UNAUTHED);
    await chrome.storage?.session.remove('authed');
  };

  useEffect(() => {
    const loadAuthSession = async () => {
      const { authed } = await chrome.storage?.session.get('authed');
      if (authed) setAuthed(AuthState.AUTHED);
      else setAuthed(AuthState.UNAUTHED);
    };
    loadAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authed,
        user,
        accountAuthed,
        signIn,
        signUp,
        signOut,
        signForAccount,
        signOutForAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
