import { Injectable, computed, inject, signal } from '@angular/core';
import { PERSONA_FOR_LANG, sampleBiodata } from '../../core/data/samples';
import {
  Biodata,
  BiodataField,
  BiodataSection,
  BuilderSettings,
  FamilyMember,
  Lang,
  SymbolKey,
} from '../../core/models/biodata.model';
import { StorageService } from '../../core/services/storage.service';
import { DEFAULT_TEMPLATE_ID, isTemplateId } from '../../templates/registry';
import { calcAge } from '../render/format';
import { buildRenderModel } from '../render/render-model';
import { createEmptyBiodata, normalizeBiodata, uid } from './biodata.factory';

const DATA_KEY = 'sp.biodata.v1';
const SETTINGS_KEY = 'sp.builder.v1';
const SAVE_DELAY_MS = 400;

export const FONT_SCALES = { s: 0.92, m: 1, l: 1.08 } as const;

const DEFAULT_SETTINGS: BuilderSettings = { templateId: DEFAULT_TEMPLATE_ID, fontScale: FONT_SCALES.m, fitOnePage: true };

/**
 * Single source of truth for the biodata being edited. The form writes here, the preview
 * reads the derived render model, and everything is saved to this browser only.
 */
@Injectable({ providedIn: 'root' })
export class BiodataStore {
  private readonly storage = inject(StorageService);

  readonly biodata = signal<Biodata>(createEmptyBiodata());
  readonly settings = signal<BuilderSettings>(DEFAULT_SETTINGS);
  readonly renderModel = computed(() => buildRenderModel(this.biodata()));
  readonly name = computed(() => this.fieldValue('personal', 'fullName').trim());
  /** False when the last save failed (for example, storage full). */
  readonly saveOk = signal(true);

  private hydrated = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  /** Loads saved work. Call once in the browser; safe to call again. */
  hydrate(): void {
    if (this.hydrated) return;
    this.hydrated = true;
    const data = this.storage.get<unknown>(DATA_KEY);
    if (data) this.biodata.set(normalizeBiodata(data));
    const s = this.storage.get<Partial<BuilderSettings>>(SETTINGS_KEY);
    if (s && typeof s === 'object') {
      this.settings.set({
        templateId: isTemplateId(s.templateId) ? s.templateId : DEFAULT_TEMPLATE_ID,
        fontScale: typeof s.fontScale === 'number' && s.fontScale >= 0.8 && s.fontScale <= 1.2 ? s.fontScale : 1,
        fitOnePage: typeof s.fitOnePage === 'boolean' ? s.fitOnePage : true,
      });
    }
  }

  fieldValue(sectionId: string, fieldId: string): string {
    return this.biodata().sections.find((s) => s.id === sectionId)?.fields.find((f) => f.id === fieldId)?.value ?? '';
  }

  // Settings ----------------------------------------------------------------

  setTemplate(templateId: string): void {
    if (!isTemplateId(templateId)) return;
    this.settings.update((s) => ({ ...s, templateId }));
    this.saveSettings();
  }

  setFontScale(fontScale: number): void {
    this.settings.update((s) => ({ ...s, fontScale }));
    this.saveSettings();
  }

  setFitOnePage(fitOnePage: boolean): void {
    this.settings.update((s) => ({ ...s, fitOnePage }));
    this.saveSettings();
  }

  // Document-level fields ---------------------------------------------------

  setLanguage(language: Lang): void {
    this.patch({ language });
  }

  setBlessing(blessing: string): void {
    this.patch({ blessing });
  }

  setSymbol(symbol: SymbolKey): void {
    this.patch({ symbol });
  }

  setTitle(title: string): void {
    this.patch({ title });
  }

  setPhoto(photo: string | null): void {
    this.patch({ photo });
  }

  // Fields ------------------------------------------------------------------

