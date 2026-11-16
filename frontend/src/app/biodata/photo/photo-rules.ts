export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const PHOTO_MAX_BYTES = 8 * 1024 * 1024;

/** Value for the file input's `accept` attribute: types for most pickers, extensions for the rest. */
export const PHOTO_ACCEPT = [...PHOTO_TYPES, ...PHOTO_EXTENSIONS.map((e) => '.' + e)].join(',');

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase();
}

/**
 * Some systems report no MIME type for a perfectly good image (Windows often does for .webp, and
 * some Android file managers do for .jpg). When the type is missing or generic, trust the extension.
 */
function isAcceptedImage(file: File): boolean {
  if (PHOTO_TYPES.includes(file.type)) return true;
  const unknown = file.type === '' || file.type === 'application/octet-stream';
  return unknown && PHOTO_EXTENSIONS.includes(extensionOf(file.name));
}

const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Gives a file that passed validation a proper image MIME type, so the cropper can load it even when
 * the system reported none. A file that already has a valid type is returned unchanged.
 */
export function normalizePhotoFile(file: File): File {
  if (PHOTO_TYPES.includes(file.type)) return file;
  const type = TYPE_BY_EXTENSION[extensionOf(file.name)];
  return type ? new File([file], file.name, { type, lastModified: file.lastModified }) : file;
}

/** Returns an i18n key describing why a file is not acceptable, or null when it is fine. */
export function validatePhotoFile(file: File): string | null {
  if (!isAcceptedImage(file)) return 'b.photo.badType';
  if (file.size > PHOTO_MAX_BYTES) return 'b.photo.tooBig';
  if (file.size === 0) return 'b.photo.failed';
  return null;
}
