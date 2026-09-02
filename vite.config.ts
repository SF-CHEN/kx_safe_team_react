/**
 * [INPUT]: Vite、React、Tailwind、自动导入、图标插件与玄鉴现有代理/资源规则
 * [OUTPUT]: 构建、Hash 应用资源路径、API 代理、代码分包和自动导入配置
 * [POS]: 工程配置入口；保留现有运行行为，同时对齐 react-ai-template 工具链
 */
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(projectRoot, 'src/assets', filename)
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
      AutoImport({
        imports: ['react'],
        // 迁移完成后业务代码统一从新目录自动导入；保留旧目录一段时间只为兼容未迁完文件。
        dirs: ['./src/components/ui', './src/app/components/ui', './src/hooks'],
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'jsx',
            enabledCollections: ['lucide'],
          }),
        ],
        dts: './src/auto-imports.d.ts',
      }),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
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
            if (id.includes('@tanstack/react-query')) return 'vendor-query'
            if (id.includes('motion')) return 'vendor-motion'
            if (id.includes('recharts') || id.includes('echarts') || id.includes('d3-')) {
              return 'vendor-charts'
            }
            if (id.includes('lucide-react') || id.includes('@iconify')) return 'vendor-icons'
            if (id.includes('axios')) return 'vendor-axios'
            if (id.includes('@radix-ui')) return 'vendor-radix'
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/aigc': {
          target: env.VITE_AIGC_GATEWAY_TARGET || 'http://127.0.0.1:18000',
          changeOrigin: true,
        },
        '/temp': {
          target: env.VITE_TEMP_API_TARGET || 'http://100.100.30.67:13004/',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://100.100.30.67:8085/',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
        },
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