  setField(sectionId: string, fieldId: string, value: string): void {
    const before = this.biodata();
    let next = this.mapField(before, sectionId, fieldId, (f) => ({ ...f, value }));

    // Keep the age in step with the date of birth unless the user typed their own.
    if (sectionId === 'personal' && fieldId === 'dob') {
      const oldAuto = calcAge(this.fieldValue('personal', 'dob'));
      const currentAge = this.fieldValue('personal', 'age').trim();
      const newAge = calcAge(value);
      if (currentAge === '' || (oldAuto !== null && currentAge === String(oldAuto))) {
        next = this.mapField(next, 'personal', 'age', (f) => ({ ...f, value: newAge === null ? '' : String(newAge) }));
      }
    }
    this.commit(next);
  }

  setFieldLabel(sectionId: string, fieldId: string, label: string): void {
    this.commit(this.mapField(this.biodata(), sectionId, fieldId, (f) => (f.key ? f : { ...f, label })));
  }

  addCustomField(sectionId: string): string {
    const id = uid('f');
    this.mapSection(sectionId, (s) => ({ ...s, fields: [...s.fields, { id, key: null, label: '', value: '' }] }));
    return id;
  }

  removeField(sectionId: string, fieldId: string): void {
    this.mapSection(sectionId, (s) => ({ ...s, fields: s.fields.filter((f) => f.id !== fieldId || f.key !== null) }));
  }

  // Sections ----------------------------------------------------------------

  setSectionHidden(sectionId: string, hidden: boolean): void {
    this.mapSection(sectionId, (s) => ({ ...s, hidden }));
  }

  setSectionTitle(sectionId: string, title: string): void {
    this.mapSection(sectionId, (s) => ({ ...s, title }));
  }

  moveSection(sectionId: string, direction: -1 | 1): void {
    const sections = [...this.biodata().sections];
    const from = sections.findIndex((s) => s.id === sectionId);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= sections.length) return;
    [sections[from], sections[to]] = [sections[to], sections[from]];
    this.patch({ sections });
  }

  addCustomSection(): string {
    const id = uid('s');
    const section: BiodataSection = {
      id,
      key: 'custom',
      title: '',
      hidden: false,
      fields: [{ id: uid('f'), key: null, label: '', value: '' }],
    };
    this.patch({ sections: [...this.biodata().sections, section] });
    return id;
  }

  removeSection(sectionId: string): void {
    this.patch({ sections: this.biodata().sections.filter((s) => s.id !== sectionId || s.key !== 'custom') });
  }

  // Family members ----------------------------------------------------------

  addMember(): void {
    const member: FamilyMember = { id: uid('m'), relation: 'brother', relationLabel: '', name: '', details: '' };
    this.patch({ members: [...this.biodata().members, member] });
  }

  updateMember(id: string, change: Partial<Omit<FamilyMember, 'id'>>): void {
    this.patch({ members: this.biodata().members.map((m) => (m.id === id ? { ...m, ...change } : m)) });
  }

  removeMember(id: string): void {
    this.patch({ members: this.biodata().members.filter((m) => m.id !== id) });
  }

  // Whole-document actions --------------------------------------------------

  /** Replaces the content with a sample profile in the current biodata language. */
  loadSample(): void {
    this.commit(sampleBiodata(PERSONA_FOR_LANG[this.biodata().language]));
  }

  reset(): void {
    this.commit(createEmptyBiodata(this.biodata().language));
  }

  // Internals ---------------------------------------------------------------

  private patch(change: Partial<Biodata>): void {
    this.commit({ ...this.biodata(), ...change });
  }

  private mapSection(sectionId: string, fn: (s: BiodataSection) => BiodataSection): void {
    this.patch({ sections: this.biodata().sections.map((s) => (s.id === sectionId ? fn(s) : s)) });
  }

  private mapField(b: Biodata, sectionId: string, fieldId: string, fn: (f: BiodataField) => BiodataField): Biodata {
    return {
      ...b,
      sections: b.sections.map((s) =>
        s.id === sectionId ? { ...s, fields: s.fields.map((f) => (f.id === fieldId ? fn(f) : f)) } : s,
      ),
    };
  }

  private commit(next: Biodata): void {
    this.biodata.set(next);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.saveOk.set(this.storage.set(DATA_KEY, this.biodata()));
    }, SAVE_DELAY_MS);
  }

  private saveSettings(): void {
    this.storage.set(SETTINGS_KEY, this.settings());
  }
}
