import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        galeria: resolve(__dirname, 'galeria/index.html'),
        arlista: resolve(__dirname, 'arlista/index.html'),
        impresszum: resolve(__dirname, 'impresszum/index.html'),
      },
    },
  },
})
