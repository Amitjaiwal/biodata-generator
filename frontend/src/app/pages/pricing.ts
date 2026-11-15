import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { FaqList } from '../shared/faq-list';
import { PricingCards } from '../shared/pricing-cards';

@Component({
  selector: 'app-pricing',
  imports: [MatButtonModule, MatIconModule, PricingCards, FaqList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="top">
      <div class="container">
        <div class="section-head">
          <h1>{{ t('pricing.title') }}</h1>
          <p>{{ t('pricing.sub') }}</p>
        </div>
        <app-pricing-cards />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('pricing.how.title') }}</h2>
        </div>
        <ol class="how">
          @for (n of [1, 2, 3]; track n) {
            <li>
              <span>{{ n }}</span>
              <p>{{ t('pricing.how.' + n) }}</p>
            </li>
          }
        </ol>
        <p class="restore">
          <button matButton type="button" (click)="restore()"><mat-icon>restore</mat-icon>{{ t('buy.haveId') }}</button>
        </p>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('home.faq.title') }}</h2>
        </div>
        <app-faq-list />
      </div>
    </section>
  `,
  styles: `
    .top {
      padding: 56px 0 72px;
      background: var(--sp-bg);
    }
    h1 {
      font-size: clamp(2rem, 4vw, 2.8rem);
    }
    .how {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
      max-width: 940px;
      margin: 0 auto;
      padding: 0;
      list-style: none;
    }
    .how li {
      display: flex;
      gap: 14px;
    }
    .how span {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--sp-primary);
      color: #fff;
      font-weight: 700;
    }
    .how p {
      color: #4a423c;
    }
    .restore {
      margin-top: 30px;
      text-align: center;
    }
    @media (max-width: 760px) {
      .how {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Pricing {
  protected readonly t = inject(I18nService).t;
  private readonly dialog = inject(MatDialog);

  constructor() {
    inject(SeoService).set({
      title: 'Pricing: Free and Premium Marriage Biodata Templates | ShubhPatra',
      description:
        'Free marriage biodata templates with unlimited PDF downloads. Premium designs from ₹49 one-time, or the whole collection for ₹99. Pay securely by UPI or card.',
      path: '/pricing',
    });
  }

  protected async restore(): Promise<void> {
    const { RestoreDialog } = await import('../shared/restore-dialog');
    this.dialog.open(RestoreDialog, { width: '440px', maxWidth: '94vw' });
  }
}
