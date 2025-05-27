import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html')
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },

    cssCodeSplit: true, // Split CSS per page
    // `minify` is enabled by default in production
  },

  server: {
    port: 3000,
    host: true,
    open: true
  },

  resolve: {
    alias: {
      crypto: 'crypto-js' // Polyfill for Vite/ESM
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
