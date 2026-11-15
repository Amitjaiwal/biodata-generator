import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n/i18n.service';
import { TemplateDefinition } from '../core/models/template.model';
import { EntitlementService } from '../core/services/entitlement.service';
import { TemplateThumb } from './template-thumb';

/** Gallery card: live thumbnail, name, Free/Premium label and the two actions. */
@Component({
  selector: 'app-template-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, TemplateThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <button type="button" class="shot" (click)="preview.emit(def())" [attr.aria-label]="t('gallery.preview') + ': ' + def().name">
        <app-template-thumb [def]="def()" />
        <span class="tier" [class.premium]="def().tier === 'premium'">
          @if (def().tier === 'premium') {
            <mat-icon>{{ unlocked() ? 'lock_open' : 'workspace_premium' }}</mat-icon>
            {{ unlocked() ? t('b.unlocked') : t('common.premium') }}
          } @else {
            {{ t('common.free') }}
          }
        </span>
      </button>
      <div class="meta">
        <h3>{{ def().name }}</h3>
        <p>{{ categories() }}</p>
      </div>
      <div class="actions">
        <button matButton="outlined" type="button" (click)="preview.emit(def())">{{ t('gallery.preview') }}</button>
        <a matButton="filled" routerLink="/create" [queryParams]="{ template: def().id }">{{ t('gallery.use') }}</a>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid var(--sp-border);
      border-radius: var(--sp-radius);
      background: #fff;
      box-shadow: var(--sp-shadow);
      transition:
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }
    .card:hover {
      box-shadow: var(--sp-shadow-lg);
      transform: translateY(-2px);
    }
    .shot {
      position: relative;
      display: block;
      width: 100%;
      padding: 14px 14px 0;
      border: 0;
      background: var(--sp-bg);
      cursor: zoom-in;
    }
    app-template-thumb {
      overflow: hidden;
      border-radius: 6px 6px 0 0;
      box-shadow: 0 1px 3px rgba(31, 26, 23, 0.12), 0 8px 20px rgba(31, 26, 23, 0.1);
    }
    .tier {
      position: absolute;
      top: 24px;
      left: 24px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 999px;
      background: #e8f5ec;
      color: var(--sp-success);
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
    }
    .tier.premium {
      background: #fff4d6;
      color: #8a5a00;
    }
    .tier mat-icon {
      width: 15px;
      height: 15px;
      font-size: 15px;
    }
    .meta {
      padding: 14px 16px 4px;
    }
    h3 {
      font-family: var(--sp-font);
      font-size: 1.02rem;
      font-weight: 600;
    }
    p {
      color: var(--sp-muted);
      font-size: 0.85rem;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding: 10px 14px 14px;
    }
    .actions > * {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 12px;
      font-size: 0.86rem;
      white-space: nowrap;
    }
    @media (max-width: 520px) {
      .actions {
        flex-direction: column;
      }
      .shot {
        padding: 8px 8px 0;
      }
      .tier {
        top: 14px;
        left: 14px;
      }
    }
  `,
})
export class TemplateCard {
  readonly def = input.required<TemplateDefinition>();
  readonly preview = output<TemplateDefinition>();

  private readonly entitlements = inject(EntitlementService);
  protected readonly t = inject(I18nService).t;

  protected categories(): string {
    return this.def()
      .categories.map((c) => this.t('cat.' + c))
      .join(' · ');
  }

  protected unlocked(): boolean {
    return this.entitlements.has(this.def().id);
  }
}
