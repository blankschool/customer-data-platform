import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('/xlsx/')) return 'xlsx'
          if (id.includes('/recharts/')) return 'charts'

          if (
            id.includes('/@supabase/') ||
            id.includes('/@trpc/') ||
            id.includes('/@tanstack/react-query/')
          ) {
            return 'data'
          }

          if (
            id.includes('/@radix-ui/') ||
            id.includes('/lucide-react/') ||
            id.includes('/sonner/') ||
            id.includes('/next-themes/')
          ) {
            return 'ui'
          }

          return 'vendor'
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
