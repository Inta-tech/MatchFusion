import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/MatchFusion/',
  server: {
    port: 5173,
    strictPort: true, // Prevents Vite from switching ports if 5173 is busy
  }
})