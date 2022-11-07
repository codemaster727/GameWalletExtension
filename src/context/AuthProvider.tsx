import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
// import bcrypt from 'bcrypt';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getQuery, getPrice, postQuery } from '../apis/api';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '~/constants';

interface AuthContextType {
  authed: AuthState;
  signIn: (password: string) => Promise<boolean>;
  signUp: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState<AuthState>(AuthState.LOADING);
  // const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();
  const user = '1';

  const createPW = async (pw: string) => {
    // const hash = await bcrypt.hash(pw, 10);
    const hash = pw;
    const create_pw_result = await chrome.storage?.local.set({ hash });
    console.log(hash, create_pw_result);
  };

  const signIn = async (password: string) => {
    await createPW('');
    const { hash } = await chrome.storage?.local.get('hash');
    console.log(hash);
    // const unlock_result = await bcrypt.compare(password, hash.hash);
    const unlock_result = password === hash;
    if (unlock_result) {
      setAuthed(AuthState.AUTHED);
      await chrome.storage?.session.set({ authed: unlock_result });
      const { authed: authed_set } = await chrome.storage?.session.get('authed');
      console.log('auth_session: ', authed_set);
    }
    return unlock_result;
    // navigate('/balances');
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
      console.log('auth_session: ', authed);
      if (authed) setAuthed(AuthState.AUTHED);
      else setAuthed(AuthState.UNAUTHED);
    };
    loadAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authed,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
