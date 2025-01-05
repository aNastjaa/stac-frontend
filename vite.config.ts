import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff2', '**/*.ttf', '**/*.woff'],
  server: {
    proxy: {
      '/sanctum/csrf-cookie': 'http://localhost:8000', // Proxy CSRF cookie request to Laravel backend
      '/api': 'http://localhost:8000', // Proxy other API requests to Laravel backend
    },
  },
  build: {
    outDir: 'public/build', // Output the built files in Laravel's public folder
    assetsDir: 'assets',
  },
  publicDir: 'public',
})


