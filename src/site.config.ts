export const SITE = {
  title: 'Born Unstructured',
  description:
    'A serial about one household and its newborn, compiled into a real knowledge graph. Every theory is on file. So is every retraction.',
  /** The entity the explorer opens on when no focus is given. */
  defaultFocus: 'baby',
  /** The people whose retractions get their own question on the Ask page. */
  household: ['dad', 'mom'],
  /**
   * Standing questions on the Ask page that gather everything recorded about a set of things.
   * A saga is only offered once at least one of its entities has appeared in an episode.
   */
  sagas: [
    {
      id: 'muppies',
      title: 'The muppy registry, in full',
      entities: ['muppy', 'messy-muppy', 'flat-muppy', 'big-muppy', 'messy-new'],
    },
  ],
};
