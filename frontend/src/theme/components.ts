// Types
import type { Components, CssVarsTheme, Theme } from '@mui/material';

type ThemeComponents =
  | Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>
  | undefined;

export const components: ThemeComponents = {
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: '#0f4c5c',
        color: 'whitesmoke',
      },
    },
  },
};
