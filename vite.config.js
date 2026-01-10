import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 server: {
    host: true,
    allowedHosts: ['intermuscular-rosalee-drivingly.ngrok-free.dev'],
    port: 5173
  }
})
