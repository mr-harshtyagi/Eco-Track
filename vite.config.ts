import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  define: {
    'process.env': {},
    global: 'window',
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  plugins: [react()],
});
