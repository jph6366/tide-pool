import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

const cesiumSource = 'node_modules/cesium/Build/Cesium';
// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = 'cesiumStatic';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
  ],
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
        global: 'globalThis',
        CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
      }
    }
  },
  server: {
    port: 4444,
    open: true,
  },
});
