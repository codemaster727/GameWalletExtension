import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getQuery, getPrice, postQuery } from '../apis/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  authed: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState<boolean>(false);
  // const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();
  const user = '1';

  const signIn = () => {
    setAuthed(true);
    // navigate('/balances');
  };

  const signUp = () => {
    setAuthed(true);
  };

  const signOut = () => {
    setAuthed(false);
  };

  // Queries
  const {
    status: tokenStatus,
    isLoading: tokenIsLoading,
    isError: tokenIsError,
    data: tokenData,
  } = useQuery(['/GetSupportedAssets'], getQuery);

  const {
    status: transactionStatus,
    isLoading: transactionIsLoading,
    isError: transactionIsError,
    mutate: transactionMutate,
    data: transactionData,
  } = useMutation(
    (data) => {
      return postQuery('/ListTransactions', data);
    },
    {
      onError: (data: any) => {
        const { error } = data;
      },
    },
  );

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
