import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OPTION_GROUPS, SUGGESTIONS } from '../../core/data/fields';
import { I18nService } from '../../core/i18n/i18n.service';
import { FieldDef, Lang } from '../../core/models/biodata.model';
import { formatHeight } from '../render/format';

interface Option {
  value: string;
  label: string;
}

/**
 * One built-in field. The control type comes from the field definition, so the form never
 * needs to know about individual fields.
 */
@Component({
  selector: 'app-field-input',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, TextFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.wide]': 'def().wide' },
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ i18n.fieldLabel('f.' + def().key) }}</mat-label>
      @switch (def().type) {
        @case ('select') {
          <mat-select [value]="value()" (selectionChange)="valueChange.emit($event.value)">
            <mat-option value="">{{ i18n.t('b.select.none') }}</mat-option>
            @for (o of options(); track o.value) {
              <mat-option [value]="o.value">{{ o.label }}</mat-option>
            }
          </mat-select>
        }
        @case ('textarea') {
          <textarea
            matInput
            cdkTextareaAutosize
            cdkAutosizeMinRows="2"
            cdkAutosizeMaxRows="5"
            [value]="value()"
            [attr.maxlength]="def().maxLength ?? null"
            (input)="emit($event)"
          ></textarea>
        }
        @default {
          <input
            matInput
            [type]="inputType()"
            [value]="value()"
            [required]="!!def().required"
            [errorStateMatcher]="matcher"
            [attr.maxlength]="def().maxLength ?? null"
            [attr.max]="def().type === 'date' ? today : def().type === 'number' ? 120 : null"
            [attr.min]="def().type === 'number' ? 0 : null"
            [attr.inputmode]="inputMode()"
            [attr.autocomplete]="autocomplete()"
            [attr.list]="suggestions().length ? listId : null"
            (input)="emit($event)"
          />
          @if (suggestions().length) {
            <datalist [id]="listId">
              @for (s of suggestions(); track s) {
                <option [value]="s"></option>
              }
            </datalist>
          }
        }
      }
      @if (error(); as e) {
        <mat-error>{{ e }}</mat-error>
      } @else if (hint()) {
        <mat-hint>{{ hint() }}</mat-hint>
      }
    </mat-form-field>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class FieldInput {
  readonly def = input.required<FieldDef>();
  readonly value = input.required<string>();
  /** Biodata language, used for free-text suggestions. */
  readonly lang = input.required<Lang>();
  readonly error = input<string | null>(null);
  readonly hint = input('');
  readonly valueChange = output<string>();

  protected readonly i18n = inject(I18nService);
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly matcher: ErrorStateMatcher = { isErrorState: () => !!this.error() };
  protected readonly listId = 'dl-' + Math.random().toString(36).slice(2, 9);

  protected readonly options = computed<Option[]>(() => {
    const group = this.def().options;
    if (!group) return [];
    const uiLang = this.i18n.lang();
    return (OPTION_GROUPS[group] ?? []).map((value) => ({
      value,
      label: group === 'height' ? formatHeight(value, uiLang) : group === 'blood' ? value : this.i18n.fieldLabel(`o.${group}.${value}`),
    }));
  });

  protected readonly suggestions = computed<readonly string[]>(() => {
    const key = this.def().suggest;
    return key ? (SUGGESTIONS[key]?.[this.lang()] ?? []) : [];
  });

  protected inputType(): string {
    const type = this.def().type;
    return type === 'date' || type === 'time' || type === 'tel' || type === 'email' || type === 'number' ? type : 'text';
  }

  protected inputMode(): string | null {
    const type = this.def().type;
    return type === 'number' ? 'numeric' : type === 'tel' ? 'tel' : type === 'email' ? 'email' : null;
  }

  protected autocomplete(): string {
    switch (this.def().key) {
      case 'fullName':
        return 'name';
      case 'email':
        return 'email';
      case 'mobile':
        return 'tel';
      default:
        return 'off';
    }
  }

  protected emit(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }
}
