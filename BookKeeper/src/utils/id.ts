/**
 * Lightweight, dependency-free unique id generator.
 * Good enough for a local, single-device MVP (no collision-sensitive
 * distributed sync yet).
 */
export function generateId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${time}${random}`;
}
