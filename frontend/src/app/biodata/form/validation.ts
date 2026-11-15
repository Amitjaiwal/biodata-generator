const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Lenient: optional +, then 8 to 15 digits with spaces or dashes in between. */
const MOBILE = /^\+?\d(?:[\s-]?\d){7,14}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

export function isValidMobile(value: string): boolean {
  return MOBILE.test(value.trim());
}

/**
 * Returns the i18n key of the problem with a built-in field, or null when it is fine.
 * Only the name is required; other fields are checked only when filled in.
 */
export function fieldError(key: string | null, value: string, showRequired: boolean): string | null {
  const v = value.trim();
  if (key === 'fullName') return showRequired && !v ? 'b.err.name' : null;
  if (!v) return null;
  if (key === 'email' && !isValidEmail(v)) return 'b.err.email';
  if (key === 'mobile' && !isValidMobile(v)) return 'b.err.mobile';
  return null;
}
