import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_APP_BASE || '/',
    plugins: [
      figmaAssetResolver(),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@api': path.resolve(__dirname, './src/api'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('motion')) return 'vendor-motion'
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('axios')) return 'vendor-axios'
            if (id.includes('@radix-ui')) return 'vendor-radix'
          },
        },
      },
    },
    server: {
      proxy: {
        // AIGC 网关须优先于通用 /api，路径不重写
        '/api/aigc': {
          target: env.VITE_AIGC_GATEWAY_TARGET || 'http://127.0.0.1:18000',
          changeOrigin: true,
        },
        // temp-maven 业务后端（api.json）
        '/temp': {
          target: env.VITE_TEMP_API_TARGET || 'http://100.100.30.67:13004/',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://100.100.30.67:8085/',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
