import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { I18nService } from '../core/i18n/i18n.service';
import { TemplateDefinition } from '../core/models/template.model';
import { PricingService } from '../core/services/pricing.service';
import { TemplateThumb } from './template-thumb';

/** Large preview of one design with sample details. */
@Component({
  selector: 'app-template-preview-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TemplateThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <div>
        <h2>{{ def.name }}</h2>
        <p>
          @if (def.tier === 'premium') {
            {{ t('common.premium') }} · {{ pricing.price('PREMIUM_SINGLE') }}
          } @else {
            {{ t('common.free') }}
          }
        </p>
      </div>
      <button matIconButton mat-dialog-close [attr.aria-label]="t('common.close')"><mat-icon>close</mat-icon></button>
    </div>
    <mat-dialog-content>
      <app-template-thumb [def]="def" />
      <p class="note">{{ t('gallery.sampleNote') }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>{{ t('common.close') }}</button>
      <button matButton="filled" (click)="use()">{{ t('gallery.useThis') }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 16px 10px 24px;
    }
    h2 {
      font-size: 1.3rem;
    }
    .head p {
      color: var(--sp-muted);
      font-size: 0.9rem;
    }
    mat-dialog-content {
      max-height: 68vh;
      padding-top: 4px !important;
      background: var(--sp-bg);
    }
    app-template-thumb {
      margin-top: 16px;
      box-shadow: var(--sp-shadow-lg);
    }
    .note {
      margin: 14px 0 6px;
      color: var(--sp-muted);
      font-size: 0.85rem;
      text-align: center;
    }
  `,
})
export class TemplatePreviewDialog {
  protected readonly def = inject<TemplateDefinition>(MAT_DIALOG_DATA);
  protected readonly t = inject(I18nService).t;
  protected readonly pricing = inject(PricingService);
  private readonly ref = inject(MatDialogRef<TemplatePreviewDialog>);
  private readonly router = inject(Router);

  protected use(): void {
    this.ref.close();
    void this.router.navigate(['/create'], { queryParams: { template: this.def.id } });
  }
}
