import { defineConfig, type ViteDevServer, type PreviewServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'

const mockApiPlugin = () => {
  const handler = (_req: IncomingMessage, res: ServerResponse) => {
    const data = fs.readFileSync(path.resolve(__dirname, './src/data/products.json'), 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.end(data)
  }

  return {
    name: 'mock-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/products', handler)
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use('/api/products', handler)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
