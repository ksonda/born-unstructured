// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Every identifier in the published graph is minted under this URL, so set
// SITE_URL to the real address before the first public deploy and never
// change it afterwards. See README: "Stable identifiers".
const site = process.env.SITE_URL ?? 'https://born-unstructured.example';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [svelte()],
  redirects: {
    '/claims': '/beliefs/',
  },
  vite: {
    worker: { format: 'es' },
  },
});
