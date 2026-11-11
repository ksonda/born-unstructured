import type { StanceId } from './schema.ts';

export type Polarity = 'support' | 'doubt' | 'open' | 'retract';

export interface Stance {
  id: StanceId;
  /** RDF local name under the vocabulary namespace. */
  term: string;
  /** As recorded in a position table: "Requests a larger sample". */
  label: string;
  /** Mid-sentence form: "Dad tentatively endorses ...". */
  verb: string;
  polarity: Polarity;
  description: string;
}

export const STANCES: Stance[] = [
  {
    id: 'tentative',
    term: 'Tentative',
    label: 'Tentatively endorses',
    verb: 'tentatively endorses',
    polarity: 'support',
    description: 'Believes it, on the strength of very little.',
  },
  {
    id: 'endorses',
    term: 'Endorses',
    label: 'Endorses',
    verb: 'endorses',
    polarity: 'support',
    description: 'Believes it.',
  },
  {
    id: 'strongly-endorses',
    term: 'StronglyEndorses',
    label: 'Strongly endorses',
    verb: 'strongly endorses',
    polarity: 'support',
    description: 'Believes it and has started telling other parents.',
  },
  {
    id: 'qualifies',
    term: 'Qualifies',
    label: 'Endorses, with qualifications',
    verb: 'endorses with qualifications',
    polarity: 'support',
    description: 'Still believes it, in a narrower form than before.',
  },
  {
    id: 'questions',
    term: 'Questions',
    label: 'Requests a larger sample',
    verb: 'requests a larger sample for',
    polarity: 'doubt',
    description: 'Not persuaded by the evidence so far.',
  },
  {
    id: 'disputes',
    term: 'Disputes',
    label: 'Disputes',
    verb: 'disputes',
    polarity: 'doubt',
    description: 'Believes it is wrong.',
  },
  {
    id: 'undecided',
    term: 'Undecided',
    label: 'Has not decided',
    verb: 'has not decided about',
    polarity: 'open',
    description: 'Has thought about it and is not prepared to say. The question stays open.',
  },
  {
    id: 'withdraws',
    term: 'Withdraws',
    label: 'Withdraws',
    verb: 'withdraws',
    polarity: 'retract',
    description: 'Used to believe it. The earlier record stands.',
  },
];

const byId = new Map(STANCES.map((s) => [s.id, s]));

export function stance(id: StanceId): Stance {
  return byId.get(id)!;
}

export type ClaimStatus = 'held' | 'disputed' | 'withdrawn' | 'unassessed';

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  held: 'Currently held',
  disputed: 'Disputed',
  withdrawn: 'Previously held',
  unassessed: 'Open question',
};
