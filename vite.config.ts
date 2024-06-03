import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
  },
  envDir: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vis.gl/react-google-maps/examples.js':
      'https://visgl.github.io/react-google-maps/scripts/examples.js',
      stream: 'stream-browserify'
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    port: 4444,
    open: true,
  },
});
