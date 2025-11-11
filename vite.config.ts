import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type ProxyOptions, PluginOption, HttpProxy } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

type CustomConfig = {
  https?: boolean
  proxy?: Record<string, ProxyOptions>
  plugins: PluginOption[]
}

export default ({ mode }) => {
  const CI = !!process.env.CI
  const processEnvironment = () => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    if (mode === 'test' && !CI) {
      process.env = { ...process.env, ...loadEnv('development', process.cwd()) }
    }
  }
  processEnvironment()

  const config: CustomConfig = {
    plugins: [vue(), basicSsl(), tailwindcss, autoprefixer] as PluginOption[],
    https: true
  }

  if (mode !== 'production' && !CI) {
    config.proxy = {
      '^/Pictures': {
        target: process.env.VITE_PROXY_URL,
        secure: false,
        ssl: {
          key: fs.readFileSync(process.env.VITE_SSL_KEY as string, 'utf8'),
          cert: fs.readFileSync(process.env.VITE_SSL_CERT as string, 'utf8')
        },
        changeOrigin: true,
        configure: (proxy: HttpProxy.Server, options: ProxyOptions) => {
          options.auth = `${process.env.VITE_PROXY_USER}:${process.env.VITE_PROXY_PASSWORD}`
        }
      }
    }
  }

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: config.plugins,
    base: '',
    server: {
      proxy: config.proxy
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
