import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';
import { EntitlementService } from './core/services/entitlement.service';
import { SiteFooter } from './shared/site-footer';
import { SiteHeader } from './shared/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">{{ t('a11y.skip') }}</a>
    <app-site-header />
    <main id="main"><router-outlet /></main>
    <app-site-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
    .skip {
      position: absolute;
      top: -60px;
      left: 12px;
      z-index: 100;
      padding: 10px 16px;
      border-radius: 8px;
      background: var(--sp-ink);
      color: #fff;
    }
    .skip:focus {
      top: 12px;
    }
  `,
})
export class App {
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  constructor() {
    const i18n = this.i18n;
    const entitlements = inject(EntitlementService);
    // Saved preferences are applied after hydration so server and client markup match.
    afterNextRender(() => {
      i18n.restore();
      entitlements.restore();
    });
  }
}
