import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';

// Function to copy components directory
function copyComponents() {
  const componentsDir = 'components';
  const distComponentsDir = 'dist/components';
  
  if (!existsSync(distComponentsDir)) {
    mkdirSync(distComponentsDir, { recursive: true });
  }
  
  // Copy each component file
  const componentFiles = [
    'header.html',
    'hero.html',
    'about.html',
    'technologies.html',
    'experience.html',
    'education.html',
    'projects.html',
    'publications.html',
    'contact.html',
    'footer.html',
    'loader.html',
    'social-sidebar.html'
  ];
  
  componentFiles.forEach(file => {
    const sourcePath = `${componentsDir}/${file}`;
    const destPath = `${distComponentsDir}/${file}`;
    if (existsSync(sourcePath)) {
      let content = readFileSync(sourcePath, 'utf-8');
      // Update image paths to be absolute
      content = content.replace(/src="assets\//g, 'src="/assets/');
      content = content.replace(/href="assets\//g, 'href="/assets/');
      writeFileSync(destPath, content);
    }
  });
}

// Function to copy assets directory
function copyAssets() {
  const assetsDir = 'assets';
  const distAssetsDir = 'dist/assets';
  
  if (!existsSync(distAssetsDir)) {
    mkdirSync(distAssetsDir, { recursive: true });
  }
  
  // Copy all files from assets directory
  if (existsSync(assetsDir)) {
    const copyDir = (src, dest) => {
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }
      const files = readdirSync(src, { withFileTypes: true });
      for (const file of files) {
        const srcPath = `${src}/${file.name}`;
        const destPath = `${dest}/${file.name}`;
        if (file.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    };
    copyDir(assetsDir, distAssetsDir);
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  base: '/tapos-datta.github.io/',  // For GitHub Pages user site
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
  },
  plugins: [
    {
      name: 'copy-assets-and-components',
      closeBundle() {
        copyComponents();
        copyAssets();
      }
    }
  ]
});
