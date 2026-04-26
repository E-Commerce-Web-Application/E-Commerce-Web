const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fnv1a32(value: string, seed: number): number {
  let hash = seed >>> 0;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function toHex32(value: number): string {
  return (value >>> 0).toString(16).padStart(8, "0");
}

/**
 * The shop service currently expects owner_id as UUID.
 * Clerk IDs are not UUIDs, so we map them to a deterministic UUID shape.
 */
export function toOwnerId(userId: string): string {
  if (UUID_REGEX.test(userId)) {
    return userId.toLowerCase();
  }

  const p1 = fnv1a32(userId, 0x811c9dc5);
  const p2 = fnv1a32(userId, 0x9e3779b1);
  const p3 = fnv1a32(userId, 0x85ebca6b);
  const p4 = fnv1a32(userId, 0xc2b2ae35);

  let hex = `${toHex32(p1)}${toHex32(p2)}${toHex32(p3)}${toHex32(p4)}`;

  // Mark as UUID v5-style and RFC 4122 variant.
  hex = `${hex.slice(0, 12)}5${hex.slice(13)}`;
  const variant = (parseInt(hex[16], 16) & 0x3) | 0x8;
  hex = `${hex.slice(0, 16)}${variant.toString(16)}${hex.slice(17)}`;

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function matchesOwnerId(shopOwnerId: string, userId?: string | null): boolean {
  if (!userId) {
    return false;
  }

  return shopOwnerId.toLowerCase() === toOwnerId(userId);
}
