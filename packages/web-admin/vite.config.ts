import {defineConfig} from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import server_config from './vite-server-config.json';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: server_config.server,
  preview: server_config.preview
});
