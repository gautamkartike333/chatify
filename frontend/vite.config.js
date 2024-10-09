import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   proxy: {
//     '/api':{
//       target:'http://localhost:3000',
//       secure:false
//     }
//   }
// })
////////////////////////

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Make sure this is correct
        secure: false,
        // changeOrigin: true,
      },
    },
  },
});
