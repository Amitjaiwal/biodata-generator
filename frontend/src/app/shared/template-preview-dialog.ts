import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { I18nService } from '../core/i18n/i18n.service';
import { TemplateDefinition } from '../core/models/template.model';
import { EntitlementService } from '../core/services/entitlement.service';
import { PricingService } from '../core/services/pricing.service';
import { TemplateThumb } from './template-thumb';

/** A design to preview, plus the list it came from so the visitor can step through it. */
export interface TemplatePreviewData {
  def: TemplateDefinition;
  list?: readonly TemplateDefinition[];
}

/** Large preview of one design with sample details. Arrow keys and the buttons step through the list. */
@Component({
  selector: 'app-template-preview-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TemplateThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.arrowleft)': 'step(-1)', '(document:keydown.arrowright)': 'step(1)' },
  template: `
    <div class="head">
      <div class="who">
        <h2>
          {{ def().name }}
          @if (def().isNew) {
            <span class="new">{{ t('badge.new') }}</span>
          }
        </h2>
        <p class="meta">{{ categories() }}</p>
        <p class="price">
          @if (def().tier === 'premium') {
            @if (unlocked()) {
              <mat-icon>lock_open</mat-icon>{{ t('b.unlocked') }}
            } @else {
              <mat-icon>workspace_premium</mat-icon>{{ t('common.premium') }} · {{ pricing.price('PREMIUM_SINGLE') }}
            }
          } @else {
            {{ t('common.free') }}
          }
        </p>
      </div>
      <button matIconButton mat-dialog-close [attr.aria-label]="t('common.close')"><mat-icon>close</mat-icon></button>
    </div>
    <mat-dialog-content>
      <div class="stage">
        @if (many()) {
          <button type="button" class="nav prev" (click)="step(-1)" [attr.aria-label]="t('gallery.prev')">
            <mat-icon>chevron_left</mat-icon>
          </button>
        }
        <app-template-thumb [def]="def()" [lazy]="false" />
        @if (many()) {
          <button type="button" class="nav next" (click)="step(1)" [attr.aria-label]="t('gallery.next')">
            <mat-icon>chevron_right</mat-icon>
          </button>
        }
      </div>
      <p class="note">
        {{ t('gallery.sampleNote') }}
        @if (many()) {
          <span class="count">{{ index() + 1 }} / {{ list.length }}</span>
        }
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>{{ t('common.close') }}</button>
      <button matButton="filled" (click)="use()">{{ t('gallery.useThis') }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 16px 10px 24px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
    }
    .new {
      padding: 2px 9px;
      border-radius: 999px;
      background: var(--sp-primary);
      color: #fff;
      font-family: var(--sp-font);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .meta {
      color: var(--sp-muted);
      font-size: 0.88rem;
    }
    .price {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
      color: #8a5a00;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .price mat-icon {
      width: 17px;
      height: 17px;
      font-size: 17px;
    }
    mat-dialog-content {
      max-height: 68vh;
      padding-top: 4px !important;
      background: var(--sp-bg);
    }
    .stage {
      position: relative;
      margin-top: 16px;
    }
    app-template-thumb {
      box-shadow: var(--sp-shadow-lg);
    }
    .nav {
      position: absolute;
      top: 50%;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      margin-top: -21px;
      border: 1px solid var(--sp-border);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.94);
      color: var(--sp-ink);
      box-shadow: var(--sp-shadow);
      cursor: pointer;
    }
    .nav:hover {
      background: #fff;
      color: var(--sp-primary);
    }
    .prev {
      left: 8px;
    }
    .next {
      right: 8px;
    }
    .note {
      margin: 14px 0 6px;
      color: var(--sp-muted);
      font-size: 0.85rem;
      text-align: center;
    }
    .count {
      margin-left: 8px;
      font-weight: 600;
    }
  `,
})
export class TemplatePreviewDialog {
  private readonly data = inject<TemplateDefinition | TemplatePreviewData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<TemplatePreviewDialog>);
  private readonly router = inject(Router);
  private readonly entitlements = inject(EntitlementService);
  protected readonly t = inject(I18nService).t;
  protected readonly pricing = inject(PricingService);

  /** The list being stepped through. A bare design (older callers) previews just itself. */
  protected readonly list: readonly TemplateDefinition[];
  protected readonly index = signal(0);
  protected readonly def = computed(() => this.list[this.index()]);
  protected readonly many = computed(() => this.list.length > 1);
  protected readonly unlocked = computed(() => this.entitlements.has(this.def().id));
  protected readonly categories = computed(() =>
    this.def()
      .categories.map((c) => this.t('cat.' + c))
      .join(' · '),
  );

  constructor() {
    const entry = 'def' in this.data ? this.data : { def: this.data, list: undefined };
    this.list = entry.list?.length ? entry.list : [entry.def];
    this.index.set(Math.max(0, this.list.findIndex((x) => x.id === entry.def.id)));
    this.pricing.load();
  }

  protected step(by: number): void {
    const n = this.list.length;
    if (n < 2) return;
    this.index.update((i) => (i + by + n) % n);
  }

  protected use(): void {
    this.ref.close();
    void this.router.navigate(['/create'], { queryParams: { template: this.def().id } });
  }
}
