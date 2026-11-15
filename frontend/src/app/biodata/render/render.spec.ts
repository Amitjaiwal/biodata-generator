import { sampleBiodata } from '../../core/data/samples';
import { RenderBlock } from '../../core/models/render.model';
import { fieldError, isValidEmail, isValidMobile } from '../form/validation';
import { createEmptyBiodata, normalizeBiodata } from '../store/biodata.factory';
import { calcAge, formatAge, formatDate, formatHeight, formatTime, initialsOf } from './format';
import { BlockMetric, paginateFlow, splitFlows, toPageModels } from './paginate';
import { buildRenderModel } from './render-model';

describe('format', () => {
  it('formats height in each language', () => {
    expect(formatHeight('5-6', 'en')).toBe('5\' 6" (168 cm)');
    expect(formatHeight('5-6', 'mr')).toBe('5 फूट 6 इंच (168 सेमी)');
    expect(formatHeight('tall', 'en')).toBe('tall');
  });

  it('formats dates with localized month names and leaves bad input alone', () => {
    expect(formatDate('1998-03-14', 'en')).toBe('14 March 1998');
    expect(formatDate('1998-03-14', 'hi')).toBe('14 मार्च 1998');
    expect(formatDate('1996-08-21', 'mr')).toBe('21 ऑगस्ट 1996');
    expect(formatDate('14/03/1998', 'en')).toBe('14/03/1998');
  });

  it('formats time and age', () => {
    expect(formatTime('06:45')).toBe('6:45 AM');
    expect(formatTime('18:05')).toBe('6:05 PM');
    expect(formatTime('00:10')).toBe('12:10 AM');
    expect(formatAge('27', 'en')).toBe('27 years');
    expect(formatAge('27', 'mr')).toBe('27 वर्षे');
    expect(formatAge('27 yrs', 'en')).toBe('27 yrs');
  });

  it('calculates completed years', () => {
    const today = new Date(2026, 10, 15);
    expect(calcAge('1998-03-14', today)).toBe(28);
    expect(calcAge('1998-11-16', today)).toBe(27);
    expect(calcAge('1998-11-15', today)).toBe(28);
    expect(calcAge('2030-01-01', today)).toBeNull();
    expect(calcAge('', today)).toBeNull();
  });

  it('takes initials from Latin and Devanagari names', () => {
    expect(initialsOf('Ananya Sharma')).toBe('AS');
    expect(initialsOf('ananya')).toBe('A');
    expect(initialsOf('ओंकार विजय देशमुख')).toBe('ओंदे');
    expect(initialsOf('  ')).toBe('');
  });
});

describe('buildRenderModel', () => {
  it('drops empty fields and empty sections and shows a name placeholder', () => {
    const model = buildRenderModel(createEmptyBiodata('en'));
    expect(model.blocks).toEqual([]);
    expect(model.name).toBe('Your Name');
    expect(model.title).toBe('Biodata');
  });

  it('localizes labels and option values but never the typed text', () => {
    const b = createEmptyBiodata('en');
    const personal = b.sections.find((s) => s.id === 'personal')!;
    personal.fields.find((f) => f.key === 'fullName')!.value = 'Ananya Sharma';
    personal.fields.find((f) => f.key === 'gender')!.value = 'female';
    personal.fields.find((f) => f.key === 'religion')!.value = 'Hindu';

    const en = buildRenderModel(b);
    expect(en.name).toBe('Ananya Sharma');
    expect(en.blocks[0].rows.map((r) => [r.label, r.value])).toEqual([
      ['Gender', 'Female'],
      ['Religion', 'Hindu'],
    ]);

    const mr = buildRenderModel({ ...b, language: 'mr' });
    expect(mr.blocks[0].title).toBe('वैयक्तिक माहिती');
    expect(mr.blocks[0].rows.map((r) => [r.label, r.value])).toEqual([
      ['लिंग', 'स्त्री'],
      ['धर्म', 'Hindu'],
    ]);
    expect(mr.name).toBe('Ananya Sharma');
  });

  it('keeps the name out of the rows, hides hidden sections and adds family members and custom fields', () => {
    const b = sampleBiodata('marathi');
    b.sections.find((s) => s.id === 'contact')!.hidden = true;
    const model = buildRenderModel(b);

    expect(model.blocks.some((x) => x.key === 'contact')).toBe(false);
    expect(model.blocks.flatMap((x) => x.rows).some((r) => r.value === model.name)).toBe(false);
    const family = model.blocks.find((x) => x.key === 'family')!;
    expect(family.rows.some((r) => r.label === 'बहीण' && r.value.includes('प्रिया'))).toBe(true);
    expect(family.rows.some((r) => r.label === 'मामा')).toBe(true);
  });
});

