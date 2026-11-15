import { TemplateCategory } from '../models/template.model';

/** Contact address shown on legal pages. Replace with your own before going live. */
export const SUPPORT_EMAIL = 'support@shubhpatra.in';

/** Sections used on the legal pages. */
export const LEGAL_UPDATED = '15 November 2026';

export interface CategorySeo {
  /** Page heading. */
  h1: string;
  title: string;
  description: string;
}

/** Search-friendly copy for each template category page. */
export const CATEGORY_SEO: Record<TemplateCategory, CategorySeo> = {
  traditional: {
    h1: 'Traditional Marriage Biodata Templates',
    title: 'Traditional Marriage Biodata Templates | ShubhPatra',
    description:
      'Classic Indian marriage biodata formats with ornate borders and auspicious symbols. Fill your details and download a print-ready PDF.',
  },
  modern: {
    h1: 'Modern Marriage Biodata Templates',
    title: 'Modern Marriage Biodata Templates | ShubhPatra',
    description:
      'Clean, contemporary marriage biodata designs with sidebars and card layouts. Create yours online and download an A4 PDF.',
  },
  royal: {
    h1: 'Royal Marriage Biodata Templates',
    title: 'Royal Marriage Biodata Templates | ShubhPatra',
    description:
      'Regal marriage biodata designs in maroon, navy and gold with mandalas and palace arches. Preview with your details before you download.',
  },
  minimal: {
    h1: 'Minimal Marriage Biodata Templates',
    title: 'Simple and Minimal Marriage Biodata Format | ShubhPatra',
    description:
      'Simple marriage biodata formats with plenty of white space and elegant type. Easy to read, easy to print.',
  },
  floral: {
    h1: 'Floral Marriage Biodata Templates',
    title: 'Floral Marriage Biodata Templates | ShubhPatra',
    description:
      'Soft floral marriage biodata designs with hand-drawn flowers, vines and lotus motifs. Make yours in minutes.',
  },
  elegant: {
    h1: 'Elegant Marriage Biodata Templates',
    title: 'Elegant Marriage Biodata Templates | ShubhPatra',
    description:
      'Refined, editorial marriage biodata layouts with serif typography and fine gold details. Download a high-quality PDF.',
  },
  hindu: {
    h1: 'Hindu Marriage Biodata Templates',
    title: 'Hindu Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Hindu marriage biodata formats with Ganesha blessing, Om, kalash, rashi, nakshatra and gotra fields. Create and download a PDF online.',
  },
  muslim: {
    h1: 'Muslim Marriage Biodata Templates',
    title: 'Muslim Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Muslim marriage biodata (nikah biodata) formats with Bismillah heading, crescent symbol and geometric patterns. Create yours online.',
  },
  jain: {
    h1: 'Jain Marriage Biodata Templates',
    title: 'Jain Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Jain marriage biodata formats with Jai Jinendra heading and the Jain emblem. Fill your details and download a PDF.',
  },
  marathi: {
    h1: 'Marathi Marriage Biodata Templates',
    title: 'Marathi Marriage Biodata Format and Maker | ShubhPatra',
    description:
      'Marathi lagna biodata formats with toran, paithani borders and Marathi headings. Make a biodata in Marathi and download the PDF.',
  },
};
