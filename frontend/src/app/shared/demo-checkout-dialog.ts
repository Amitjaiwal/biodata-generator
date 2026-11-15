import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../core/i18n/i18n.service';
import { PricingService } from '../core/services/pricing.service';

/**
 * Stand-in for Razorpay Checkout. It only ever opens when the backend reports demo mode
 * (no Razorpay keys configured), so the whole purchase flow can be tested locally.
 */
@Component({
  selector: 'app-demo-checkout-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ t('demo.title') }} · {{ pricing.format(data.amount) }}</h2>
    <mat-dialog-content>
      <p class="note"><mat-icon>science</mat-icon>{{ t('demo.note') }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton [mat-dialog-close]="false">{{ t('demo.fail') }}</button>
      <button matButton="filled" [mat-dialog-close]="true">{{ t('demo.succeed') }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .note {
      display: flex;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #fff4d6;
      color: #6b4a00;
    }
    mat-icon {
      flex: none;
    }
  `,
})
export class DemoCheckoutDialog {
  protected readonly data = inject<{ amount: number }>(MAT_DIALOG_DATA);
  protected readonly pricing = inject(PricingService);
  protected readonly t = inject(I18nService).t;
}
