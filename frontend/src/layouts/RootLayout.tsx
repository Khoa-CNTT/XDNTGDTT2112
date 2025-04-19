// react-router
import { Outlet } from 'react-router-dom';

// components
import Header from '@/components/header/Header';

// Notification
import { ToastContainer, Bounce } from 'react-toastify';

// Hooks
import { useTheme } from '@/hooks/useTheme';

// MUI
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getTheme } from '@/theme';

export default function RootLayout() {
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';

  const theme = getTheme(themeMode);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Outlet />
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? 'dark' : 'light'}
          transition={Bounce}
        />
      </ThemeProvider>
    </>
  );
}
