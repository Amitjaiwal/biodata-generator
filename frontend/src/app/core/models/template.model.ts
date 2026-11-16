import { Type } from '@angular/core';
import { SectionKey } from './biodata.model';

export type TemplateCategory =
  | 'traditional'
  | 'modern'
  | 'royal'
  | 'gold'
  | 'minimal'
  | 'floral'
  | 'elegant'
  | 'hindu'
  | 'muslim'
  | 'sikh'
  | 'christian'
  | 'jain'
  | 'marathi'
  | 'bride'
  | 'groom';

/** Order used for the category chips in the gallery. */
export const TEMPLATE_CATEGORIES: readonly TemplateCategory[] = [
  'royal',
  'gold',
  'traditional',
  'hindu',
  'marathi',
  'muslim',
  'sikh',
  'christian',
  'jain',
  'modern',
  'minimal',
  'floral',
  'elegant',
  'bride',
  'groom',
];

export type TemplateTier = 'free' | 'premium';

/** Sample profiles used for thumbnails. Each persona is written in its own language. */
export type SamplePersona = 'hindu' | 'marathi' | 'hindi' | 'muslim' | 'jain' | 'sikh' | 'christian' | 'groom';

export interface TemplateDefinition {
  id: string;
  name: string;
  categories: TemplateCategory[];
  tier: TemplateTier;
  /** Dominant colour, used for chips and placeholders. */
  accent: string;
  /** Sections rendered in a sidebar flow instead of the main flow. */
  side?: SectionKey[];
  /** Which sample profile to show in thumbnails. */
  sample: SamplePersona;
  featured?: boolean;
  /** True for designs added in the latest release, shown with a New badge. */
  isNew?: boolean;
  component: Type<unknown>;
}
