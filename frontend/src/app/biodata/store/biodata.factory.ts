import { DEFAULT_SECTIONS, FIELD_DEFS } from '../../core/data/fields';
import {
  Biodata,
  BiodataField,
  BiodataSection,
  FamilyMember,
  LANGS,
  Lang,
  SYMBOL_KEYS,
  SectionKey,
} from '../../core/models/biodata.model';

let counter = 0;

/** Short unique id for fields, sections and members. */
export function uid(prefix = 'x'): string {
  counter = (counter + 1) % 1_000_000;
  return `${prefix}${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function builtInSection(key: Exclude<SectionKey, 'custom'>): BiodataSection {
  return {
    id: key,
    key,
    title: '',
    hidden: false,
    fields: FIELD_DEFS.filter((d) => d.section === key).map((d) => ({ id: d.key, key: d.key, label: '', value: '' })),
  };
}

export function createEmptyBiodata(language: Lang = 'en'): Biodata {
  return {
    version: 1,
    language,
    blessing: '॥ श्री गणेशाय नमः ॥',
    symbol: 'om',
    title: '',
    photo: null,
    sections: DEFAULT_SECTIONS.map(builtInSection),
    members: [],
  };
}

const str = (v: unknown, max = 400): string => (typeof v === 'string' ? v.slice(0, max) : '');

/**
 * Repairs data loaded from storage: drops unknown shapes, restores missing built-in
 * sections and fields, and keeps the user's ordering. Never throws.
 */
export function normalizeBiodata(raw: unknown): Biodata {
  const base = createEmptyBiodata();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Biodata>;

  const language: Lang = LANGS.includes(r.language as Lang) ? (r.language as Lang) : 'en';
  const sections: BiodataSection[] = [];
  const seen = new Set<string>();

  for (const s of Array.isArray(r.sections) ? r.sections : []) {
    if (!s || typeof s !== 'object' || typeof s.key !== 'string') continue;
    const isBuiltIn = (DEFAULT_SECTIONS as readonly string[]).includes(s.key);
    if (!isBuiltIn && s.key !== 'custom') continue;
    const id = isBuiltIn ? s.key : str(s.id, 40) || uid('s');
    if (seen.has(id)) continue;
    seen.add(id);

    const fields: BiodataField[] = [];
    const fieldIds = new Set<string>();
    for (const f of Array.isArray(s.fields) ? s.fields : []) {
      if (!f || typeof f !== 'object') continue;
      const known = typeof f.key === 'string' && FIELD_DEFS.some((d) => d.key === f.key && d.section === s.key);
      const fid = known ? (f.key as string) : str(f.id, 40) || uid('f');
      if (fieldIds.has(fid)) continue;
      fieldIds.add(fid);
      fields.push({ id: fid, key: known ? (f.key as string) : null, label: known ? '' : str(f.label, 60), value: str(f.value) });
    }
    if (isBuiltIn) {
      // A built-in field added in a later release is put right after the field that precedes it in
      // the catalogue, so older saved biodatas get it in the same place as new ones.
      const defs = FIELD_DEFS.filter((d) => d.section === s.key);
      defs.forEach((d, i) => {
        if (fieldIds.has(d.key)) return;
        const added: BiodataField = { id: d.key, key: d.key, label: '', value: '' };
        const before = defs.slice(0, i).reverse().find((p) => fieldIds.has(p.key));
        const at = before ? fields.findIndex((x) => x.id === before.key) : -1;
        if (at >= 0) fields.splice(at + 1, 0, added);
        else fields.push(added);
        fieldIds.add(d.key);
      });
    }
    sections.push({ id, key: s.key as SectionKey, title: str(s.title, 60), hidden: !!s.hidden, fields });
  }
  for (const key of DEFAULT_SECTIONS) {
    if (!seen.has(key)) sections.push(builtInSection(key));
  }

  const members: FamilyMember[] = [];
  for (const m of Array.isArray(r.members) ? r.members : []) {
    if (!m || typeof m !== 'object') continue;
    const relation = m.relation === 'sister' || m.relation === 'other' ? m.relation : 'brother';
    members.push({
      id: str(m.id, 40) || uid('m'),
      relation,
      relationLabel: str(m.relationLabel, 40),
      name: str(m.name, 80),
      details: str(m.details, 120),
    });
  }

  const photo = typeof r.photo === 'string' && /^data:image\/(jpeg|png|webp|svg\+xml)[;,]/.test(r.photo) ? r.photo : null;

  return {
    version: 1,
    language,
    blessing: typeof r.blessing === 'string' ? str(r.blessing, 120) : base.blessing,
    symbol: SYMBOL_KEYS.includes(r.symbol as never) ? r.symbol! : base.symbol,
    title: str(r.title, 60),
    photo,
    sections,
    members,
  };
}
