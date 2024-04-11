import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import process from "node:process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  tsconfigPaths(),
  ],
  esbuild: {
    drop: process.env.PROD === "1" ? ["console"] : [],
  },
  preview: {
    port: 8080,
  },
  server: {
    port: 4200,
    host: true,
  },
})
