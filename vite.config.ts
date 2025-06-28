import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('axios')) {
              return 'api-vendor';
            }
            if (id.includes('lucide') || id.includes('toastify')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
          
          // Admin components
          if (id.includes('/admin/Login') || id.includes('/admin/ProtectedRoute') || id.includes('AuthService')) {
            return 'admin-auth';
          }
          
          if (id.includes('/admin/Dashboard')) {
            return 'admin-dashboard';
          }
          
          if (id.includes('/admin/Application')) {
            return 'admin-applications';
          }
          
          // Main registration form
          if (id.includes('RegistrationForm')) {
            return 'registration';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
  }
})
