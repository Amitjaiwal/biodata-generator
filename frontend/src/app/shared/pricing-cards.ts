import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n/i18n.service';
import { EntitlementService } from '../core/services/entitlement.service';
import { PaymentError, PaymentService } from '../core/services/payment.service';
import { PricingService } from '../core/services/pricing.service';
import { TEMPLATES } from '../templates/registry';
import { PaymentProgress } from './payment-progress';

const ERROR_KEYS: Record<string, string> = {
  cancelled: 'buy.cancelled',
  failed: 'buy.failed',
  unavailable: 'buy.unavailable',
  verify: 'buy.verifyFail',
};

/** The three plans. Used on the homepage and the pricing page. Prices come from the backend. */
@Component({
  selector: 'app-pricing-cards',
  imports: [RouterLink, MatButtonModule, MatIconModule, PaymentProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="plans">
      <section class="plan">
        <h3>{{ t('price.free.name') }}</h3>
        <p class="desc">{{ t('price.free.desc') }}</p>
        <p class="amount">₹0</p>
        <ul>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.free.f1', { n: freeCount }) }}</li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.free.f2') }}</li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.free.f3') }}</li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.free.f4') }}</li>
        </ul>
        <a matButton="outlined" class="btn-lg" routerLink="/create">{{ t('price.free.cta') }}</a>
      </section>

      <section class="plan">
        <h3>{{ t('price.single.name') }}</h3>
        <p class="desc">{{ t('price.single.desc') }}</p>
        <p class="amount">
          {{ pricing.price('PREMIUM_SINGLE') }} <small>{{ t('price.once') }}</small>
        </p>
        <ul>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.single.f1') }}</li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.single.f2') }}</li>
          <li>
            <mat-icon>check_circle</mat-icon>{{ t('price.single.f3', { days: pricing.product('PREMIUM_SINGLE').validityDays }) }}
          </li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.single.f4') }}</li>
        </ul>
        <a matButton="outlined" class="btn-lg" routerLink="/templates" [queryParams]="{ tier: 'premium' }">
          {{ t('price.single.cta') }}
        </a>
      </section>

      <section class="plan best">
        <span class="badge">{{ t('price.badge') }}</span>
        <h3>{{ t('price.all.name') }}</h3>
        <p class="desc">{{ t('price.all.desc') }}</p>
        <p class="amount">
          {{ pricing.price('PREMIUM_COLLECTION') }} <small>{{ t('price.once') }}</small>
        </p>
        <ul>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.all.f1', { n: premiumCount }) }}</li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.all.f2') }}</li>
          <li>
            <mat-icon>check_circle</mat-icon>{{ t('price.all.f3', { days: pricing.product('PREMIUM_COLLECTION').validityDays }) }}
          </li>
          <li><mat-icon>check_circle</mat-icon>{{ t('price.all.f4') }}</li>
        </ul>
        @if (entitlements.hasCollection()) {
          <a matButton="filled" class="btn-lg" routerLink="/templates" [queryParams]="{ tier: 'premium' }">
            <mat-icon>lock_open</mat-icon>{{ t('b.unlocked') }}
          </a>
        } @else {
          <button matButton="filled" class="btn-lg" type="button" [disabled]="busy()" (click)="buyCollection()">
            {{ busy() ? t('buy.processing') : t('price.all.cta') }}
          </button>
          <app-payment-progress />
        }
      </section>
    </div>
    <p class="note">{{ t('price.note') }}</p>
  `,
  styles: `
    .plans {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      align-items: stretch;
    }
    .plan {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 30px 26px 26px;
      border: 1px solid var(--sp-border);
      border-radius: 20px;
      background: #fff;
      box-shadow: var(--sp-shadow);
    }
    .plan.best {
      border: 2px solid var(--sp-primary);
      box-shadow: var(--sp-shadow-lg);
    }
    .badge {
      position: absolute;
      top: -13px;
      left: 24px;
      padding: 4px 12px;
      border-radius: 999px;
      background: var(--sp-primary);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    h3 {
      font-size: 1.25rem;
    }
    .desc {
      min-height: 3.2em;
      margin-top: 6px;
      color: var(--sp-muted);
      font-size: 0.95rem;
    }
    .amount {
      margin: 14px 0 6px;
      font-family: var(--sp-display);
      font-size: 2.8rem;
      font-weight: 600;
      line-height: 1.1;
    }
    .amount small {
      color: var(--sp-muted);
      font-family: var(--sp-font);
      font-size: 0.9rem;
      font-weight: 500;
    }
    ul {
      flex: 1;
      margin: 14px 0 22px;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      gap: 10px;
      padding: 6px 0;
      font-size: 0.95rem;
    }
    li mat-icon {
      flex: none;
      width: 20px;
      height: 20px;
      color: var(--sp-success);
      font-size: 20px;
    }
    .note {
      margin-top: 22px;
      color: var(--sp-muted);
      font-size: 0.88rem;
      text-align: center;
    }
    @media (max-width: 900px) {
      .plans {
        grid-template-columns: 1fr;
        max-width: 460px;
        margin: 0 auto;
      }
      .desc {
        min-height: 0;
      }
    }
  `,
})
export class PricingCards {
  protected readonly pricing = inject(PricingService);
  protected readonly entitlements = inject(EntitlementService);
  protected readonly t = inject(I18nService).t;
  private readonly payments = inject(PaymentService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly freeCount = TEMPLATES.filter((x) => x.tier === 'free').length;
  protected readonly premiumCount = TEMPLATES.length - this.freeCount;
  protected readonly busy = signal(false);

  constructor() {
    this.pricing.load();
  }

  protected async buyCollection(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.payments.purchase('PREMIUM_COLLECTION', null, this.t('price.all.name'));
      this.snack.open(this.t('buy.success'), undefined, { duration: 5000 });
      void this.router.navigate(['/templates'], { queryParams: { tier: 'premium' } });
    } catch (e) {
      const reason = e instanceof PaymentError ? e.reason : 'failed';
      this.snack.open(this.t(ERROR_KEYS[reason]), undefined, { duration: 6000 });
    } finally {
      this.busy.set(false);
    }
  }
}
