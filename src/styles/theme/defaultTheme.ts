// import { IDefaultTheme } from 'styled-components';
import { Theme, ThemeOptions, createTheme } from '@mui/material/styles';

const defaultTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#0abab5',
      light: '#0abab5',
      dark: '#0abab5',
    },
    secondary: { main: '#282b31' },
    background: {
      default: '#202328',
    },
    text: {
      primary: 'white',
      secondary: '#AAAAAA',
    },
  },
});

export default defaultTheme;
