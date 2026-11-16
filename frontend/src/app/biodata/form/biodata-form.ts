import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { BLESSING_PRESETS, FIELD_DEF_BY_KEY } from '../../core/data/fields';
import { I18nService } from '../../core/i18n/i18n.service';
import {
  BiodataField,
  BiodataSection,
  FieldDef,
  MemberRelation,
  SYMBOL_KEYS,
  SectionKey,
} from '../../core/models/biodata.model';
import { PHOTO_ACCEPT, normalizePhotoFile, validatePhotoFile } from '../photo/photo-rules';
import { BiodataStore } from '../store/biodata.store';
import { FieldInput } from './field-input';
import { fieldError } from './validation';

const ICONS: Record<SectionKey, string> = {
  personal: 'person',
  birth: 'auto_awesome',
  education: 'school',
  family: 'family_restroom',
  lifestyle: 'spa',
  partner: 'favorite',
  contact: 'call',
  custom: 'notes',
};

/**
 * The one form shared by every design. It edits the common data model through the store and
 * knows nothing about templates. Sections and fields are rendered from the model itself.
 */
@Component({
  selector: 'app-biodata-form',
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FieldInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sp-dense' },
  template: `
    <mat-accordion>
      <!-- Photo, blessing and heading -->
      <mat-expansion-panel [expanded]="open() === 'header'" (opened)="open.set('header')" (closed)="closed('header')">
        <mat-expansion-panel-header>
          <mat-panel-title><mat-icon>account_box</mat-icon>{{ t('b.header') }}</mat-panel-title>
        </mat-expansion-panel-header>
        <ng-template matExpansionPanelContent>
          <div class="photo">
            <div class="frame" [style.background-image]="photoBg()">
              @if (!b().photo) {
                <mat-icon>add_a_photo</mat-icon>
              }
            </div>
            <div class="photo-actions">
              <strong>{{ t('b.photo') }}</strong>
              <div class="buttons">
                <button matButton="tonal" type="button" (click)="file.click()">
                  <mat-icon>upload</mat-icon>{{ b().photo ? t('b.photo.change') : t('b.photo.upload') }}
                </button>
                @if (b().photo) {
                  <button matButton type="button" (click)="store.setPhoto(null)">
                    <mat-icon>delete_outline</mat-icon>{{ t('b.photo.remove') }}
                  </button>
                }
              </div>
              <small>{{ t('b.photo.hint') }}</small>
            </div>
            <input
              #file
              class="file-input"
              type="file"
              tabindex="-1"
              aria-hidden="true"
              [accept]="photoAccept"
              (change)="onFile($event)"
            />
          </div>

          <div class="grid">
            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="wide">
              <mat-label>{{ t('b.blessing') }}</mat-label>
              <input
                matInput
                maxlength="120"
                list="sp-blessings"
                [value]="b().blessing"
                (input)="store.setBlessing($any($event.target).value)"
              />
              <mat-hint>{{ t('b.blessingHint') }}</mat-hint>
              <datalist id="sp-blessings">
                @for (p of blessings; track p) {
                  <option [value]="p"></option>
                }
              </datalist>
            </mat-form-field>
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ t('b.symbol') }}</mat-label>
              <mat-select [value]="b().symbol" (selectionChange)="store.setSymbol($event.value)">
                @for (s of symbols; track s) {
                  <mat-option [value]="s">{{ t('b.sym.' + s) }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ t('b.docTitle') }}</mat-label>
              <input
                matInput
                maxlength="60"
                [placeholder]="i18n.fieldLabel('doc.title')"
                [value]="b().title"
                (input)="store.setTitle($any($event.target).value)"
              />
              <mat-hint>{{ t('b.docTitleHint') }}</mat-hint>
            </mat-form-field>
          </div>
        </ng-template>
      </mat-expansion-panel>

      <!-- One panel per section, in the user's order -->
      @for (s of b().sections; track s.id; let first = $first; let last = $last) {
        <mat-expansion-panel
          [expanded]="open() === s.id"
          (opened)="open.set(s.id)"
          (closed)="closed(s.id)"
          [class.is-hidden]="s.hidden"
        >
          <mat-expansion-panel-header>
            <mat-panel-title><mat-icon>{{ icons[s.key] }}</mat-icon>{{ titleOf(s) }}</mat-panel-title>
            <mat-panel-description>
              @if (s.hidden) {
                <span class="chip">{{ t('b.section.hidden') }}</span>
              } @else if (filled(s); as n) {
                <span class="count">{{ n }}</span>
              }
            </mat-panel-description>
          </mat-expansion-panel-header>

          <ng-template matExpansionPanelContent>
            <div class="tools">
              <mat-slide-toggle [checked]="!s.hidden" (change)="store.setSectionHidden(s.id, !$event.checked)">
                {{ t('b.section.visible') }}
              </mat-slide-toggle>
              <span class="spacer"></span>
              <button
                matIconButton
                type="button"
                [disabled]="first"
                [matTooltip]="t('b.section.up')"
                [attr.aria-label]="t('b.section.up')"
                (click)="store.moveSection(s.id, -1)"
              >
                <mat-icon>arrow_upward</mat-icon>
              </button>
              <button
                matIconButton
                type="button"
                [disabled]="last"
                [matTooltip]="t('b.section.down')"
                [attr.aria-label]="t('b.section.down')"
                (click)="store.moveSection(s.id, 1)"
              >
                <mat-icon>arrow_downward</mat-icon>
              </button>
              @if (s.key === 'custom') {
                <button
                  matIconButton
                  type="button"
                  [matTooltip]="t('b.section.remove')"
                  [attr.aria-label]="t('b.section.remove')"
                  (click)="store.removeSection(s.id)"
                >
                  <mat-icon>delete_outline</mat-icon>
                </button>
              }
            </div>

            @if (s.key === 'custom') {
              <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full">
                <mat-label>{{ t('b.section.title') }}</mat-label>
                <input
                  matInput
                  maxlength="60"
                  [placeholder]="i18n.fieldLabel('sec.custom')"
                  [value]="s.title"
                  (input)="store.setSectionTitle(s.id, $any($event.target).value)"
                />
              </mat-form-field>
            }

            <div class="grid">
              @for (f of s.fields; track f.id) {
                @if (defOf(f); as def) {
                  <app-field-input
                    [def]="def"
                    [value]="f.value"
                    [lang]="b().language"
                    [error]="errorOf(f)"
                    [hint]="hintOf(f)"
                    (valueChange)="store.setField(s.id, f.id, $event)"
                  />
                }
              }
            </div>

            @if (s.key === 'family') {
              <div class="members">
                <h4>{{ t('b.members') }}</h4>
                <p class="hint">{{ t('b.membersHint') }}</p>
                @for (m of b().members; track m.id) {
                  <div class="member">
                    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="rel">
                      <mat-label>{{ t('b.member.relation') }}</mat-label>
                      <mat-select [value]="m.relation" (selectionChange)="setRelation(m.id, $event.value)">
                        <mat-option value="brother">{{ i18n.fieldLabel('rel.brother') }}</mat-option>
                        <mat-option value="sister">{{ i18n.fieldLabel('rel.sister') }}</mat-option>
                        <mat-option value="other">{{ t('b.member.relationOther') }}</mat-option>
                      </mat-select>
                    </mat-form-field>
                    @if (m.relation === 'other') {
                      <mat-form-field appearance="outline" subscriptSizing="dynamic">
                        <mat-label>{{ t('b.member.relationLabel') }}</mat-label>
                        <input
                          matInput
                          maxlength="40"
                          [value]="m.relationLabel"
                          (input)="store.updateMember(m.id, { relationLabel: $any($event.target).value })"
                        />
                      </mat-form-field>
                    }
                    <mat-form-field appearance="outline" subscriptSizing="dynamic">
                      <mat-label>{{ t('b.member.name') }}</mat-label>
                      <input
                        matInput
                        maxlength="80"
                        [value]="m.name"
                        (input)="store.updateMember(m.id, { name: $any($event.target).value })"
                      />
                    </mat-form-field>
                    <mat-form-field appearance="outline" subscriptSizing="dynamic">
                      <mat-label>{{ t('b.member.details') }}</mat-label>
                      <input
                        matInput
                        maxlength="120"
                        [value]="m.details"
                        (input)="store.updateMember(m.id, { details: $any($event.target).value })"
                      />
                    </mat-form-field>
                    <button
                      matIconButton
                      type="button"
                      [matTooltip]="t('b.member.remove')"
                      [attr.aria-label]="t('b.member.remove')"
                      (click)="store.removeMember(m.id)"
                    >
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
                <button matButton type="button" (click)="store.addMember()">
                  <mat-icon>person_add</mat-icon>{{ t('b.addMember') }}
                </button>
              </div>
            }

            @for (f of s.fields; track f.id) {
              @if (!f.key) {
                <div class="custom">
                  <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>{{ t('b.field.label') }}</mat-label>
                    <input
                      matInput
                      maxlength="60"
                      [value]="f.label"
                      (input)="store.setFieldLabel(s.id, f.id, $any($event.target).value)"
                    />
                  </mat-form-field>
                  <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>{{ t('b.field.value') }}</mat-label>
                    <input
                      matInput
                      maxlength="300"
                      [value]="f.value"
                      (input)="store.setField(s.id, f.id, $any($event.target).value)"
                    />
                  </mat-form-field>
                  <button
                    matIconButton
                    type="button"
                    [matTooltip]="t('b.field.remove')"
                    [attr.aria-label]="t('b.field.remove')"
                    (click)="store.removeField(s.id, f.id)"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
            }
            <button matButton type="button" class="add" (click)="store.addCustomField(s.id)">
              <mat-icon>add</mat-icon>{{ t('b.addField') }}
            </button>
          </ng-template>
        </mat-expansion-panel>
      }
    </mat-accordion>

    <button matButton="outlined" type="button" class="add-section" (click)="addSection()">
      <mat-icon>playlist_add</mat-icon>{{ t('b.addSection') }}
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
    mat-expansion-panel {
      --mat-expansion-container-shape: 14px;
      margin-bottom: 10px !important;
      border: 1px solid var(--sp-border);
      border-radius: 14px !important;
      box-shadow: none !important;
    }
    mat-expansion-panel.is-hidden mat-panel-title {
      color: var(--sp-muted);
    }
    mat-panel-title {
      gap: 10px;
      font-weight: 600;
    }
    mat-panel-title mat-icon {
      color: var(--sp-primary);
    }
    mat-panel-description {
      flex-grow: 0;
      justify-content: flex-end;
      margin-right: 8px;
    }
    .chip,
    .count {
      padding: 2px 10px;
      border-radius: 999px;
      background: #f1e8de;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .count {
      background: #e8f5ec;
      color: var(--sp-success);
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }
    .spacer {
      flex: 1;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 12px;
    }
    .grid .wide,
    .grid app-field-input.wide {
      grid-column: 1 / -1;
    }
    .grid mat-form-field,
    .full {
      width: 100%;
    }
    .full {
      margin-bottom: 14px;
    }
    /* Visually hidden but still rendered: older mobile browsers ignore a programmatic click on display:none inputs. */
    .file-input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }
    .photo {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 18px;
    }
    .frame {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 84px;
      height: 105px;
      border: 1px dashed #c9bcae;
      border-radius: 10px;
      background: var(--sp-bg) center / cover no-repeat;
      color: #a3978d;
    }
    .photo-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    small,
    .hint {
      color: var(--sp-muted);
      font-size: 0.8rem;
    }
    .members {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px dashed var(--sp-border);
    }
    h4 {
      font-family: var(--sp-font);
      font-size: 0.95rem;
      font-weight: 600;
    }
    .member,
    .custom {
      display: grid;
      gap: 8px;
      align-items: center;
      margin-top: 12px;
    }
    .member {
      grid-template-columns: 124px repeat(auto-fit, minmax(110px, 1fr)) 40px;
    }
    .member mat-form-field,
    .custom mat-form-field {
      min-width: 0;
      width: 100%;
    }
    .custom {
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) 40px;
    }
    .add {
      margin-top: 10px;
    }
    .add-section {
      width: 100%;
      margin-top: 4px;
    }
    @media (max-width: 560px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .member {
        grid-template-columns: 1fr 40px;
      }
      .member mat-form-field {
        grid-column: 1;
      }
      .member > button {
        grid-column: 2;
        grid-row: 1;
      }
      .tools {
        flex-wrap: wrap;
      }
    }
  `,
})
export class BiodataForm {
  /** Shows the "name is required" error even if the field was never touched. */
  readonly showErrors = input(false);

