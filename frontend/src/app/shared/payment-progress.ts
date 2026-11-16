import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { I18nService } from '../core/i18n/i18n.service';
import { PaymentService } from '../core/services/payment.service';

/**
 * Shown from the click on a buy button until Razorpay's window opens. After 15 seconds it adds a
 * hint and lets the buyer stop waiting, so a sleeping backend never leaves them staring at nothing.
 */
@Component({
  selector: 'app-payment-progress',
  imports: [MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (payments.phase() === 'preparing') {
      <div class="progress" role="status" aria-live="polite">
        <mat-spinner diameter="22" />
        <div class="text">
          <strong>{{ t('buy.preparing') }}</strong>
          <span>{{ t('buy.preparingSub') }}</span>
          @if (payments.slow()) {
            <span class="slow">{{ t('buy.slow') }}</span>
            <button type="button" class="retry" (click)="payments.cancelPreparing()">{{ t('buy.tryAgain') }}</button>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .progress {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 12px 0;
      padding: 12px 14px;
      border: 1px solid var(--sp-border);
      border-radius: 12px;
      background: var(--sp-primary-soft);
      color: var(--sp-ink);
      font-size: 0.88rem;
      text-align: left;
    }
    mat-spinner {
      flex: none;
      margin-top: 2px;
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .text span {
      color: var(--sp-muted);
    }
    .text .slow {
      color: #8c1d18;
      font-weight: 600;
    }
    .retry {
      align-self: flex-start;
      padding: 0;
      border: 0;
      background: none;
      color: var(--sp-primary);
      font: inherit;
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
    }
  `,
})
export class PaymentProgress {
  protected readonly payments = inject(PaymentService);
  protected readonly t = inject(I18nService).t;
}
