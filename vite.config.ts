import { defineConfig } from 'vitest/config';

const apiPort = Number(process.env.API_PORT ?? 3001);

export default defineConfig({
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    strictPort: true,
    proxy: { '/api': `http://127.0.0.1:${apiPort}` },
  },
  test: {
    include: ['test/**/*.test.ts'],
  },
});
