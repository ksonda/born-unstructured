/**
 * Resolves the three link schemes authors use in Markdown:
 *
 *   [the blue pacifier](thing:blue-pacifier)   -> link to the thing's page
 *   [walking helps](claim:claim-walking)       -> link to the claim's history
 *   [He fell asleep](obs:observation-01)       -> marks the passage an observation is drawn from
 *
 * and one placement marker:
 *
 *   ::graph::                                  -> on a line of its own: put the post's picture here
 *
 * It works on rendered HTML, so it does not depend on which Markdown
 * processor Astro is configured with.
 */
const GRAPH_LINK = /<a\s+([^>]*?)href="(thing|claim|obs):([a-z0-9-]+)"([^>]*)>([\s\S]*?)<\/a>/g;

const COMMENT = /<!--[\s\S]*?-->/g;

export function resolveGraphLinks(html: string, withBase: (path: string) => string): string {
  // Author notes written as HTML comments stay in the Markdown file and out of the published page.
  return html.replace(COMMENT, '').replace(GRAPH_LINK, (_match, _before, scheme: string, id: string, _after, text: string) => {
    if (scheme === 'obs') return `<span class="passage" id="${id}">${text}</span>`;
    const path = scheme === 'thing' ? `/things/${id}/` : `/claims/${id}/`;
    return `<a class="ref ref-${scheme}" href="${withBase(path)}">${text}</a>`;
  });
}

export const GRAPH_MARKER = /<p>\s*::graph::\s*<\/p>/;

/** True when the Markdown source asks for the post's picture inside the prose. */
export function hasGraphMarker(markdown: string): boolean {
  return /^::graph::\s*$/m.test(markdown);
}

/** Splits rendered prose at the ::graph:: marker, or returns null when there is none. */
export function splitAtGraph(html: string): { before: string; after: string } | null {
  const match = GRAPH_MARKER.exec(html);
  if (!match) return null;
  return { before: html.slice(0, match.index), after: html.slice(match.index + match[0].length) };
}
