import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine network
  const network = env.DFX_NETWORK || (mode === 'production' ? 'ic' : 'local')
  
  // Create Internet Identity URL based on network
  const internetIdentityUrl = network === 'local' 
    ? `http://${env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
    : 'https://identity.ic0.app'
  
  return {
    plugins: [react()],
    root: 'src/blackjack_frontend',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4943',
          changeOrigin: true,
        },
      },
    },
    define: {
      'process.env.CANISTER_ID_BLACKJACK_BACKEND': JSON.stringify(env.CANISTER_ID_BLACKJACK_BACKEND),
      'process.env.CANISTER_ID_INTERNET_IDENTITY': JSON.stringify(env.CANISTER_ID_INTERNET_IDENTITY),
      'process.env.DFX_NETWORK': JSON.stringify(network),
      'process.env.II_URL': JSON.stringify(internetIdentityUrl),
    },
  }
})