import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This section fixes the "Invalid Hook Call" error
  resolve: {
    alias: {
      // Force all libraries to use YOUR version of React
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      
      // Optional: Allows you to use "@" to refer to your src folder
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optional: Change default port if you want
  server: {
    port: 5173,
  }
})