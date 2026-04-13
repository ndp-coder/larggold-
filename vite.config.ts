import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function copyPublicDir(): import('vite').Plugin {
  return {
    name: 'safe-copy-public',
    apply: 'build',
    enforce: 'post',
    generateBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const outDir = path.resolve(__dirname, 'dist');
      const entries = fs.readdirSync(publicDir);
      for (const entry of entries) {
        if (entry.includes(' ')) continue;
        const src = path.join(publicDir, entry);
        const dest = path.join(outDir, entry);
        try {
          fs.copyFileSync(src, dest);
        } catch {
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyPublicDir()],
  publicDir: false,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
