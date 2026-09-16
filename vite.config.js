import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = __dirname;

function copyVanillaScripts() {
  return {
    name: 'copy-vanilla-scripts',
    generateBundle() {
      readdirSync(resolve(projectRoot, 'js'))
        .filter(fileName => fileName.endsWith('.js'))
        .forEach(fileName => {
          this.emitFile({
            type: 'asset',
            fileName: `js/${fileName}`,
            source: readFileSync(resolve(projectRoot, 'js', fileName))
          });
        });
    }
  };
}

export default defineConfig({
  plugins: [copyVanillaScripts()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        index: resolve(projectRoot, 'index.html'),
        dashboard: resolve(projectRoot, 'dashboard.html'),
        inbox: resolve(projectRoot, 'inbox.html'),
        analytics: resolve(projectRoot, 'analytics.html'),
        settings: resolve(projectRoot, 'settings.html'),
        profile: resolve(projectRoot, 'profile.html'),
        about: resolve(projectRoot, 'about.html'),
        privacy: resolve(projectRoot, 'privacy.html'),
        terms: resolve(projectRoot, 'terms.html'),
        alerts: resolve(projectRoot, 'alerts.html'),
        setupGuide: resolve(projectRoot, 'setup-guide.html')
      }
    }
  }
});
