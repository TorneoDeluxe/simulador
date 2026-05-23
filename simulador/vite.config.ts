import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// allow using process in this config without needing @types/node
declare const process: { env: Record<string, string | undefined> }

// https://vitejs.dev/config/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
export default defineConfig({
  plugins: [react()],
  //base: '/simulador-react/',
  base: repoName ? `/${repoName}/` : './',
})
