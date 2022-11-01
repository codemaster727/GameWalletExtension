import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  createMemoryRouter,
  MemoryRouter,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
  useLoaderData,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import defaultTheme from 'src/styles/theme/defaultTheme';
import GlobalStyles from 'src/styles/GlobalStyles';
import Home from 'src/pages/Home';
import Login from 'src/pages/auth/login';
import Balances from 'src/pages/Balances';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { WalletModalProvider } from './context/WalletModalProvider';
import ErrorPage from './pages/error-page';
import Layout from './components/Layout';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';

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
    return authed ? children : <Navigate to='/' />;
  };

  const AuthRoute = ({ children }: { children: React.ReactElement }) => {
    const { authed } = useAuth();
    const origin: string = useLoaderData() as string;
    console.log(origin);
    return authed ? <Navigate to={origin} replace={true} /> : children;
  };

  const signInLoader = (e: any) => {
    console.log('loader: ', e);
    return e.request.url?.replace('http://localhost:3000', '');
  };

  const router = createMemoryRouter([
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
            <Login />
            // </AuthRoute>
          ),
          loader: signInLoader,
        },
        {
          path: '/balances',
          element: (
            <PrivateRoute>
              <Balances />
            </PrivateRoute>
          ),
        },
        {
          path: '/deposit',
          element: (
            <PrivateRoute>
              <Deposit />
            </PrivateRoute>
          ),
        },
        {
          path: '/withdraw',
          element: (
            <PrivateRoute>
              <Withdraw />
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
              <WalletModalProvider>
                <RouterProvider router={router} />
                <GlobalStyles />
                <ToastContainer />
              </WalletModalProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