describe('normalizeBiodata', () => {
  it('returns a clean document for junk input', () => {
    for (const junk of [null, 42, 'x', [], { sections: 'no' }]) {
      const b = normalizeBiodata(junk);
      expect(b.sections.map((s) => s.id)).toEqual(createEmptyBiodata().sections.map((s) => s.id));
    }
  });

  it('keeps values and order, restores missing built-in fields and rejects unsafe photos', () => {
    const saved = sampleBiodata('hindu');
    saved.sections.reverse();
    saved.sections[0].fields = saved.sections[0].fields.slice(0, 1);
    const raw = JSON.parse(JSON.stringify({ ...saved, photo: 'javascript:alert(1)', language: 'xx' }));

    const b = normalizeBiodata(raw);
    expect(b.language).toBe('en');
    expect(b.photo).toBeNull();
    expect(b.sections[0].id).toBe('contact');
    expect(b.sections[0].fields.map((f) => f.key)).toEqual(['mobile', 'email', 'address']);
    expect(b.sections.find((s) => s.id === 'personal')!.fields.find((f) => f.key === 'fullName')!.value).toBe('Ananya Sharma');
  });
});

describe('pagination', () => {
  const block = (id: string, rows: number): RenderBlock => ({
    id,
    key: 'custom',
    title: id,
    continued: false,
    rows: Array.from({ length: rows }, (_, i) => ({ id: `${id}-${i}`, label: 'L', value: 'V', long: false })),
  });
  /** 30px title area, 20px per row, 10px gap after the block. */
  const metric = (rows: number): BlockMetric => ({
    height: 30 + rows * 20,
    gap: 10,
    head: 30,
    rowBottoms: Array.from({ length: rows }, (_, i) => 30 + (i + 1) * 20),
  });

  it('keeps everything on one page when it fits', () => {
    const pages = paginateFlow([block('a', 3), block('b', 3)], { a: metric(3), b: metric(3) }, 400, 500);
    expect(pages.map((p) => p.map((x) => x.id))).toEqual([['a', 'b']]);
  });

  it('moves a block that cannot be split usefully to the next page', () => {
    const pages = paginateFlow([block('a', 5), block('b', 3)], { a: metric(5), b: metric(3) }, 180, 500);
    expect(pages.map((p) => p.map((x) => x.id))).toEqual([['a'], ['b']]);
  });

  it('splits a long block between rows without losing or repeating any row', () => {
    const blocks = [block('a', 2), block('b', 12)];
    const pages = paginateFlow(blocks, { a: metric(2), b: metric(12) }, 240, 500);

    expect(pages.length).toBe(2);
    const parts = pages.flat().filter((x) => x.id.startsWith('b'));
    expect(parts.length).toBe(2);
    expect(parts[1].continued).toBe(true);
    expect(parts.flatMap((x) => x.rows.map((r) => r.id))).toEqual(blocks[1].rows.map((r) => r.id));
    expect(parts.every((x) => x.rows.length >= 2)).toBe(true);
  });

  it('spreads a very long block over as many pages as needed', () => {
    const pages = paginateFlow([block('a', 60)], { a: metric(60) }, 300, 300);
    expect(pages.length).toBeGreaterThan(4);
    expect(pages.flat().reduce((n, x) => n + x.rows.length, 0)).toBe(60);
  });

  it('routes sidebar sections to the side flow and pairs pages up', () => {
    const blocks: RenderBlock[] = [
      { ...block('p', 1), key: 'personal' },
      { ...block('c', 1), key: 'contact' },
    ];
    const flows = splitFlows(blocks, ['contact']);
    expect(flows.main.map((x) => x.id)).toEqual(['p']);
    expect(flows.side.map((x) => x.id)).toEqual(['c']);

    const pages = toPageModels([flows.main, [block('q', 1)]], [flows.side]);
    expect(pages.length).toBe(2);
    expect(pages[0].first).toBe(true);
    expect(pages[1].side).toEqual([]);
    expect(pages[1].total).toBe(2);
  });
});

describe('validation', () => {
  it('validates email and mobile leniently', () => {
    expect(isValidEmail('sharma.family@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidMobile('+91 98765 43210')).toBe(true);
    expect(isValidMobile('9876543210')).toBe(true);
    expect(isValidMobile('12345')).toBe(false);
    expect(isValidMobile('call me')).toBe(false);
  });

  it('requires only the name, and only once asked to', () => {
    expect(fieldError('fullName', '', false)).toBeNull();
    expect(fieldError('fullName', ' ', true)).toBe('b.err.name');
    expect(fieldError('email', '', true)).toBeNull();
    expect(fieldError('email', 'x@', true)).toBe('b.err.email');
    expect(fieldError('mobile', 'abc', true)).toBe('b.err.mobile');
    expect(fieldError('caste', 'anything', true)).toBeNull();
  });
});
