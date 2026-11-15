import { label } from '../../core/i18n/labels';
import { Lang } from '../../core/models/biodata.model';

/** "5-6" becomes 5' 6" (168 cm), localized. Unknown input is returned unchanged. */
export function formatHeight(code: string, lang: Lang): string {
  const m = /^(\d)-(\d{1,2})$/.exec(code);
  if (!m) return code;
  const ft = Number(m[1]);
  const inch = Number(m[2]);
  const cm = Math.round((ft * 12 + inch) * 2.54);
  if (lang === 'en') return `${ft}' ${inch}" (${cm} cm)`;
  return `${ft} ${label(lang, 'unit.ft')} ${inch} ${label(lang, 'unit.in')} (${cm} ${label(lang, 'unit.cm')})`;
}

/** ISO date (yyyy-mm-dd) becomes "14 March 1998" in the biodata language. */
export function formatDate(iso: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return iso;
  return `${Number(m[3])} ${label(lang, 'month.' + month)} ${m[1]}`;
}

/** "18:05" becomes "6:05 PM". */
export function formatTime(value: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!m) return value;
  const h = Number(m[1]);
  if (h > 23) return value;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${suffix}`;
}

/** A bare number becomes "27 years"; anything else is kept as typed. */
export function formatAge(value: string, lang: Lang): string {
  return /^\d{1,3}$/.test(value.trim()) ? `${value.trim()} ${label(lang, 'unit.years')}` : value;
}

/** Completed years between an ISO date of birth and `today`. Returns null when invalid. */
export function calcAge(iso: string, today: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  let age = today.getFullYear() - y;
  const beforeBirthday = today.getMonth() + 1 < mo || (today.getMonth() + 1 === mo && today.getDate() < d);
  if (beforeBirthday) age--;
  return age >= 0 && age < 120 ? age : null;
}

/** Up to two initials, safe for Devanagari and other complex scripts. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = (w: string): string => {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      for (const s of seg.segment(w)) return s.segment;
    }
    return Array.from(w)[0] ?? '';
  };
  const picked = words.length === 1 ? [words[0]] : [words[0], words[words.length - 1]];
  return picked.map(first).join('').toUpperCase();
}
