import { existsSync, readFileSync } from 'node:fs';
import { env } from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import { certificateFilePaths } from './aspnetcore-https.js';

// The ASP.NET Core backend that the dev server proxies API requests to.
const proxyTarget = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'http://localhost:12499';

// Serve the dev server over HTTPS using the ASP.NET Core development
// certificate when it is available, so that it matches SpaProxyServerUrl.
function devServerHttpsOptions() {
  let certFilePath;
  let keyFilePath;

  try {
    ({ certFilePath, keyFilePath } = certificateFilePaths());
  } catch {
    return undefined;
  }

  if (!existsSync(certFilePath) || !existsSync(keyFilePath)) {
    return undefined;
  }

  return {
    cert: readFileSync(certFilePath),
    key: readFileSync(keyFilePath),
  };
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      },
    }),
  ],
  build: {
    // The .csproj publish target copies ClientApp/build into wwwroot.
    outDir: 'build',
  },
  server: {
    port: 44484,
    strictPort: true,
    open: false,
    https: devServerHttpsOptions(),
    proxy: {
      '/weatherforecast': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx}'],
  },
});
