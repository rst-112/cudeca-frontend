import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'tailwindcss-animate',
            'sonner',
          ],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-utils': ['axios', 'zod', 'react-hook-form', '@hookform/resolvers'],
        },
      },
    },
  },
  // La configuración de 'test' se mueve a un archivo separado o se carga condicionalmente
  // para evitar este tipo de error al ejecutar 'npm run dev'.
});
