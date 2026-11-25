import { defineConfig } from '@playwright/test';

// En CI se usa el Chromium de `playwright install`. En sandboxes sin acceso
// a cdn.playwright.dev se puede apuntar a un binario alternativo:
//   PLAYWRIGHT_CHROMIUM_PATH=/ruta/chromium npm run test:e2e
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: executablePath ? { executablePath, args: ['--no-sandbox'] } : undefined,
  },
  webServer: {
    command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
