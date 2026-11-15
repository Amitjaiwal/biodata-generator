import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { I18nService } from '../core/i18n/i18n.service';
import { EntitlementGrant, ProductCode } from '../core/models/commerce.model';
import { EntitlementService } from '../core/services/entitlement.service';
import { PaymentError, PaymentService } from '../core/services/payment.service';
import { PricingService } from '../core/services/pricing.service';
import { TEMPLATES } from '../templates/registry';

export interface PurchaseDialogData {
  templateId: string;
  templateName: string;
}

const ERROR_KEYS: Record<string, string> = {
  cancelled: 'buy.cancelled',
  failed: 'buy.failed',
  unavailable: 'buy.unavailable',
  verify: 'buy.verifyFail',
};

/** Lets the visitor pick "this design" or "all designs" and pays through Razorpay. */
@Component({
  selector: 'app-purchase-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ t('buy.title') }}</h2>
    <mat-dialog-content>
      <p class="sub">{{ t('buy.sub') }}</p>

      <div class="options" role="radiogroup">
        @for (o of options; track o.code) {
          <button
            type="button"
            class="option"
            role="radio"
            [attr.aria-checked]="choice() === o.code"
            [class.selected]="choice() === o.code"
            [disabled]="busy()"
            (click)="choice.set(o.code)"
          >
            <mat-icon>{{ choice() === o.code ? 'radio_button_checked' : 'radio_button_unchecked' }}</mat-icon>
            <span class="text">
              <strong>{{ o.title }}</strong>
              <small>{{ o.desc }}</small>
            </span>
            <span class="price">{{ pricing.price(o.code) }}</span>
          </button>
        }
      </div>

      @if (error(); as e) {
        <p class="error" role="alert"><mat-icon>error_outline</mat-icon>{{ t(e) }}</p>
      }
      <p class="secure"><mat-icon>lock</mat-icon>{{ t('buy.secure') }}</p>
      <button type="button" class="link" [disabled]="busy()" (click)="restore()">{{ t('buy.haveId') }}</button>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close [disabled]="busy()">{{ t('common.cancel') }}</button>
      <button matButton="filled" class="pay" [disabled]="busy()" (click)="pay()">
        @if (busy()) {
          <mat-spinner diameter="18" />
          {{ t('buy.processing') }}
        } @else {
          {{ t('buy.pay', { amount: pricing.price(choice()) }) }}
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .sub {
      color: var(--sp-muted);
    }
    .options {
      display: grid;
      gap: 10px;
      margin: 16px 0;
    }
    .option {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      border: 1.5px solid var(--sp-border);
      border-radius: 14px;
      background: #fff;
      color: var(--sp-ink);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .option.selected {
      border-color: var(--sp-primary);
      background: var(--sp-primary-soft);
    }
    .option mat-icon {
      flex: none;
      color: var(--sp-primary);
    }
    .text {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }
    .text small {
      color: var(--sp-muted);
      font-size: 0.85rem;
    }
    .price {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .secure,
    .error {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.85rem;
    }
    .secure {
      color: var(--sp-muted);
    }
    .error {
      margin-bottom: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #fdecea;
      color: #8c1d18;
    }
    .secure mat-icon,
    .error mat-icon {
      flex: none;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
    .link {
      margin-top: 10px;
      padding: 0;
      border: 0;
      background: none;
      color: var(--sp-primary);
      font: inherit;
      font-size: 0.85rem;
      text-decoration: underline;
      cursor: pointer;
    }
    .pay mat-spinner {
      display: inline-block;
      margin-right: 8px;
      vertical-align: middle;
    }
  `,
})
export class PurchaseDialog {
  protected readonly data = inject<PurchaseDialogData>(MAT_DIALOG_DATA);
  protected readonly pricing = inject(PricingService);
  protected readonly t = inject(I18nService).t;
  private readonly ref = inject(MatDialogRef<PurchaseDialog, EntitlementGrant>);
  private readonly payments = inject(PaymentService);
  private readonly entitlements = inject(EntitlementService);
  private readonly dialog = inject(MatDialog);

  protected readonly choice = signal<ProductCode>('PREMIUM_SINGLE');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly premiumCount = TEMPLATES.filter((x) => x.tier === 'premium').length;
  protected readonly options: { code: ProductCode; title: string; desc: string }[] = [
    {
      code: 'PREMIUM_SINGLE',
      title: this.t('buy.single'),
      desc: this.t('buy.singleDesc', { name: this.data.templateName }),
    },
    { code: 'PREMIUM_COLLECTION', title: this.t('buy.all'), desc: this.t('buy.allDesc', { n: this.premiumCount }) },
  ];

  constructor() {
    this.pricing.load();
  }

  protected async pay(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    this.ref.disableClose = true;
    const code = this.choice();
    try {
      const grant = await this.payments.purchase(
        code,
        code === 'PREMIUM_SINGLE' ? this.data.templateId : null,
        code === 'PREMIUM_SINGLE' ? this.data.templateName : this.t('price.all.name'),
      );
      this.ref.close(grant);
    } catch (e) {
      const reason = e instanceof PaymentError ? e.reason : 'failed';
      this.error.set(ERROR_KEYS[reason]);
    } finally {
      this.busy.set(false);
      this.ref.disableClose = false;
    }
  }

  protected async restore(): Promise<void> {
    const { RestoreDialog } = await import('./restore-dialog');
    this.dialog
      .open(RestoreDialog, { width: '440px', maxWidth: '94vw' })
      .afterClosed()
      .subscribe(() => {
        if (this.entitlements.has(this.data.templateId)) this.ref.close(undefined);
      });
  }
}
