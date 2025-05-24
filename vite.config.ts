import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-toastify'],
          
          // Split admin into smaller chunks
          'admin-auth': [
            './src/components/admin/Login.tsx',
            './src/components/admin/ProtectedRoute.tsx'
          ],
          
          'admin-dashboard': [
            './src/components/admin/Dashboard.tsx'
          ],
          
          'admin-applications': [
            './src/components/admin/ApplicationView.tsx',
            './src/components/admin/ApplicationEdit.tsx',
            './src/components/admin/ApplicationPrintView.tsx'
          ],
          
          // Main app chunks
          'registration': ['./src/components/RegistrationForm.tsx'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
  }
})
