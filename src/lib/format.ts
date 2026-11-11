const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const TYPE_LABELS: Record<string, { one: string; many: string }> = {
  person: { one: 'Person', many: 'People' },
  object: { one: 'Object', many: 'Objects' },
  role: { one: 'Role', many: 'Roles' },
  routine: { one: 'Routine', many: 'Routines' },
  concept: { one: 'Concept', many: 'Concepts' },
  place: { one: 'Place', many: 'Places' },
};