  protected readonly store = inject(BiodataStore);
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly b = this.store.biodata;
  protected readonly open = signal<string>('personal');
  protected readonly icons = ICONS;
  protected readonly symbols = SYMBOL_KEYS;
  protected readonly blessings = BLESSING_PRESETS;

  /** Opens a section programmatically, for example to show a validation error. */
  openSection(id: string): void {
    this.open.set(id);
  }

  protected closed(id: string): void {
    if (this.open() === id) this.open.set('');
  }

  protected readonly photoAccept = PHOTO_ACCEPT;

  protected photoBg(): string | null {
    const photo = this.b().photo;
    return photo ? `url("${photo}")` : null;
  }

  protected titleOf(s: BiodataSection): string {
    return s.title.trim() || this.i18n.fieldLabel('sec.' + s.key);
  }

  protected filled(s: BiodataSection): number {
    return s.fields.reduce((n, f) => n + (f.value.trim() ? 1 : 0), 0);
  }

  protected defOf(f: BiodataField): FieldDef | undefined {
    return f.key ? FIELD_DEF_BY_KEY.get(f.key) : undefined;
  }

  protected errorOf(f: BiodataField): string | null {
    const key = fieldError(f.key, f.value, this.showErrors());
    return key ? this.t(key) : null;
  }

  protected hintOf(f: BiodataField): string {
    return f.key === 'age' && this.store.fieldValue('personal', 'dob') ? this.t('b.age.auto') : '';
  }

  protected setRelation(id: string, relation: MemberRelation): void {
    this.store.updateMember(id, { relation });
  }

  protected addSection(): void {
    this.open.set(this.store.addCustomSection());
  }

  protected async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const problem = validatePhotoFile(file);
    if (problem) {
      this.snack.open(this.t(problem), undefined, { duration: 5000 });
      return;
    }
    const { PhotoDialog } = await import('../photo/photo-dialog');
    const result = await firstValueFrom(
      this.dialog
        .open<unknown, File, string>(PhotoDialog, { data: normalizePhotoFile(file), width: '560px', maxWidth: '96vw' })
        .afterClosed(),
    );
    if (result) this.store.setPhoto(result);
  }
}
