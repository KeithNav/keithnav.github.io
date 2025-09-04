import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'


const __dirname = dirname(fileURLToPath(import.meta.url))

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
        main: resolve(__dirname, 'index.html'),
        receptek: resolve(__dirname, 'receptek.html'),
        galeria: resolve(__dirname, 'galeria.html'),
        impresszum: resolve(__dirname, 'impresszum.html'),
        adatkezelesi: resolve(__dirname, 'adatkezelesi-tajekoztato.html')
      }
    }
  }
  
})



