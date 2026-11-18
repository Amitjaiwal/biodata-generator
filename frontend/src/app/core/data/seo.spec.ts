import { describe, expect, it } from 'vitest';
import { parseRichText } from '../../shared/rich-text';
import { TEMPLATE_CATEGORIES } from '../models/template.model';
import { UI_EN } from '../i18n/ui.en';
import { UI_HI } from '../i18n/ui.hi';
import { UI_MR } from '../i18n/ui.mr';
import { LANDING_ALIASES, LANDINGS, Landing, findLanding } from './landings';
import { CATEGORY_SEO } from './site';

/** Every address a page link may point at. */
const KNOWN_PATHS = new Set<string>([
  '/',
  '/create',
  '/pricing',
  '/templates',
  ...TEMPLATE_CATEGORIES.map((c) => `/templates/${c}`),
  ...LANDINGS.map((l) => `/${l.slug}`),
]);

const linksIn = (text: string): string[] => parseRichText(text).flatMap((p) => (p.link ? [p.link] : []));

const copyOf = (l: Landing): string[] => [
  l.intro,
  ...l.sections.flatMap((s) => [s.heading, ...(s.body ?? []), ...(s.list ?? []), ...(s.items ?? []).flatMap((i) => [i.title, i.text])]),
];

const words = (parts: string[]): number => parts.join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;

describe('landing pages', () => {
  it('include every page the SEO plan calls for', () => {
    for (const slug of [
      'free-marriage-biodata-maker',
      'online-marriage-biodata-maker',
      'marriage-biodata-format',
      'marriage-biodata-for-bride',
      'marriage-biodata-for-groom',
      'hindu-marriage-biodata',
    ]) {
      expect(findLanding(slug), slug).toBeTruthy();
    }
  });

  it('have unique addresses, titles, descriptions and headings', () => {
    for (const key of ['slug', 'title', 'description', 'h1'] as const) {
      const values = LANDINGS.map((l) => l[key]);
      expect(new Set(values).size, key).toBe(values.length);
    }
  });

  it('keep titles and descriptions inside what search results show', () => {
    for (const l of LANDINGS) {
      expect(l.slug, l.slug).toMatch(/^[a-z0-9-]+$/);
      expect(l.title.length, `${l.slug} title`).toBeLessThanOrEqual(70);
      expect(l.description.length, `${l.slug} description`).toBeGreaterThanOrEqual(70);
      expect(l.description.length, `${l.slug} description`).toBeLessThanOrEqual(175);
      expect(l.title, l.slug).toContain('ShubhPatra');
    }
  });

  it('have real content, not thin pages', () => {
    for (const l of LANDINGS) {
      expect(words(copyOf(l)), `${l.slug} words`).toBeGreaterThanOrEqual(l.lang === 'en' ? 330 : 150);
      expect(l.sections.length, l.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('only link to pages that exist', () => {
    for (const l of LANDINGS) {
      for (const text of copyOf(l)) for (const href of linksIn(text)) expect(KNOWN_PATHS.has(href), `${l.slug} links to ${href}`).toBe(true);
      for (const slug of l.related ?? []) {
        expect(findLanding(slug), `${l.slug} related ${slug}`).toBeTruthy();
        expect(slug, `${l.slug} relates to itself`).not.toBe(l.slug);
      }
    }
  });

  it('link out to other guides from the body, not only from the footer', () => {
    for (const l of LANDINGS.filter((x) => x.lang === 'en')) {
      const links = copyOf(l).flatMap(linksIn);
      expect(links.length, `${l.slug} internal links in the text`).toBeGreaterThanOrEqual(2);
    }
  });

  it('keep renamed addresses working, pointing at the new page', () => {
    for (const a of LANDING_ALIASES) {
      expect(findLanding(a.to), a.slug).toBeTruthy();
      expect(findLanding(a.slug), `${a.slug} must not be a page of its own`).toBeUndefined();
    }
  });
});

describe('template category pages', () => {
  it('have unique copy and an intro with at least one paragraph', () => {
    for (const c of TEMPLATE_CATEGORIES) {
      const seo = CATEGORY_SEO[c];
      expect(seo.about.length, c).toBeGreaterThanOrEqual(1);
      expect(words(seo.about), `${c} words`).toBeGreaterThanOrEqual(40);
      for (const text of seo.about) for (const href of linksIn(text)) expect(KNOWN_PATHS.has(href), `${c} links to ${href}`).toBe(true);
    }
    expect(new Set(TEMPLATE_CATEGORIES.map((c) => CATEGORY_SEO[c].description)).size).toBe(TEMPLATE_CATEGORIES.length);
  });

  it('never share a title with a landing page', () => {
    const landingTitles = new Set(LANDINGS.map((l) => l.title));
    for (const c of TEMPLATE_CATEGORIES) expect(landingTitles.has(CATEGORY_SEO[c].title), c).toBe(false);
  });
});

describe('rich text links', () => {
  it('splits text into plain and linked parts', () => {
    expect(parseRichText('Read the [format guide](/marriage-biodata-format) first.')).toEqual([
      { text: 'Read the ', link: null },
      { text: 'format guide', link: '/marriage-biodata-format' },
      { text: ' first.', link: null },
    ]);
  });

  it('links only site paths, never other sites or scripts', () => {
    for (const bad of ['[x](https://example.com)', '[x](javascript:alert(1))', '[x](//evil.com)', '[x](mailto:a@b.c)']) {
      expect(linksIn(bad), bad).toEqual([]);
    }
  });
});

describe('home page copy', () => {
  const dicts = { en: UI_EN, hi: UI_HI, mr: UI_MR } as const;

  it('has the six steps, the format section and fourteen questions in every language', () => {
    for (const [lang, d] of Object.entries(dicts)) {
      for (let n = 1; n <= 6; n++) {
        expect(d[`home.how.s${n}.t`], `${lang} step ${n}`).toBeTruthy();
        expect(d[`home.how.s${n}.d`], `${lang} step ${n} text`).toBeTruthy();
        expect(d[`home.format.${n}.t`], `${lang} format ${n}`).toBeTruthy();
      }
      for (let n = 1; n <= 14; n++) {
        expect(d[`faq.q${n}`], `${lang} question ${n}`).toBeTruthy();
        expect(d[`faq.a${n}`], `${lang} answer ${n}`).toBeTruthy();
      }
      expect(d['faq.q15'], `${lang} has no stray fifteenth question`).toBeUndefined();
    }
  });

  it('uses the agreed main heading', () => {
    expect(UI_EN['home.hero.title']).toBe('Free Marriage Biodata Maker Online');
    expect(UI_EN['home.how.title']).toBe('How to Create Marriage Biodata Online');
    expect(UI_EN['home.format.title']).toBe('Marriage Biodata Format for Indian Brides and Grooms');
    expect(UI_EN['home.features.title']).toBe('Why Choose ShubhPatra Marriage Biodata Maker?');
  });

  it('asks the questions people search for', () => {
    const questions = Array.from({ length: 14 }, (_, i) => UI_EN[`faq.q${i + 1}`]);
    for (const q of [
      'How can I create marriage biodata online for free?',
      'Which is the best free marriage biodata maker?',
      'Can I download marriage biodata in PDF format?',
      'How do I create marriage biodata for a bride?',
      'How do I create marriage biodata for a groom?',
      'What information should be included in marriage biodata?',
      'Can I edit my marriage biodata after creating it?',
    ]) {
      expect(questions).toContain(q);
    }
  });
});
