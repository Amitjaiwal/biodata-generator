export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PHOTO_MAX_BYTES = 8 * 1024 * 1024;

/** Returns an i18n key describing why a file is not acceptable, or null when it is fine. */
export function validatePhotoFile(file: File): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return 'b.photo.badType';
  if (file.size > PHOTO_MAX_BYTES) return 'b.photo.tooBig';
  return null;
}
