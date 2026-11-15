import { FIELD_DEF_BY_KEY } from '../../core/data/fields';
import { LABELS, label } from '../../core/i18n/labels';
import { Biodata, BiodataField, FamilyMember, Lang } from '../../core/models/biodata.model';
import { RenderBlock, RenderModel, RenderRow } from '../../core/models/render.model';
import { formatAge, formatDate, formatHeight, formatTime, initialsOf } from './format';

const LONG_VALUE = 56;

/** Converts a stored value to the text printed on the biodata. */
export function displayValue(field: BiodataField, lang: Lang): string {
  const value = field.value.trim();
  if (!value || !field.key) return value;
  const def = FIELD_DEF_BY_KEY.get(field.key);
  if (!def) return value;
  if (def.options === 'height') return formatHeight(value, lang);
  if (def.type === 'select' && def.options) {
    const key = `o.${def.options}.${value}`;
    return LABELS[lang][key] ?? LABELS.en[key] ?? value;
  }
  if (def.type === 'date') return formatDate(value, lang);
  if (def.type === 'time') return formatTime(value);
  if (field.key === 'age') return formatAge(value, lang);
  return value;
}

function memberRow(m: FamilyMember, lang: Lang): RenderRow | null {
  const name = m.name.trim();
  const details = m.details.trim();
  if (!name && !details) return null;
  const rel = m.relation === 'other' ? m.relationLabel.trim() || label(lang, 'rel.other') : label(lang, 'rel.' + m.relation);
  const value = name && details ? `${name} (${details})` : name || details;
  return { id: m.id, label: rel, value, long: value.length > LONG_VALUE };
}

/**
 * Builds the template-agnostic render model: visible sections only, empty fields removed,
 * labels localized to the biodata language, values formatted. User text is never translated.
 */
export function buildRenderModel(b: Biodata): RenderModel {
  const lang = b.language;
  let name = '';
  let occupation = '';
  let workLocation = '';
  const blocks: RenderBlock[] = [];

  for (const section of b.sections) {
    const rows: RenderRow[] = [];
    for (const f of section.fields) {
      if (f.key === 'fullName') {
        name = f.value.trim();
        continue;
      }
      if (f.key === 'occupation') occupation = f.value.trim();
      if (f.key === 'workLocation') workLocation = f.value.trim();

      const value = displayValue(f, lang);
      if (value) {
        const text = f.key ? label(lang, 'f.' + f.key) : f.label.trim();
        const def = f.key ? FIELD_DEF_BY_KEY.get(f.key) : undefined;
        rows.push({
          id: f.id,
          label: text,
          value,
          long: def?.type === 'textarea' || value.length > LONG_VALUE,
        });
      }
      if (section.key === 'family' && f.key === 'sisters') {
        for (const m of b.members) {
          const row = memberRow(m, lang);
          if (row) rows.push(row);
        }
      }
    }
    if (section.key === 'family' && !section.fields.some((f) => f.key === 'sisters')) {
      for (const m of b.members) {
        const row = memberRow(m, lang);
        if (row) rows.push(row);
      }
    }
    if (section.hidden || !rows.length) continue;
    blocks.push({
      id: section.id,
      key: section.key,
      title: section.title.trim() || label(lang, 'sec.' + section.key),
      rows,
      continued: false,
    });
  }

  return {
    lang,
    title: b.title.trim() || label(lang, 'doc.title'),
    blessing: b.blessing.trim(),
    symbol: b.symbol,
    name: name || label(lang, 'doc.namePlaceholder'),
    initials: initialsOf(name) || '♥',
    tagline: [occupation, workLocation].filter(Boolean).join(' · '),
    photo: b.photo,
    blocks,
  };
}
