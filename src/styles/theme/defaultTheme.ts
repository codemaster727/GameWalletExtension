// import { IDefaultTheme } from 'styled-components';
import { Theme, ThemeOptions, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const defaultTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#0da3a0',
      light: '#0da3a0',
      dark: '#0abab5aa',
    },
    secondary: {
      main: '#282b31',
      dark: '#282b31aa',
    },
    info: {
      main: '#FFFFFF',
      dark: '#000000',
    },
    background: {
      default: '#202328',
      paper: '#191c20',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
    grey: {
      '800': '#333333',
      '900': '#191c20',
    },
  },
});

export default defaultTheme;
