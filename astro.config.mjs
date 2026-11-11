// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// The public address of the site. Every identifier in the published graph is
// minted under it, so do not change it once the site is live. See README:
// "Stable identifiers". SITE_URL overrides it, for previews and experiments.
const address = new URL(process.env.SITE_URL ?? 'https://ksonda.github.io/born-unstructured');

// The path the site is served under: "/born-unstructured" on GitHub Pages, "" on a domain of its own.
const base = address.pathname.replace(/\/+$/, '');

export default defineConfig({
  site: address.origin,
  base: base || '/',
  trailingSlash: 'always',
  integrations: [svelte()],
  redirects: {
    // Redirect targets are not prefixed with the base path automatically.
    '/claims': `${base}/beliefs/`,
  },
  vite: {
    worker: { format: 'es' },
  },
});
