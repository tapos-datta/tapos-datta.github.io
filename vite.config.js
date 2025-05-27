import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  base: '/',  // For GitHub Pages user site
  build: {
    outDir: 'dist',
    assetsDir: 'assets',  // Put all assets in an 'assets' directory
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html')
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    cssCodeSplit: true,  // Enable CSS code splitting
    cssMinify: true,     // Minify CSS
    modulePreload: {
      polyfill: true     // Enable module preload polyfill
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      crypto: 'crypto-js'
    }
  }
}); 