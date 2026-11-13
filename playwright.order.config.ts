import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/order',
  use: { baseURL: 'http://127.0.0.1:4322', trace: 'retain-on-failure' },
  projects: [{ name: 'sur-mesure', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'npm exec -- astro preview --outDir .test-order-dist --host 127.0.0.1 --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    timeout: 30000,
  },
});
