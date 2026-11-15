import { Type } from '@angular/core';
import { SectionKey } from './biodata.model';

export type TemplateCategory =
  | 'traditional'
  | 'modern'
  | 'royal'
  | 'minimal'
  | 'floral'
  | 'elegant'
  | 'hindu'
  | 'muslim'
  | 'jain'
  | 'marathi';

export const TEMPLATE_CATEGORIES: readonly TemplateCategory[] = [
  'traditional',
  'modern',
  'royal',
  'minimal',
  'floral',
  'elegant',
  'hindu',
  'muslim',
  'jain',
  'marathi',
];

export type TemplateTier = 'free' | 'premium';

/** Sample profiles used for thumbnails. Each persona is written in its own language. */
export type SamplePersona = 'hindu' | 'marathi' | 'hindi' | 'muslim' | 'jain';

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
  component: Type<unknown>;
}
