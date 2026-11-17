import { describe, expect, it } from 'vitest';
import { FIELD_DEF_BY_KEY, FIELD_DEFS } from '../core/data/fields';
import { sampleBiodata } from '../core/data/samples';
import { UI_EN } from '../core/i18n/ui.en';
import { UI_HI } from '../core/i18n/ui.hi';
import { UI_MR } from '../core/i18n/ui.mr';
import { label } from '../core/i18n/labels';
import { Biodata } from '../core/models/biodata.model';
import { createEmptyBiodata, normalizeBiodata } from './store/biodata.factory';
import { buildRenderModel } from './render/render-model';

const KEY = 'relativesSurnames';
const LIST = 'Deshmukh, Patil, Jadhav, Pawar, Shinde, Chavan';

const family = (b: Biodata) => b.sections.find((s) => s.key === 'family')!;
const setSurnames = (b: Biodata, value: string): Biodata => {
  family(b).fields.find((f) => f.key === KEY)!.value = value;
  return b;
};
const familyRows = (b: Biodata) => buildRenderModel(b).blocks.find((x) => x.key === 'family')?.rows ?? [];

describe("Relatives' Surnames field", () => {
  it('is an optional multi-line field in Family Details', () => {
    const def = FIELD_DEF_BY_KEY.get(KEY)!;
    expect(def.section).toBe('family');
    expect(def.type).toBe('textarea');
    expect(def.required).toBeFalsy();
    expect(def.wide).toBe(true);
    expect(def.placeholder).toBe(true);
    expect(def.hint).toBe(true);
    expect(FIELD_DEFS.filter((d) => d.key === KEY)).toHaveLength(1);
  });

  it('is present, empty, and placed after Native Place in a new biodata', () => {
    const keys = family(createEmptyBiodata()).fields.map((f) => f.key);
    expect(keys).toContain(KEY);
    expect(keys.indexOf(KEY)).toBe(keys.indexOf('nativePlace') + 1);
    expect(family(createEmptyBiodata()).fields.find((f) => f.key === KEY)!.value).toBe('');
  });

  it('prints the label and the surnames in the family block, in every language', () => {
    const b = setSurnames(createEmptyBiodata('en'), LIST);
    for (const [lang, text] of [
      ['en', "Relatives' Surnames"],
      ['hi', 'रिश्तेदारों के उपनाम'],
      ['mr', 'नातेवाईकांची आडनावे'],
    ] as const) {
      const row = familyRows({ ...b, language: lang }).find((r) => r.label === text);
      expect(row, lang).toBeTruthy();
      // The typed text is never translated.
      expect(row!.value, lang).toBe(LIST);
      expect(row!.long, lang).toBe(true);
    }
  });

  it('hides the label and the row when the field is empty or only spaces', () => {
    for (const value of ['', '   ', '\n\n']) {
      const b = setSurnames(createEmptyBiodata('en'), value);
      family(b).fields.find((f) => f.key === 'nativePlace')!.value = 'Pune';
      const labels = familyRows(b).map((r) => r.label);
      expect(labels).not.toContain("Relatives' Surnames");
      expect(labels).toEqual(['Native Place']);
    }
  });

  it('keeps line breaks typed by the user', () => {
    const b = setSurnames(createEmptyBiodata('en'), 'Deshmukh, Patil\nJadhav, Pawar');
    expect(familyRows(b).find((r) => r.label === "Relatives' Surnames")!.value).toBe('Deshmukh, Patil\nJadhav, Pawar');
  });

  it('keeps the value when the language is switched', () => {
    const b = setSurnames(createEmptyBiodata('en'), LIST);
    const switched: Biodata = { ...b, language: 'mr' };
    expect(family(switched).fields.find((f) => f.key === KEY)!.value).toBe(LIST);
  });

  it('survives saving and loading', () => {
    const b = setSurnames(createEmptyBiodata('hi'), LIST);
    const restored = normalizeBiodata(JSON.parse(JSON.stringify(b)));
    expect(family(restored).fields.find((f) => f.key === KEY)!.value).toBe(LIST);
  });

  it('is part of the sample profiles', () => {
    for (const persona of ['hindu', 'marathi', 'hindi', 'muslim', 'jain', 'sikh', 'christian', 'groom'] as const) {
      const value = family(sampleBiodata(persona)).fields.find((f) => f.key === KEY)!.value;
      expect(value, persona).not.toBe('');
    }
  });
});

