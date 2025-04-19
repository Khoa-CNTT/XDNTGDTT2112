import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@config': path.resolve(__dirname, './src/config'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@features': path.resolve(__dirname, './src/features'),
      '@env': path.resolve(__dirname, './src/env'),
    },
  },

  // server: {
  //   host: '0.0.0.0',
  //   port: 3000,
  //   proxy: {
  //     '/api': {
  //       target: 'http://backend:3000',
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
