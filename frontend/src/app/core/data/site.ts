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
  /** Short unique copy shown under the designs. Internal links are written as [anchor text](/path). */
  about: string[];
}

/**
 * Search-friendly copy for each template category page. Titles say "Templates" and describe the
 * designs; the landing pages (see landings.ts) cover the format and how-to questions, so the two
 * never compete for the same search.
 */
export const CATEGORY_SEO: Record<TemplateCategory, CategorySeo> = {
  traditional: {
    h1: 'Traditional Marriage Biodata Templates',
    title: 'Traditional Marriage Biodata Templates | ShubhPatra',
    description:
      'Classic Indian marriage biodata templates with ornate borders and auspicious symbols. Fill in your details and download a print-ready A4 PDF.',
    about: [
      'Traditional marriage biodata templates use the visual language many families grew up with: ornate borders, mandala and toran motifs, a blessing at the top and a warm, formal layout. They suit a biodata that will be printed, shared with elders or sent to a family priest.',
      'Every traditional design works with the same form, so you can compare several with your own details. Looking for something specific? See the [Hindu](/templates/hindu), [Marathi](/templates/marathi) or [Jain](/templates/jain) collections.',
    ],
  },
  modern: {
    h1: 'Modern Marriage Biodata Templates',
    title: 'Modern Marriage Biodata Templates | ShubhPatra',
    description:
      'Clean, contemporary marriage biodata designs with sidebars, cards and bold headings. Create yours online and download an A4 PDF.',
    about: [
      'Modern marriage biodata templates trade ornament for clarity: clean sidebars, card layouts, bold headings and plenty of space. They work especially well when the biodata will be read on a phone or shared as a PDF.',
      'If you prefer a gentler look, see the [modern bride](/templates/bride) templates, and for a bolder look the [modern groom](/templates/groom) templates.',
    ],
  },
  royal: {
    h1: 'Royal Marriage Biodata Templates',
    title: 'Royal Marriage Biodata Templates | ShubhPatra',
    description:
      'Regal marriage biodata designs in maroon, navy and gold with mandalas and palace arches. Preview with your details before you download.',
    about: [
      'Royal marriage biodata templates use deep maroon, navy and gold, with mandalas, arches and fine borders. They give a biodata a formal, celebratory feel.',
      'Several royal designs are premium and can be previewed with your own details first. The [premium gold](/templates/gold) collection shows the richest look.',
    ],
  },
  gold: {
    h1: 'Premium Gold Marriage Biodata Templates',
    title: 'Premium Gold Marriage Biodata Templates | ShubhPatra',
    description:
      'Luxury marriage biodata templates with gold-foil frames, rich colours and refined type. Preview with your own details and download an A4 PDF.',
    about: [
      'The premium gold collection uses gold foil frames, deep colours and refined typography for a luxurious biodata. Each design is drawn from scratch, so the corners, borders and photo frames print sharply on A4.',
      'You can preview any premium design with your own details before deciding, and pay once only if you want the watermark-free download. Prefer something simpler? Start with the [free marriage biodata maker](/free-marriage-biodata-maker).',
    ],
  },
  minimal: {
    h1: 'Minimal Marriage Biodata Templates',
    title: 'Minimal Marriage Biodata Templates | ShubhPatra',
    description:
      'Simple marriage biodata templates with plenty of white space and elegant type. Easy to read on a phone and easy to print.',
    about: [
      'Minimal marriage biodata templates keep the page calm: generous white space, one or two fonts and thin dividers. The focus stays on the information, which makes them a good choice for a quiet, professional look.',
      'They are easy to read on a phone and print well in black and white. Also see the [elegant](/templates/elegant) collection.',
    ],
  },
  floral: {
    h1: 'Floral Marriage Biodata Templates',
    title: 'Floral Marriage Biodata Templates | ShubhPatra',
    description:
      'Soft floral marriage biodata designs with hand-drawn flowers, vines, lotus and marigold motifs. Make yours in minutes.',
    about: [
      'Floral marriage biodata templates use hand-drawn flowers, vines, lotus and marigold motifs for a soft, welcoming look. They are popular for a bride’s biodata and for families who like a gentle design.',
      'They suit any community, because the details you enter stay the same. See also the [modern bride](/templates/bride) templates.',
    ],
  },
  elegant: {
    h1: 'Elegant Marriage Biodata Templates',
    title: 'Elegant Marriage Biodata Templates | ShubhPatra',
    description:
      'Refined marriage biodata layouts with serif typography and fine gold or sage details. Download a high-quality A4 PDF.',
    about: [
      'Elegant marriage biodata templates use refined serif typography, fine gold or sage details and balanced spacing. They look polished without being heavily decorated.',
      'They suit biodatas that mix career and family details, because the layout stays calm even when there is a lot to say. See also the [minimal](/templates/minimal) collection.',
    ],
  },
  hindu: {
    h1: 'Hindu Marriage Biodata Templates',
    title: 'Hindu Marriage Biodata Templates | ShubhPatra',
    description:
      'Hindu marriage biodata templates with a Ganesh blessing, Om and kalash symbols and horoscope fields. Create and download a PDF online.',
    about: [
      'Hindu marriage biodata templates include a Ganesh blessing, auspicious symbols such as Om, Shree and the kalash, and room for horoscope details: birth time and place, rashi, nakshatra, gotra and manglik status.',
      'Read the [Hindu marriage biodata format](/hindu-marriage-biodata) guide for what to include, or see the [traditional](/templates/traditional) and [royal](/templates/royal) collections for more styles.',
    ],
  },
  muslim: {
    h1: 'Muslim Marriage Biodata Templates',
    title: 'Muslim Marriage Biodata Templates | ShubhPatra',
    description:
      'Muslim marriage biodata (nikah biodata) templates with a Bismillah heading, crescent symbol and geometric patterns. Create yours online.',
    about: [
      'Muslim marriage biodata templates, often used for nikah, open with a Bismillah heading and use crescent symbols and geometric patterns in teal, emerald and gold. Horoscope fields can be hidden, and you can add your own fields for sect and family background.',
      'The [Muslim marriage biodata](/muslim-marriage-biodata) guide explains the format in more detail.',
    ],
  },
  sikh: {
    h1: 'Sikh Marriage Biodata Templates',
    title: 'Sikh Marriage Biodata Templates | ShubhPatra',
    description:
      'Sikh marriage biodata (anand karaj) templates with the Ik Onkar heading and saffron and blue colours. Fill in your details and download a PDF.',
    about: [
      'Sikh marriage biodata templates open with Ik Onkar and use saffron and deep blue with a checked border. They leave space for details families often mention, such as the community or zaat, as custom fields.',
      'See the [Sikh marriage biodata](/sikh-marriage-biodata) guide for the format.',
    ],
  },
  christian: {
    h1: 'Christian Marriage Biodata Templates',
    title: 'Christian Marriage Biodata Templates | ShubhPatra',
    description:
      'Christian marriage biodata templates with a cross symbol, soft colours and clean layouts. Create a biodata online and download the PDF.',
    about: [
      'Christian marriage biodata templates use a cross symbol, soft blues, sage greens and olive-branch borders for a calm, gentle look. The horoscope section can be hidden, and denomination or parish can be added as custom fields.',
      'See the [Christian marriage biodata](/christian-marriage-biodata) guide for what to include.',
    ],
  },
  jain: {
    h1: 'Jain Marriage Biodata Templates',
    title: 'Jain Marriage Biodata Templates | ShubhPatra',
    description:
      'Jain marriage biodata templates with a Jai Jinendra heading and the Jain emblem. Fill in your details and download a PDF.',
    about: [
      'Jain marriage biodata templates open with Jai Jinendra and the Jain emblem in saffron and gold. The lifestyle section includes a Jain diet option, and you can add the sect, sub-sect and gotra.',
      'See the [Jain marriage biodata](/jain-marriage-biodata) guide for the format.',
    ],
  },
  marathi: {
    h1: 'Marathi Marriage Biodata Templates',
    title: 'Marathi Marriage Biodata Templates | ShubhPatra',
    description:
      'Marathi lagna biodata templates with toran, paithani borders and Marathi headings. Make a biodata in Marathi and download the PDF.',
    about: [
      'Marathi marriage biodata templates use paithani borders, toran and peacock motifs, with Marathi headings and fonts. Choose Marathi as the biodata language and every heading and label changes, while your own text stays as you typed it.',
      'The [Marathi biodata maker](/marathi-biodata-maker) page is written in Marathi, and the [Hindu marriage biodata format](/hindu-marriage-biodata) guide covers horoscope fields.',
    ],
  },
  bride: {
    h1: 'Modern Bride Marriage Biodata Templates',
    title: 'Modern Bride Marriage Biodata Templates | ShubhPatra',
    description:
      'Modern marriage biodata templates for brides with soft colours and card layouts. Add your photo and details and download a print-ready PDF.',
    about: [
      'Modern bride biodata templates use soft colours, round photo frames and card layouts for a friendly, polished look. They show personal, family and interest details clearly, and leave room for a few lines about hobbies and what the family is looking for.',
      'Read the [marriage biodata for bride](/marriage-biodata-for-bride) guide for what to include.',
    ],
  },
  groom: {
    h1: 'Modern Groom Marriage Biodata Templates',
    title: 'Modern Groom Marriage Biodata Templates | ShubhPatra',
    description:
      'Modern marriage biodata templates for grooms with bold headings and a clear layout. Add your education, career and family details and download a PDF.',
    about: [
      'Modern groom biodata templates use bold headings, a clear layout and sharp photo frames, with a strong focus on education and career details. Numbered sections and compact rows keep a long list of details easy to scan.',
      'Read the [marriage biodata for groom](/marriage-biodata-for-groom) guide for what to include.',
    ],
  },
};
