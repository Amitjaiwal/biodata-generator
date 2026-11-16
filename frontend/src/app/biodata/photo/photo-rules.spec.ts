import { describe, expect, it } from 'vitest';
import { PHOTO_ACCEPT, PHOTO_MAX_BYTES, normalizePhotoFile, validatePhotoFile } from './photo-rules';

const file = (name: string, type: string, size = 1000) => new File([new Uint8Array(size)], name, { type });

describe('photo rules', () => {
  it('accepts JPG, JPEG, PNG and WebP', () => {
    expect(validatePhotoFile(file('a.jpg', 'image/jpeg'))).toBeNull();
    expect(validatePhotoFile(file('a.jpeg', 'image/jpeg'))).toBeNull();
    expect(validatePhotoFile(file('a.png', 'image/png'))).toBeNull();
    expect(validatePhotoFile(file('a.webp', 'image/webp'))).toBeNull();
  });

  it('accepts a good image whose system reported no MIME type, using the extension', () => {
    expect(validatePhotoFile(file('photo.webp', ''))).toBeNull();
    expect(validatePhotoFile(file('PHOTO.JPG', ''))).toBeNull();
    expect(validatePhotoFile(file('pic.jpeg', 'application/octet-stream'))).toBeNull();
  });

  it('rejects other file types, including ones that only look like images', () => {
    expect(validatePhotoFile(file('a.gif', 'image/gif'))).toBe('b.photo.badType');
    expect(validatePhotoFile(file('a.pdf', 'application/pdf'))).toBe('b.photo.badType');
    expect(validatePhotoFile(file('notes.txt', ''))).toBe('b.photo.badType');
    expect(validatePhotoFile(file('noextension', ''))).toBe('b.photo.badType');
    expect(validatePhotoFile(file('a.jpg', 'text/plain'))).toBe('b.photo.badType');
  });

  it('rejects files that are too large or empty', () => {
    expect(validatePhotoFile(file('big.jpg', 'image/jpeg', PHOTO_MAX_BYTES + 1))).toBe('b.photo.tooBig');
    expect(validatePhotoFile(file('empty.jpg', 'image/jpeg', 0))).toBe('b.photo.failed');
  });

  it('gives an accepted file without a type a proper image type for the cropper', () => {
    expect(normalizePhotoFile(file('a.webp', '')).type).toBe('image/webp');
    expect(normalizePhotoFile(file('a.JPG', 'application/octet-stream')).type).toBe('image/jpeg');
    const already = file('a.png', 'image/png');
    expect(normalizePhotoFile(already)).toBe(already);
  });

  it('lists both MIME types and extensions for the file picker', () => {
    for (const part of ['image/jpeg', 'image/png', 'image/webp', '.jpg', '.jpeg', '.png', '.webp']) {
      expect(PHOTO_ACCEPT.split(',')).toContain(part);
    }
  });
});
