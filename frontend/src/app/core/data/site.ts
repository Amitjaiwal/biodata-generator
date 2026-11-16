import { TemplateCategory } from '../models/template.model';

/** Support address shown on the legal and contact pages. */
export const SUPPORT_EMAIL = 'marriagesbiodatamaker@gmail.com';

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
  gold: {
    h1: 'Premium Gold Marriage Biodata Templates',
    title: 'Premium Gold Marriage Biodata Templates | ShubhPatra',
    description:
      'Luxury marriage biodata designs with gold-foil frames, rich colours and refined typography. Preview with your own details and download a print-ready A4 PDF.',
  },
  sikh: {
    h1: 'Sikh Marriage Biodata Templates',
    title: 'Sikh Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Sikh marriage biodata (anand karaj) formats with the Ik Onkar heading and saffron and blue colours. Fill your details and download a PDF online.',
  },
  christian: {
    h1: 'Christian Marriage Biodata Templates',
    title: 'Christian Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Christian marriage biodata formats with a cross symbol, soft colours and clean layouts. Create a matrimonial biodata online and download the PDF.',
  },
  bride: {
    h1: 'Modern Bride Biodata Templates',
    title: 'Biodata Format for Girl: Modern Bride Biodata Templates | ShubhPatra',
    description:
      'Modern marriage biodata designs for girls with soft colours and card layouts. Add your photo, family and career details and download a print-ready PDF.',
  },
  groom: {
    h1: 'Modern Groom Biodata Templates',
    title: 'Biodata Format for Boy: Modern Groom Biodata Templates | ShubhPatra',
    description:
      'Modern marriage biodata designs for boys with bold headings and a clear layout. Add your photo, education, family and career details and download a PDF.',
  },
};
