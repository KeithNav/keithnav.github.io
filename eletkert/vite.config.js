import { defineConfig } from 'vite'

export default defineConfig({
  // Development server konfigurálása
  server: {
    host: true,
    port: 5176
  },
  
  // Build konfigurálása
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        receptek: 'receptek.html',
        galeria: 'galeria.html'
      }
    }
  }
})



