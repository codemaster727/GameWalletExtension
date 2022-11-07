// import { IDefaultTheme } from 'styled-components';
import { Theme, ThemeOptions, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const defaultTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#0abab5',
      light: '#0abab5',
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
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
  },
});

export default defaultTheme;
