import { describe, expect, it } from 'vitest';
import { FIELD_DEFS, OPTION_GROUPS } from '../data/fields';
import { LANGS } from '../models/biodata.model';
import { LABELS, label } from './labels';
import { UI_EN } from './ui.en';
import { UI_HI } from './ui.hi';
import { UI_MR } from './ui.mr';

/** Words that are the same in every language on purpose (names, file formats, units). */
const SAME_EVERYWHERE = /^(ShubhPatra|Razorpay|PDF|UPI|A4|JPG|PNG|WebP|OK|Om|\W*)$/i;

const UI = { en: UI_EN, hi: UI_HI, mr: UI_MR } as const;

describe('interface translations', () => {
  it('has exactly the same keys in English, Hindi and Marathi', () => {
    const en = Object.keys(UI_EN).sort();
    expect(Object.keys(UI_HI).sort()).toEqual(en);
    expect(Object.keys(UI_MR).sort()).toEqual(en);
  });

  it('never leaves a Hindi or Marathi string empty or copied from English', () => {
    for (const lang of ['hi', 'mr'] as const) {
      for (const [key, value] of Object.entries(UI[lang])) {
        expect(value.trim(), `${lang} ${key} is empty`).not.toBe('');
        const english = UI_EN[key];
        if (value === english && !SAME_EVERYWHERE.test(english)) {
          throw new Error(`${lang} "${key}" is still the English text: ${english}`);
        }
      }
    }
  });

  it('keeps the {placeholders} of every string identical across languages', () => {
    const tokens = (s: string) => (s.match(/\{[a-zA-Z0-9]+\}/g) ?? []).sort().join(',');
    for (const [key, english] of Object.entries(UI_EN)) {
      expect(tokens(UI_HI[key]), `hi ${key}`).toBe(tokens(english));
      expect(tokens(UI_MR[key]), `mr ${key}`).toBe(tokens(english));
    }
  });

  it('has a name for every symbol choice in the editor', () => {
    for (const key of ['none', 'om', 'shree', 'kalash', 'lotus', 'diya', 'crescent', 'ikonkar', 'cross', 'jain']) {
      for (const lang of LANGS) expect(UI[lang]['b.sym.' + key], `${lang} b.sym.${key}`).toBeTruthy();
    }
  });
});

describe('field and section labels', () => {
  it('has exactly the same keys in English, Hindi and Marathi', () => {
    const en = Object.keys(LABELS.en).sort();
    expect(Object.keys(LABELS.hi).sort()).toEqual(en);
    expect(Object.keys(LABELS.mr).sort()).toEqual(en);
  });

  it('translates every built-in field and every dropdown option in all three languages', () => {
    for (const lang of LANGS) {
      for (const def of FIELD_DEFS) {
        expect(LABELS[lang]['f.' + def.key], `${lang} f.${def.key}`).toBeTruthy();
      }
      for (const [group, values] of Object.entries(OPTION_GROUPS)) {
        if (group === 'height' || group === 'blood') continue;
        for (const value of values) expect(LABELS[lang][`o.${group}.${value}`], `${lang} o.${group}.${value}`).toBeTruthy();
      }
    }
  });

  it('does not copy English into Hindi or Marathi labels', () => {
    for (const lang of ['hi', 'mr'] as const) {
      for (const [key, value] of Object.entries(LABELS[lang])) {
        const english = LABELS.en[key];
        // Blood groups, abbreviations and similar are legitimately identical.
        if (value === english && /[A-Za-z]{4,}/.test(english)) throw new Error(`${lang} "${key}" is still English: ${english}`);
      }
    }
  });

  it('uses the wording agreed for the section headings', () => {
    expect(label('hi', 'sec.personal')).toBe('व्यक्तिगत जानकारी');
    expect(label('hi', 'sec.birth')).toBe('जन्म एवं कुंडली');
    expect(label('hi', 'sec.education')).toBe('शिक्षा एवं करियर');
    expect(label('hi', 'sec.partner')).toBe('जीवनसाथी से अपेक्षाएं');
    expect(label('mr', 'sec.personal')).toBe('वैयक्तिक माहिती');
    expect(label('mr', 'sec.birth')).toBe('जन्म आणि कुंडली');
    expect(label('mr', 'sec.education')).toBe('शिक्षण आणि करिअर');
    expect(label('mr', 'sec.partner')).toBe('जोडीदाराकडून अपेक्षा');
  });

  it('falls back to English and then to the key for unknown labels', () => {
    expect(label('hi', 'f.doesNotExist')).toBe('f.doesNotExist');
  });
});
