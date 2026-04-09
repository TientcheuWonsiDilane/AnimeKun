import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    host: true,
    allowedHosts: true
  }
})
