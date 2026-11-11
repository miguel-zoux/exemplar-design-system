import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` serves the preview page (index.html). `npm run build` builds it
// into dist/ as a check; blocks import the package's source, not dist/.
export default defineConfig({
  plugins: [react()],
});
