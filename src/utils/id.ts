// Generates a unique ID for each new record.
// Example output: "lxk4fh2-a7bcd3"
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
