import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function servePublicFiles(): import('vite').Plugin {
  return {
    name: 'serve-public-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const rawUrl = (req.url || '').split('?')[0];
          const url = decodeURIComponent(rawUrl);
          if (url.startsWith('/') && !url.startsWith('/@') && !url.startsWith('/src') && !url.startsWith('/node_modules')) {
            const filePath = path.join(__dirname, 'public', url.slice(1));
            try {
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes: Record<string, string> = {
                  '.png': 'image/png',
                  '.jpg': 'image/jpeg',
                  '.jpeg': 'image/jpeg',
                  '.webp': 'image/webp',
                  '.gif': 'image/gif',
                  '.svg': 'image/svg+xml',
                };
                const content = fs.readFileSync(filePath);
                res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.end(content);
                return;
              }
            } catch { /* skip unreadable files */ }
          }
        } catch { /* skip malformed URLs */ }
        next();
      });
    },
  };
}

function copyPublicOnBuild(): import('vite').Plugin {
  return {
    name: 'copy-public-on-build',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const entries = fs.readdirSync(publicDir);
      for (const entry of entries) {
        const src = path.join(publicDir, entry);
        const dest = path.join(outDir, entry);
        try {
          const stat = fs.statSync(src);
          if (stat.isFile()) {
            fs.writeFileSync(dest, fs.readFileSync(src));
          }
        } catch { /* skip unreadable files */ }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), servePublicFiles(), copyPublicOnBuild()],
  publicDir: false,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
