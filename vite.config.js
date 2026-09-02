import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        gaming: 'gaming.html',
        gta: 'gta.html',
      },
    },
  },
})
