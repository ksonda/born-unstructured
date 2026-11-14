export const SITE = {
  title: 'Born Unstructured',
  description:
    'A blog about one household and its newborn, compiled into a real knowledge graph. Every theory is on file. So is every retraction.',
  /** The entity the explorer opens on when no focus is given. */
  defaultFocus: 'baby',
  /**
   * Google Analytics 4 measurement ID (looks like "G-XXXXXXXXXX"). Leave empty to load no
   * analytics at all. The tag is only added to production builds, never to `npm run dev`.
   * The ID is public by design: it appears in every page's HTML.
   */
  googleAnalyticsId: 'G-2GM7KJF8JE',
  /** The people whose retractions get their own question on the Ask page. */
  household: ['dad', 'mom'],
  /**
   * Standing questions on the Ask page that gather everything recorded about a set of things.
   * A saga is only offered once at least one of its entities has appeared in a post.
   */
  sagas: [
    {
      id: 'muppies',
      title: 'The muppy registry, in full',
      entities: ['muppy', 'messy-muppy', 'flat-muppy', 'big-muppy', 'messy-new'],
    },
  ],
};
