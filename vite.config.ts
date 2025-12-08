import { defineConfig } from 'vitest/config';
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.ts',

    // Configuración de Cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        // 1. Archivos de Configuración y Setup
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        'eslint.config.js',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/App.tsx',

        // 2. Componentes UI de Shadcn (Código de terceros/visual)
        'src/components/ui/**',

        // 3. Tipos y Mocks
        'src/types/**',
        'src/mocks/**',
        '**/*.d.ts',

        // 4. Utilidades de infraestructura
        'src/lib/utils.ts',
        'src/lib/axios.ts',
      ],

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
