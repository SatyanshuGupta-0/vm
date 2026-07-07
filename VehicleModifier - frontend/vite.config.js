import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Import React plugin for Vite
import path from 'path'; // Node.js path module

export default defineConfig({
  plugins: [react()], // Include React plugin
  resolve: {
    alias: {
      three: path.resolve('./node_modules/three'), // Ensure Three.js resolves correctly
    },
  },
  server: {
    cors: true,
    host: '192.168.31.244', // Binds to all available network interfaces
    port: 5000,      // Optional: Change the port
  },
});
