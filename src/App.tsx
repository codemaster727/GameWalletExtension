import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import defaultTheme from 'src/styles/theme/defaultTheme';
import GlobalStyles from 'src/styles/GlobalStyles';
import Home from 'src/pages/Home';
import { SocketProvider } from './context/SocketProvider';
import { WalletModalProvider } from './context/WalletModalProvider';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <WalletModalProvider>
              <Home />
              <GlobalStyles />
              <ToastContainer />
            </WalletModalProvider>
          </SocketProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
