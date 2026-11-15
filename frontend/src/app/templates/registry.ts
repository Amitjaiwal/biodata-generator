import { TemplateCategory, TemplateDefinition } from '../core/models/template.model';
import { AhimsaTemplate } from './designs/ahimsa';
import { GulabTemplate } from './designs/gulab';
import { IvoryTemplate } from './designs/ivory';
import { KamalTemplate } from './designs/kamal';
import { KesariTemplate } from './designs/kesari';
import { MaharajaTemplate } from './designs/maharaja';
import { MangalTemplate } from './designs/mangal';
import { MayurTemplate } from './designs/mayur';
import { MehfilTemplate } from './designs/mehfil';
import { MetroTemplate } from './designs/metro';
import { MonogramTemplate } from './designs/monogram';
import { NilaTemplate } from './designs/nila';
import { NoorTemplate } from './designs/noor';
import { PaithaniTemplate } from './designs/paithani';
import { RajwadaTemplate } from './designs/rajwada';
import { SageTemplate } from './designs/sage';
import { SamyakTemplate } from './designs/samyak';
import { SaralTemplate } from './designs/saral';
import { TulsiTemplate } from './designs/tulsi';
import { VivahTemplate } from './designs/vivah';

/**
 * The template catalogue. Adding a design means adding one component and one entry here;
 * the form, the data model and the preview engine do not change.
 */
export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: 'mangal',
    name: 'Mangal Classic',
    categories: ['traditional', 'hindu'],
    tier: 'free',
    accent: '#7A1F2B',
    sample: 'hindu',
    featured: true,
    component: MangalTemplate,
  },
  {
    id: 'maharaja',
    name: 'Maharaja',
    categories: ['royal', 'hindu'],
    tier: 'premium',
    accent: '#5B0F1B',
    side: ['family', 'partner', 'contact'],
    sample: 'hindu',
    featured: true,
    component: MaharajaTemplate,
  },
  {
    id: 'nila',
    name: 'Nila Modern',
    categories: ['modern'],
    tier: 'free',
    accent: '#14213D',
    side: ['lifestyle', 'contact'],
    sample: 'hindu',
    featured: true,
    component: NilaTemplate,
  },
  {
    id: 'paithani',
    name: 'Paithani',
    categories: ['marathi', 'traditional'],
    tier: 'premium',
    accent: '#5B2A86',
    sample: 'marathi',
    featured: true,
    component: PaithaniTemplate,
  },
  {
    id: 'gulab',
    name: 'Gulab Floral',
    categories: ['floral', 'elegant'],
    tier: 'free',
    accent: '#B5536C',
    sample: 'hindu',
    featured: true,
    component: GulabTemplate,
  },
  {
    id: 'rajwada',
    name: 'Rajwada',
    categories: ['royal', 'elegant'],
    tier: 'premium',
    accent: '#0F1B2D',
    sample: 'hindu',
    featured: true,
    component: RajwadaTemplate,
  },
  {
    id: 'kesari',
    name: 'Kesari Marathi',
    categories: ['marathi', 'traditional', 'hindu'],
    tier: 'free',
    accent: '#E36414',
    sample: 'marathi',
    featured: true,
    component: KesariTemplate,
  },
  {
    id: 'mehfil',
    name: 'Mehfil',
    categories: ['muslim', 'royal'],
    tier: 'premium',
    accent: '#0F4C5C',
    side: ['family', 'contact'],
    sample: 'muslim',
    featured: true,
    component: MehfilTemplate,
  },
  {
    id: 'saral',
    name: 'Saral Minimal',
    categories: ['minimal', 'modern'],
    tier: 'free',
    accent: '#1A1A1A',
    sample: 'hindu',
    component: SaralTemplate,
  },
  {
    id: 'kamal',
    name: 'Kamal Mandala',
    categories: ['hindu', 'floral'],
    tier: 'premium',
    accent: '#B83B5E',
    sample: 'hindi',
    component: KamalTemplate,
  },
  {
    id: 'noor',
    name: 'Noor',
    categories: ['muslim', 'traditional'],
    tier: 'free',
    accent: '#0B5D4B',
    sample: 'muslim',
    component: NoorTemplate,
  },
  {
    id: 'monogram',
    name: 'Monogram',
    categories: ['elegant', 'minimal'],
    tier: 'premium',
    accent: '#161616',
    sample: 'hindu',
    component: MonogramTemplate,
  },
  {
    id: 'ahimsa',
    name: 'Ahimsa',
    categories: ['jain', 'traditional'],
    tier: 'free',
    accent: '#C2620A',
    sample: 'jain',
    component: AhimsaTemplate,
  },
  {
    id: 'metro',
    name: 'Metro',
    categories: ['modern'],
    tier: 'premium',
    accent: '#3D348B',
    side: ['birth', 'lifestyle', 'contact'],
    sample: 'hindu',
    component: MetroTemplate,
  },
  {
    id: 'sage',
    name: 'Sage Elegant',
    categories: ['elegant', 'minimal'],
    tier: 'free',
    accent: '#5F7161',
    side: ['contact'],
    sample: 'hindu',
    component: SageTemplate,
  },
  {
    id: 'tulsi',
    name: 'Tulsi Vine',
    categories: ['floral', 'modern'],
    tier: 'premium',
    accent: '#2F6B3F',
    sample: 'hindu',
    component: TulsiTemplate,
  },
  {
    id: 'vivah',
    name: 'Shubh Vivah',
    categories: ['hindu', 'traditional'],
    tier: 'premium',
    accent: '#B5121B',
    side: ['birth'],
    sample: 'hindi',
    component: VivahTemplate,
  },
  {
    id: 'ivory',
    name: 'Ivory',
    categories: ['minimal', 'elegant'],
    tier: 'premium',
    accent: '#A98B4F',
    sample: 'hindu',
    component: IvoryTemplate,
  },
  {
    id: 'mayur',
    name: 'Mayur',
    categories: ['traditional', 'marathi', 'hindu'],
    tier: 'premium',
    accent: '#0B6E6E',
    sample: 'marathi',
    component: MayurTemplate,
  },
  {
    id: 'samyak',
    name: 'Samyak',
    categories: ['jain', 'elegant'],
    tier: 'premium',
    accent: '#A67C1A',
    side: ['birth', 'contact'],
    sample: 'jain',
    component: SamyakTemplate,
  },
];

export const DEFAULT_TEMPLATE_ID = 'mangal';

const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

export function findTemplate(id: string | null | undefined): TemplateDefinition {
  return (id && BY_ID.get(id)) || BY_ID.get(DEFAULT_TEMPLATE_ID)!;
}

export function isTemplateId(id: string | null | undefined): id is string {
  return !!id && BY_ID.has(id);
}

export function templatesIn(category: TemplateCategory | 'all'): TemplateDefinition[] {
  return category === 'all' ? [...TEMPLATES] : TEMPLATES.filter((t) => t.categories.includes(category));
}
