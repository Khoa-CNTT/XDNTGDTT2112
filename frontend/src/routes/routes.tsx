import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import Home from '@pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        lazy: async () => {
          const { default: Component } = await import('@pages/Login');
          return { Component };
        },
      },
      {
        path: '/sign-up',
        lazy: async () => {
          const { default: Component } = await import('@pages/SignUp');
          return { Component };
        },
      },
      {
        path: '/cart',
        lazy: async () => {
          const { default: Component } = await import('@pages/Cart');
          return { Component };
        },
      },
      {
        path: '/account',
        lazy: async () => {
          const { default: Component } = await import('@pages/Account');
          return { Component };
        },
      },
    ],
  },
]);

export default router;
