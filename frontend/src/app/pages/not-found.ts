import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container box">
      <p class="code">404</p>
      <h1>{{ t('nf.title') }}</h1>
      <p class="muted">{{ t('nf.sub') }}</p>
      <div class="actions">
        <a matButton="filled" class="btn-lg" routerLink="/">{{ t('nf.home') }}</a>
        <a matButton="outlined" class="btn-lg" routerLink="/templates">{{ t('nav.templates') }}</a>
      </div>
    </section>
  `,
  styles: `
    .box {
      padding-top: 90px;
      padding-bottom: 110px;
      text-align: center;
    }
    .code {
      color: var(--sp-primary);
      font-family: var(--sp-display);
      font-size: 4.5rem;
      font-weight: 700;
      line-height: 1;
    }
    h1 {
      margin: 10px 0;
      font-size: 2rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 26px;
    }
  `,
})
export class NotFound {
  protected readonly t = inject(I18nService).t;

  constructor() {
    inject(SeoService).set({
      title: 'Page not found | ShubhPatra',
      description: 'This page does not exist.',
      path: '/404',
      noindex: true,
    });
  }
}
