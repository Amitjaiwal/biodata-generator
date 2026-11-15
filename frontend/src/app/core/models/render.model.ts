import { Lang, SectionKey, SymbolKey } from './biodata.model';

export interface RenderRow {
  id: string;
  label: string;
  value: string;
  /** Long values span the full width in multi-column layouts. */
  long: boolean;
}

export interface RenderBlock {
  id: string;
  key: SectionKey;
  title: string;
  rows: RenderRow[];
  /** True for the second part of a section that was split across pages. */
  continued: boolean;
}

/** Everything a template needs, already localized and formatted. */
export interface RenderModel {
  lang: Lang;
  title: string;
  blessing: string;
  symbol: SymbolKey;
  name: string;
  initials: string;
  tagline: string;
  photo: string | null;
  blocks: RenderBlock[];
}

export interface PageModel {
  index: number;
  total: number;
  first: boolean;
  main: RenderBlock[];
  side: RenderBlock[];
}
