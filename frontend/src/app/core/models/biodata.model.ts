/** Languages supported for both the site UI and the biodata labels. */
export type Lang = 'en' | 'hi' | 'mr';
export const LANGS: readonly Lang[] = ['en', 'hi', 'mr'];

export type SectionKey =
  | 'personal'
  | 'birth'
  | 'education'
  | 'family'
  | 'lifestyle'
  | 'partner'
  | 'contact'
  | 'custom';

export type SymbolKey =
  | 'none'
  | 'om'
  | 'shree'
  | 'kalash'
  | 'lotus'
  | 'diya'
  | 'crescent'
  | 'ikonkar'
  | 'cross'
  | 'jain';

export const SYMBOL_KEYS: readonly SymbolKey[] = [
  'none',
  'om',
  'shree',
  'kalash',
  'lotus',
  'diya',
  'crescent',
  'ikonkar',
  'cross',
  'jain',
];

export interface BiodataField {
  id: string;
  /** Key of a built-in field (see FIELD_DEFS) or null for a custom field. */
  key: string | null;
  /** Label typed by the user. Only used for custom fields. */
  label: string;
  value: string;
}

export interface BiodataSection {
  id: string;
  key: SectionKey;
  /** Custom title. Empty string means "use the localized default". */
  title: string;
  hidden: boolean;
  fields: BiodataField[];
}

export type MemberRelation = 'brother' | 'sister' | 'other';

export interface FamilyMember {
  id: string;
  relation: MemberRelation;
  /** Used when relation is "other", for example "Uncle". */
  relationLabel: string;
  name: string;
  details: string;
}

export interface Biodata {
  version: 1;
  /** Language of the labels printed on the biodata. */
  language: Lang;
  blessing: string;
  symbol: SymbolKey;
  /** Document heading. Empty string means the localized default. */
  title: string;
  /** Cropped photo as a JPEG data URL, kept only in this browser. */
  photo: string | null;
  sections: BiodataSection[];
  members: FamilyMember[];
}

export interface BuilderSettings {
  templateId: string;
  /** Multiplier applied to template font sizes. */
  fontScale: number;
  fitOnePage: boolean;
}

export type FieldType = 'text' | 'select' | 'date' | 'time' | 'textarea' | 'tel' | 'email' | 'number';

export interface FieldDef {
  key: string;
  section: SectionKey;
  type: FieldType;
  /** Option group for selects (see OPTION_GROUPS). */
  options?: string;
  /** Suggestion list key for free text with autocomplete. */
  suggest?: string;
  required?: boolean;
  /** Takes the full row width in the form and in grid layouts. */
  wide?: boolean;
  maxLength?: number;
}
