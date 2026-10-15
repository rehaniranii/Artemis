import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},build:{sourcemap:false,rollupOptions:{output:{manualChunks(id){if(/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id))return 'react-vendor';if(/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id))return 'motion-vendor';}}}}});
