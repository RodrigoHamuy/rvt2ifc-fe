import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import liveReload from 'vite-plugin-live-reload'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), liveReload('src')],
  base: '',
})
