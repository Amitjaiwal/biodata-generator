import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { LANDINGS } from '../core/data/landings';
import { I18nService } from '../core/i18n/i18n.service';
import { BrandLogo } from './brand-logo';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" data-nosnippet>
      <div class="container grid">
        <div class="brand">
          <app-brand-logo />
          <p>{{ t('brand.tagline') }}</p>
          <p class="note">{{ t('footer.note') }}</p>
        </div>
        <nav [attr.aria-label]="t('footer.product')">
          <h3>{{ t('footer.product') }}</h3>
          <a routerLink="/templates">{{ t('nav.templates') }}</a>
          <a routerLink="/create">{{ t('nav.create') }}</a>
          <a routerLink="/pricing">{{ t('nav.pricing') }}</a>
          <button type="button" (click)="restore()">{{ t('footer.restore') }}</button>
        </nav>
        <nav [attr.aria-label]="t('footer.formats')">
          <h3>{{ t('footer.formats') }}</h3>
          @for (l of landings; track l.slug) {
            <a [routerLink]="'/' + l.slug">{{ l.navLabel }}</a>
          }
        </nav>
        <nav [attr.aria-label]="t('footer.company')">
          <h3>{{ t('footer.company') }}</h3>
          <a routerLink="/privacy">{{ t('footer.privacy') }}</a>
          <a routerLink="/terms">{{ t('footer.terms') }}</a>
          <a routerLink="/refund-policy">{{ t('footer.refund') }}</a>
          <a routerLink="/contact">{{ t('footer.contact') }}</a>
        </nav>
      </div>
      <div class="container legal">© {{ year }} ShubhPatra. {{ t('footer.rights') }}</div>
    </footer>
  `,
  styles: `
    .footer {
      padding: 56px 0 28px;
      border-top: 1px solid var(--sp-border);
      background: var(--sp-bg);
      font-size: 0.95rem;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1.2fr 1fr;
      gap: 36px;
    }
    .brand p {
      max-width: 320px;
      margin-top: 12px;
      color: var(--sp-muted);
    }
    .brand .note {
      font-size: 0.85rem;
    }
    h3 {
      margin-bottom: 12px;
      font-family: var(--sp-font);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    nav a,
    nav button {
      display: block;
      padding: 5px 0;
      border: 0;
      background: none;
      color: #4a423c;
      font: inherit;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }
    nav a:hover,
    nav button:hover {
      color: var(--sp-primary);
    }
    .legal {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--sp-border);
      color: var(--sp-muted);
      font-size: 0.85rem;
    }
    @media (max-width: 820px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
      .brand {
        grid-column: 1 / -1;
      }
    }
  `,
})
export class SiteFooter {
  private readonly dialog = inject(MatDialog);
  protected readonly t = inject(I18nService).t;
  protected readonly landings = LANDINGS;
  protected readonly year = new Date().getFullYear();

  protected async restore(): Promise<void> {
    const { RestoreDialog } = await import('./restore-dialog');
    this.dialog.open(RestoreDialog, { width: '440px', maxWidth: '94vw' });
  }
}
