// ============================================================
// DATE HELPERS
// Small functions that make working with dates easier.
// ============================================================

// Returns the current time as an ISO string (e.g. "2025-01-15T10:30:00.000Z")
export function nowISO(): string {
  return new Date().toISOString();
}

// Turns an ISO string into a readable date like "Jan 15, 2025"
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Sorts a list with newest items first
// The <T extends { dateCreated: string }> part means:
// "T can be any type, as long as it has a dateCreated field"
export function sortByNewest<T extends { dateCreated: string }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );
}
