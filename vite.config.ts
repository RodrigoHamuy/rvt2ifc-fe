import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'
import reactRefresh from '@vitejs/plugin-react-refresh'

/** React Hot Reloading
 * useful for small React Components changes, 
 * buggy for anything else   */
const useReactRefresh = false;

// https://vitejs.dev/config/
export default defineConfig({
  plugins:  useReactRefresh ? [reactRefresh()] : [liveReload('src')],
  base: '',
})