describe('biodata saved before the field existed', () => {
  /** A saved biodata as an older version wrote it: no relativesSurnames, plus a custom field. */
  const legacy = () => {
    const b = createEmptyBiodata('en');
    const f = family(b);
    f.fields = f.fields.filter((x) => x.key !== KEY);
    f.fields.find((x) => x.key === 'fatherName')!.value = 'Shri Rajesh';
    f.fields.find((x) => x.key === 'familyAddress')!.value = 'Baner, Pune';
    f.fields.push({ id: 'custom1', key: null, label: 'Maternal uncle', value: 'Shri Anil' });
    return JSON.parse(JSON.stringify(b)) as Biodata;
  };

  it('opens without errors and gains an empty field in the right place', () => {
    const restored = normalizeBiodata(legacy());
    const keys = family(restored).fields.map((f) => f.key);
    expect(keys).toContain(KEY);
    expect(keys.indexOf(KEY)).toBe(keys.indexOf('nativePlace') + 1);
    expect(family(restored).fields.find((f) => f.key === KEY)!.value).toBe('');
  });

  it('keeps every existing value, custom field and the field order', () => {
    const before = legacy();
    const restored = normalizeBiodata(before);
    const f = family(restored).fields;
    expect(f.find((x) => x.key === 'fatherName')!.value).toBe('Shri Rajesh');
    expect(f.find((x) => x.key === 'familyAddress')!.value).toBe('Baner, Pune');
    expect(f.find((x) => x.id === 'custom1')).toMatchObject({ key: null, label: 'Maternal uncle', value: 'Shri Anil' });
    // Order of everything that was already there is unchanged.
    const old = family(before).fields.map((x) => x.id);
    expect(f.map((x) => x.id).filter((id) => old.includes(id))).toEqual(old);
    // And the preview is unchanged until the user fills the new field in.
    expect(familyRows(restored).map((r) => r.label)).toEqual(['Father\'s Name', 'Family Address', 'Maternal uncle']);
  });

  it('copes with a damaged value for the new field', () => {
    const bad = legacy();
    family(bad).fields.push({ id: KEY, key: KEY, label: '', value: 42 as unknown as string });
    expect(family(normalizeBiodata(bad)).fields.find((f) => f.key === KEY)!.value).toBe('');
  });
});

describe('translations for the field', () => {
  it('has the agreed labels', () => {
    expect(label('en', 'f.relativesSurnames')).toBe("Relatives' Surnames");
    expect(label('hi', 'f.relativesSurnames')).toBe('रिश्तेदारों के उपनाम');
    expect(label('mr', 'f.relativesSurnames')).toBe('नातेवाईकांची आडनावे');
  });

  it('has a placeholder and helper text in every language', () => {
    for (const dict of [UI_EN, UI_HI, UI_MR]) {
      expect(dict['ph.relativesSurnames']).toBeTruthy();
      expect(dict['b.hint.relativesSurnames']).toBeTruthy();
    }
    expect(UI_EN['ph.relativesSurnames']).toBe("Enter relatives' surnames separated by commas.");
  });

  it('has strings for every field that asks for a placeholder or helper text', () => {
    for (const def of FIELD_DEFS) {
      for (const dict of [UI_EN, UI_HI, UI_MR]) {
        if (def.placeholder) expect(dict['ph.' + def.key], def.key).toBeTruthy();
        if (def.hint) expect(dict['b.hint.' + def.key], def.key).toBeTruthy();
      }
    }
  });
});
