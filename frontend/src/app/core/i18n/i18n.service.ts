import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { LANGS, Lang } from '../models/biodata.model';
import { StorageService } from '../services/storage.service';
import { label } from './labels';
import { UI_EN } from './ui.en';
import { UI_HI } from './ui.hi';
import { UI_MR } from './ui.mr';

const UI: Record<Lang, Record<string, string>> = { en: UI_EN, hi: UI_HI, mr: UI_MR };
const KEY = 'sp.uiLang';

export const LANG_NAMES: Record<Lang, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

/**
 * Site language. Templates read `t()` inside bindings, so switching the signal re-renders
 * every visible string. Biodata label language is separate and lives in the biodata itself.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>('en');
  private userChose = false;

  /** Translates a UI key, replacing `{name}` placeholders. */
  readonly t = (key: string, params?: Record<string, string | number>): string => {
    let text = UI[this.lang()][key] ?? UI_EN[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) text = text.replaceAll(`{${k}}`, String(v));
    }
    return text;
  };

  /** Field, section and option labels in the current site language. */
  readonly fieldLabel = (key: string): string => label(this.lang(), key);

  /** Applies the visitor's saved language. Call after hydration to avoid a mismatch. */
  restore(): void {
    const saved = this.storage.get<Lang>(KEY);
    if (saved && LANGS.includes(saved)) {
      this.userChose = true;
      this.apply(saved);
    }
  }

  /** Explicit choice from the language switcher. */
  setLang(lang: Lang): void {
    this.userChose = true;
    this.storage.set(KEY, lang);
    this.apply(lang);
  }

  /** Language suggested by a page (for example the Marathi landing page). User choice wins. */
  suggest(lang: Lang): void {
    if (!this.userChose) this.apply(lang);
  }

  private apply(lang: Lang): void {
    this.lang.set(lang);
    this.document.documentElement.lang = lang;
  }
}
