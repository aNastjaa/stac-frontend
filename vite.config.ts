import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff2', '**/*.ttf', '**/*.woff'],
  server: {
    proxy: {
      '/sanctum/csrf-cookie': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    outDir:  'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js', 
  },
})


