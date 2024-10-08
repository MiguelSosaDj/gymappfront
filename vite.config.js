import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { EventEmitter } from 'events';

// Ajustamos el límite de listeners
EventEmitter.defaultMaxListeners = 300;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
});
 