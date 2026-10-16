import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Own ports so a running `pnpm dev` (3001/5173) does not collide with the test servers.
const apiPort = Number(process.env.E2E_API_PORT ?? 3101);
const webPort = Number(process.env.E2E_WEB_PORT ?? 5273);
// Fresh data file per run so the test always starts from the seed.
const dataFile = join(tmpdir(), `recetas-e2e-${Date.now()}.json`);

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: `http://127.0.0.1:${webPort}` },
  webServer: [
    {
      command: 'pnpm api',
      url: `http://127.0.0.1:${apiPort}/api/health`,
      env: { API_PORT: String(apiPort), DATA_FILE: dataFile },
      reuseExistingServer: false,
    },
    {
      command: 'pnpm exec vite --host 127.0.0.1',
      url: `http://127.0.0.1:${webPort}`,
      env: { API_PORT: String(apiPort), WEB_PORT: String(webPort) },
      reuseExistingServer: false,
    },
  ],
});
