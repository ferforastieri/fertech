import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/components$/, replacement: path.resolve(__dirname, './src/components/ui/index.ts') },
      { find: /^@\/components\/(.*)/, replacement: path.resolve(__dirname, './src/components/ui/$1') },
      { find: /^@\/lib$/, replacement: path.resolve(__dirname, './src/components/lib/index.ts') },
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, './src/$1') },
    ],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
    open: true
  }
})

