import { describe, expect, it } from 'vitest';
import { LANDINGS } from '../core/data/landings';
import { samplePage } from '../core/data/sample-models';
import { CATEGORY_SEO } from '../core/data/site';
import { TEMPLATE_CATEGORIES } from '../core/models/template.model';
import { UI_EN } from '../core/i18n/ui.en';
import { UI_HI } from '../core/i18n/ui.hi';
import { UI_MR } from '../core/i18n/ui.mr';
import { TEMPLATES, findTemplate, templatesIn } from './registry';

describe('template catalogue', () => {
  it('has unique, URL-safe ids', () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9]*$/);
  });

  it('has unique names and a valid tier and category on every design', () => {
    expect(new Set(TEMPLATES.map((t) => t.name)).size).toBe(TEMPLATES.length);
    for (const t of TEMPLATES) {
      expect(['free', 'premium']).toContain(t.tier);
      expect(t.categories.length).toBeGreaterThan(0);
      for (const c of t.categories) expect(TEMPLATE_CATEGORIES).toContain(c);
      expect(t.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('offers free and premium designs in every category that should have both kinds of visitor', () => {
    for (const c of TEMPLATE_CATEGORIES) expect(templatesIn(c).length, `category ${c}`).toBeGreaterThan(0);
    expect(TEMPLATES.filter((t) => t.tier === 'free').length).toBeGreaterThanOrEqual(8);
  });

  it('falls back to the default design for unknown ids', () => {
    expect(findTemplate('does-not-exist').id).toBe(findTemplate(null).id);
  });

  it('renders every design with its sample profile', () => {
    for (const t of TEMPLATES) {
      const { model, page } = samplePage(t);
      expect(model.name, t.id).not.toBe('');
      expect(page.main.length + page.side.length, t.id).toBeGreaterThan(0);
      if (t.side?.length) expect(page.side.length, `${t.id} sidebar`).toBeGreaterThan(0);
    }
  });
});

describe('category and landing copy', () => {
  it('has search copy for every category', () => {
    for (const c of TEMPLATE_CATEGORIES) {
      const seo = CATEGORY_SEO[c];
      expect(seo, c).toBeTruthy();
      // Search results cut titles at about 60 characters and descriptions at about 160.
      expect(seo.title.length, `${c} title`).toBeLessThanOrEqual(75);
      expect(seo.description.length, `${c} description`).toBeGreaterThan(70);
      expect(seo.description.length, `${c} description`).toBeLessThanOrEqual(200);
    }
    const titles = TEMPLATE_CATEGORIES.map((c) => CATEGORY_SEO[c].title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('has valid, unique landing pages', () => {
    const slugs = LANDINGS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(LANDINGS.map((l) => l.title)).size).toBe(LANDINGS.length);
    for (const l of LANDINGS) {
      expect(l.slug).toMatch(/^[a-z0-9-]+$/);
      if (l.category) expect(TEMPLATE_CATEGORIES).toContain(l.category);
      expect(l.sections.length, l.slug).toBeGreaterThan(0);
      expect(l.description.length, l.slug).toBeLessThanOrEqual(220);
    }
  });
});

describe('interface text', () => {
  it('has a label for every category and for the new badge in all three languages', () => {
    for (const dict of [UI_EN, UI_HI, UI_MR]) {
      for (const c of TEMPLATE_CATEGORIES) expect(dict['cat.' + c], c).toBeTruthy();
      expect(dict['badge.new']).toBeTruthy();
    }
  });

  it('translates every new home and gallery string into Hindi and Marathi', () => {
    const keys = Object.keys(UI_EN).filter((k) => /^(home\.(comm|trust)\.|gallery\.(promo|prev|next|empty|reset))/.test(k));
    expect(keys.length).toBeGreaterThan(20);
    for (const k of keys) {
      expect(UI_HI[k], `hi ${k}`).toBeTruthy();
      expect(UI_MR[k], `mr ${k}`).toBeTruthy();
    }
  });
});
