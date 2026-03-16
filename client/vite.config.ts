import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {            // 2. Tambahkan aturan resolve alias
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
