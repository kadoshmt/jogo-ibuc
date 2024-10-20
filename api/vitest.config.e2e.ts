import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import path from 'path';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: [path.resolve(__dirname, 'test', 'setup-e2e.ts')],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'src', 'shared'),
      '@test': path.resolve(__dirname, 'test'),
    },
  },
  plugins: [swc.vite()],
});
