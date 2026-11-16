import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, LANG_NAMES } from '../core/i18n/i18n.service';
import { LANGS, Lang } from '../core/models/biodata.model';
import { BrandLogo } from './brand-logo';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bar">
      <div class="container row">
        <a routerLink="/" class="logo" [attr.aria-label]="t('a11y.home')"><app-brand-logo /></a>

        <nav class="links" [attr.aria-label]="t('a11y.mainNav')">
          <a routerLink="/templates" routerLinkActive="active">{{ t('nav.templates') }}</a>
          <a routerLink="/create" routerLinkActive="active">{{ t('nav.create') }}</a>
          <a routerLink="/pricing" routerLinkActive="active">{{ t('nav.pricing') }}</a>
          <a routerLink="/" fragment="faq">{{ t('nav.faq') }}</a>
        </nav>

        <div class="actions">
          <button matButton class="lang" [matMenuTriggerFor]="langMenu" [attr.aria-label]="t('nav.language')">
            <mat-icon>language</mat-icon>
            <span>{{ names[i18n.lang()] }}</span>
          </button>
          <a matButton="filled" routerLink="/create" class="cta">{{ t('nav.create') }}</a>
          <button matIconButton class="burger" [matMenuTriggerFor]="navMenu" [attr.aria-label]="t('nav.menu')">
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
    </header>

    <mat-menu #langMenu="matMenu">
      @for (l of langs; track l) {
        <button mat-menu-item (click)="setLang(l)">
          <mat-icon>{{ i18n.lang() === l ? 'radio_button_checked' : 'radio_button_unchecked' }}</mat-icon>
          <span>{{ names[l] }}</span>
        </button>
      }
    </mat-menu>

    <mat-menu #navMenu="matMenu">
      <a mat-menu-item routerLink="/templates"><mat-icon>grid_view</mat-icon>{{ t('nav.templates') }}</a>
      <a mat-menu-item routerLink="/create"><mat-icon>edit_document</mat-icon>{{ t('nav.create') }}</a>
      <a mat-menu-item routerLink="/pricing"><mat-icon>sell</mat-icon>{{ t('nav.pricing') }}</a>
      <a mat-menu-item routerLink="/" fragment="faq"><mat-icon>help_outline</mat-icon>{{ t('nav.faq') }}</a>
    </mat-menu>
  `,
  styles: `
    /* The host is the sticky element. Sticking the inner bar does nothing, because its parent
       (this host) is exactly as tall as the bar, so there is no room for it to move. */
    :host {
      position: sticky;
      top: 0;
      z-index: 50;
      display: block;
    }
    .bar {
      height: var(--sp-header-h);
      border-bottom: 1px solid var(--sp-border);
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: saturate(1.4) blur(10px);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 24px;
      height: 100%;
    }
    .logo {
      display: inline-flex;
      text-decoration: none;
    }
    .links {
      display: flex;
      flex: 1;
      gap: 6px;
      margin-left: 12px;
    }
    .links a {
      padding: 8px 14px;
      border-radius: 999px;
      color: var(--sp-ink);
      font-size: 0.95rem;
      font-weight: 500;
      text-decoration: none;
    }
    .links a:hover,
    .links a.active {
      background: var(--sp-primary-soft);
      color: var(--sp-primary-dark);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    .burger {
      display: none;
    }
    @media (max-width: 880px) {
      .links {
        display: none;
      }
      .burger {
        display: inline-flex;
      }
    }
    @media (max-width: 520px) {
      .cta {
        display: none;
      }
      .row {
        gap: 8px;
      }
    }
  `,
})
export class SiteHeader {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly langs = LANGS;
  protected readonly names = LANG_NAMES;

  protected setLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }
}
