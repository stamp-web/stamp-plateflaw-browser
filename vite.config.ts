import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// @ts-ignore
export default ({ mode }) => {
  const CI = !!process.env.CI
  const processEnvironment = () => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    if (mode === 'test' && !CI) {
      process.env = { ...process.env, ...loadEnv('development', process.cwd()) }
    }
  }
  processEnvironment()

  const config = { https: true }

  if (mode !== 'production' && !CI) {
    // @ts-ignore
    config.proxy = {
      '^/Pictures': {
        target: process.env.VITE_PROXY_URL,
        secure: false,
        ssl: {
          key: fs.readFileSync(process.env.VITE_SSL_KEY as string, 'utf8'),
          cert: fs.readFileSync(process.env.VITE_SSL_CERT as string, 'utf8')
        },
        changeOrigin: true,
        configure: (proxy: object, options: object) => {
          // @ts-ignore
          options.auth = `${process.env.VITE_PROXY_USER}:${process.env.VITE_PROXY_PASSWORD}`
        }
      }
    }
  }

  // https://vitejs.dev/config/
  return defineConfig({
    // @ts-ignore
    plugins: [vue(), basicSsl(), tailwindcss, autoprefixer],
    server: {
      // @ts-ignore
      proxy: config.proxy
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
