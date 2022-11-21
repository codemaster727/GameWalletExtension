import React from 'react';
import {
  // createBrowserRouter,
  RouterProvider,
  // createMemoryRouter,
  createHashRouter,
  Outlet,
  Navigate,
  useLoaderData,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import defaultTheme from 'src/styles/theme/defaultTheme';
import GlobalStyles from 'src/styles/GlobalStyles';
import Home from 'src/pages/Home';
import Balances from 'src/pages/Balances';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { StateProvider } from './context/StateProvider';
import { SocketProvider } from './context/SocketProvider';
import { WalletModalProvider } from './context/WalletModalProvider';
import ErrorPage from './pages/error-page';
import Layout from './components/Layout';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Forgot from './pages/auth/forgot';
import AuthPage from './pages/auth';
import { AuthState } from './constants';
import Transactions from './pages/Transactions';
import BuyCrypto from './pages/BuyCrypto';
import WithdrawNFT from './pages/WithdrawNFT';
import AccountPage from './pages/Account';
import Swap from './pages/Swap';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const { authed, signIn, signUp, signOut } = useAuth();
  const PrivateRoute = ({
    children,
  }: {
    children: React.ReactElement;
  }): React.ReactElement | null => {
    const { authed } = useAuth();
    return authed === AuthState.AUTHED ? children : <Navigate to='/' />;
  };

  const AuthRoute = ({ children }: { children: React.ReactElement }) => {
    const { authed } = useAuth();
    const origin: string = useLoaderData() as string;
    return authed ? <Navigate to={origin} replace={true} /> : children;
  };

  const signInLoader = (e: any) => {
    console.log('loader: ', e.request.url?.replace('http://localhost:3000', ''));
    return e.request.url?.replace('http://localhost:3000', '');
  };

  const router = createHashRouter([
    {
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/home',
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/',
          element: (
            // <AuthRoute>
            <AuthPage />
            // </AuthRoute>
          ),
          loader: signInLoader,
        },
        {
          path: '/forgot',
          element: (
            // <AuthRoute>
            <Forgot />
            // </AuthRoute>
          ),
          loader: signInLoader,
        },
        {
          path: '/balances/:tab',
          element: (
            <PrivateRoute>
              <Balances />
            </PrivateRoute>
          ),
        },
        {
          path: '/deposit/:token',
          element: (
            <PrivateRoute>
              <Deposit />
            </PrivateRoute>
          ),
        },
        {
          path: '/withdraw/:token',
          element: (
            <PrivateRoute>
              <Withdraw />
            </PrivateRoute>
          ),
        },
        {
          path: '/withdrawNFT/:token',
          element: (
            <PrivateRoute>
              <WithdrawNFT />
            </PrivateRoute>
          ),
        },
        {
          path: '/swap',
          element: (
            <PrivateRoute>
              <Swap />
            </PrivateRoute>
          ),
        },
        {
          path: '/transactions',
          element: (
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          ),
        },
        {
          path: '/buy-cryptos',
          element: (
            <PrivateRoute>
              <BuyCrypto />
            </PrivateRoute>
          ),
        },
        {
          path: '/account',
          element: (
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <StateProvider>
                <WalletModalProvider>
                  <RouterProvider router={router} />
                  <GlobalStyles />
                  <ToastContainer />
                </WalletModalProvider>
              </StateProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
