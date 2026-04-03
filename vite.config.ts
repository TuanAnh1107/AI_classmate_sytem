import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = process.env.GITHUB_ACTIONS === 'true' ? '/AI_classmate_sytem/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base: githubPagesBase,
  plugins: [react()],
})
