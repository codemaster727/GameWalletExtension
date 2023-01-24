import React, { useEffect, useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
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
import store from './store/store';
import {
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
} from './constants/routes';
import SelectAction from './pages/first-time-flow/select-action';
import ImportWithSeedPhrase from './pages/first-time-flow/create-password/import-with-seed-phrase';
import NewAccount from './pages/first-time-flow/create-password/new-account';
import RevealSeedPhrase from './pages/first-time-flow/seed-phrase/reveal-seed-phrase';
import ConfirmSeedPhrase from './pages/first-time-flow/seed-phrase/confirm-seed-phrase';
import EndOfFlow from './pages/first-time-flow/end-of-flow';
// import * as actions from './store/actions';
// import {} from './scripts/ui';

const draftInitialState = {
  // activeTab: opts.activeTab,

  // metamaskState represents the cross-tab state
  // metamask: metamaskState,
  wallet: {},

  // appState represents the current tab's popup state
  appState: {},
};
// const store = configureStore(draftInitialState);

// Create a client
const queryClient = new QueryClient();

// import { _setBackgroundConnection } from './store/action-queue';

/**
 * Method to update backgroundConnection object use by UI
 *
 * @param backgroundConnection - connection object to background
 */
// export const updateBackgroundConnection = (backgroundConnection: any) => {
//   _setBackgroundConnection(backgroundConnection);
//   // backgroundConnection.onNotification((data: any) => {
//   //   if (data.method === 'sendUpdate') {
//   //     store.dispatch(actions.updateMetamaskState(data.params[0]));
//   //   } else {
//   //     throw new Error(
//   //       `Internal JSON-RPC Notification Not Handled:\n\n ${JSON.stringify(
//   //         data,
//   //       )}`,
//   //     );
//   //   }
//   // });
// };

const App = () => {
  const [seedPhrase, setSeedPhrase] = useState<any>();
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
    return e.request.url?.replace('http://localhost:3000', '');
  };

  // const handleCreateNewAccount = async (password: string) => {
  //   const { createNewAccount } = this.props;

  //   try {
  //     const seedPhrase = await createNewAccount(password);
  //     setSeedPhrase(seedPhrase);
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // };

  // const handleImportWithSeedPhrase = async (password: string, seedPhrase: any) => {
  //   const { createNewAccountFromSeed } = this.props;

  //   try {
  //     const vault = await createNewAccountFromSeed(password, seedPhrase);
  //     return vault;
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // };

  // const handleUnlock = async (password: string) => {
  //   const { unlockAccount, history, nextRoute } = this.props;

  //   try {
  //     const seedPhrase = await unlockAccount(password);
  //     setSeedPhrase(seedPhrase);
  //     navigate(nextRoute);
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // };

  const router = createHashRouter([
    {
      path: INITIALIZE_ROUTE,
      element: (
        // <AuthRoute>
        <SelectAction />
        // </AuthRoute>
      ),
    },
    {
      path: INITIALIZE_CREATE_PASSWORD_ROUTE,
      element: <NewAccount />,
    },
    {
      path: INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
      element: <ImportWithSeedPhrase />,
    },
    {
      path: INITIALIZE_SEED_PHRASE_ROUTE,
      element: <RevealSeedPhrase />,
    },
    {
      path: INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
      element: <ConfirmSeedPhrase />,
    },
    {
      path: INITIALIZE_END_OF_FLOW_ROUTE,
      element: <EndOfFlow />,
    },
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
          path: '/swap/:token/:net',
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

  // useEffect(() => {
  //   dispatch(createNewAccount('123456'));
  // });
  return (
    <>
      <Provider store={store}>
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
      </Provider>
    </>
  );
};

export default App;
