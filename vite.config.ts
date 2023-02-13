import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crossOriginIsolation()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
    },
  },
  server: {
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "PUT, GET, HEAD, POST, DELETE, OPTIONS",
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  // server: {
  //   host: "localhost",
  //   hmr: {
  //     host: "localhost",
  //   },
  // },
  build: {
    // outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./src/main.tsx"),
        index: path.resolve(__dirname, "./index.html"),
      }
    },
    manifest: true,
    sourcemap: true
  },
  base: "/",
  /* css: {
    postcss: {
      plugins: [
        // require('tailwindcss'),
        // require('autoprefixer')
      ]
    },
  } */
})
