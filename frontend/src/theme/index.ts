// MUI theme configuration
import { createTheme, responsiveFontSizes } from '@mui/material';
import { palette } from './palette';
import { components } from './components';
import { typography } from './typography';

export const getTheme = (mode: 'light' | 'dark') => {
  return responsiveFontSizes(
    createTheme({
      palette: {
        mode: mode,
        ...palette,
      },
      typography: typography,
      components: components,
    })
  );
};
