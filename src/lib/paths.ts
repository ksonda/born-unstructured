/** Prefixes a root-relative path with the site's base path, so the site also works from a subdirectory. */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  return `${base}${path}`;
}
