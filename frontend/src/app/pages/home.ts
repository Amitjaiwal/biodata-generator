import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { I18nService } from '../core/i18n/i18n.service';
import { TemplateDefinition } from '../core/models/template.model';
import { PricingService } from '../core/services/pricing.service';
import { SITE_NAME, SeoService } from '../core/services/seo.service';
import { FaqList } from '../shared/faq-list';
import { PricingCards } from '../shared/pricing-cards';
import { TemplateCard } from '../shared/template-card';
import { TemplateThumb } from '../shared/template-thumb';
import { TEMPLATES, findTemplate, templatesIn } from '../templates/registry';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, TemplateCard, TemplateThumb, PricingCards, FaqList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="container hero-grid">
        <div class="copy">
          <span class="badge"><mat-icon>verified_user</mat-icon>{{ t('home.hero.badge') }}</span>
          <h1>{{ t('home.hero.title') }}</h1>
          <p class="sub">{{ t('home.hero.sub', { n: total }) }}</p>
          <div class="cta">
            <a matButton="filled" class="btn-lg" routerLink="/create">{{ t('home.hero.cta1') }}</a>
            <a matButton="outlined" class="btn-lg" routerLink="/templates">{{ t('home.hero.cta2') }}</a>
          </div>
          <ul class="trust">
            <li><mat-icon>check_circle</mat-icon>{{ t('home.hero.t1') }}</li>
            <li><mat-icon>check_circle</mat-icon>{{ t('home.hero.t2') }}</li>
            <li><mat-icon>check_circle</mat-icon>{{ t('home.hero.t3') }}</li>
          </ul>
        </div>
        <div class="stack" aria-hidden="true">
          <app-template-thumb class="sheet s1" [def]="hero[0]" lazy="idle" />
          <app-template-thumb class="sheet s2" [def]="hero[1]" lazy="idle" />
          <app-template-thumb class="sheet s3" [def]="hero[2]" lazy="idle" />
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container stats-grid">
        <div><strong>{{ total }}</strong><span>{{ t('stat.designs') }}</span></div>
        <div><strong>{{ free }}</strong><span>{{ t('stat.free') }}</span></div>
        <div><strong>3</strong><span>{{ t('stat.langs') }}</span></div>
        <div><strong>₹0</strong><span>{{ t('stat.price') }}</span></div>
      </div>
    </section>

    <section class="section" id="free-biodata-maker">
      <div class="container intro">
        <h2>{{ t('home.intro.title') }}</h2>
        <p>{{ t('home.intro.p1') }}</p>
        <p>{{ t('home.intro.p2', { n: total, free: free }) }}</p>
        <p class="more-link">
          <a routerLink="/free-marriage-biodata-maker">{{ t('home.intro.link') }}</a>
        </p>
      </div>
    </section>

    <section class="section" id="templates">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.featured.eyebrow') }}</span>
          <h2>{{ t('home.featured.title') }}</h2>
          <p>{{ t('home.featured.sub') }}</p>
          <p>{{ t('home.featured.more') }}</p>
        </div>
        <div class="tpl-grid">
          @for (def of featured; track def.id) {
            <app-template-card [def]="def" (preview)="preview($event)" />
          }
        </div>
        <div class="center">
          <a matButton="tonal" class="btn-lg" routerLink="/templates">
            {{ t('home.featured.all') }}<mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </a>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="communities">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.comm.eyebrow') }}</span>
          <h2>{{ t('home.comm.title') }}</h2>
          <p>{{ t('home.comm.sub') }}</p>
        </div>
        <div class="comm-grid">
          @for (c of communities; track c.cat) {
            <a class="comm" [routerLink]="['/templates', c.cat]">
              <app-template-thumb class="comm-thumb" [def]="c.def" />
              <span class="comm-text">
                <strong>{{ t('cat.' + c.cat) }}</strong>
                <span>{{ t('home.comm.' + c.cat) }}</span>
                <em>{{ t('home.comm.cta') }}<mat-icon>arrow_forward</mat-icon></em>
              </span>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="section" id="how-it-works">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.how.eyebrow') }}</span>
          <h2>{{ t('home.how.title') }}</h2>
        </div>
        <ol class="steps">
          @for (s of steps; track s.n) {
            <li class="card">
              <span class="num">{{ s.n }}</span>
              <mat-icon>{{ s.icon }}</mat-icon>
              <h3>{{ t('home.how.s' + s.n + '.t') }}</h3>
              <p>{{ t('home.how.s' + s.n + '.d') }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section section-alt" id="biodata-format">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.format.eyebrow') }}</span>
          <h2>{{ t('home.format.title') }}</h2>
          <p>{{ t('home.format.sub') }}</p>
        </div>
        <div class="format-grid">
          @for (n of formatItems; track n) {
            <div class="format-item">
              <h3>{{ t('home.format.' + n + '.t') }}</h3>
              <p>{{ t('home.format.' + n + '.d') }}</p>
            </div>
          }
        </div>
        <ul class="format-links">
          <li><a routerLink="/marriage-biodata-format">{{ t('home.format.guide') }}</a></li>
          <li><a routerLink="/marriage-biodata-for-bride">{{ t('home.format.bride') }}</a></li>
          <li><a routerLink="/marriage-biodata-for-groom">{{ t('home.format.groom') }}</a></li>
          <li><a routerLink="/hindu-marriage-biodata">{{ t('home.format.hindu') }}</a></li>
        </ul>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.features.eyebrow') }}</span>
          <h2>{{ t('home.features.title') }}</h2>
        </div>
        <div class="features">
          @for (f of features; track f.n) {
            <div class="feature">
              <span class="icon"><mat-icon>{{ f.icon }}</mat-icon></span>
              <div>
                <h3>{{ t('home.f' + f.n + '.t') }}</h3>
                <p>{{ t('home.f' + f.n + '.d') }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="trust-band" id="trust">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.trust.eyebrow') }}</span>
          <h2>{{ t('home.trust.title') }}</h2>
          <p>{{ t('home.trust.sub') }}</p>
        </div>
        <div class="trust-grid">
          @for (x of trustItems; track x.n) {
            <div class="trust-item">
              <span class="icon"><mat-icon>{{ x.icon }}</mat-icon></span>
              <h3>{{ t('home.trust.' + x.n + '.t') }}</h3>
              <p>{{ t('home.trust.' + x.n + '.d') }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section section-alt" id="pricing">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('home.pricing.eyebrow') }}</span>
          <h2>{{ t('home.pricing.title') }}</h2>
          <p>{{ t('home.pricing.sub') }}</p>
        </div>
        <app-pricing-cards />
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('home.faq.title') }}</h2>
        </div>
        <app-faq-list />
      </div>
    </section>

    <section class="closing">
      <div class="container">
        <h2>{{ t('home.cta.title') }}</h2>
        <p>{{ t('home.cta.sub') }}</p>
        <a matButton="filled" class="btn-lg light" routerLink="/create">{{ t('home.hero.cta1') }}</a>
      </div>
    </section>

    <div class="sticky-cta">
      <a matButton="filled" class="btn-lg" routerLink="/create">{{ t('home.hero.cta1') }}</a>
    </div>
  `,
  styles: `
    .hero {
      overflow: hidden;
      background: var(--sp-bg);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: 40px;
      align-items: center;
      padding-top: 64px;
      padding-bottom: 72px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: 1px solid var(--sp-border);
      border-radius: 999px;
      background: #fff;
      color: var(--sp-primary-dark);
      font-size: 0.82rem;
      font-weight: 600;
    }
    .badge mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }
    h1 {
      margin-top: 18px;
      font-size: clamp(2.1rem, 4.6vw, 3.5rem);
      line-height: 1.1;
    }
    .sub {
      max-width: 540px;
      margin-top: 18px;
      color: #4a423c;
      font-size: 1.12rem;
    }
    .cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }
    .trust {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 22px;
      margin: 26px 0 0;
      padding: 0;
      color: #4a423c;
      font-size: 0.92rem;
      list-style: none;
    }
    .trust li {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .trust mat-icon {
      width: 18px;
      height: 18px;
      color: var(--sp-success);
      font-size: 18px;
    }

    .stack {
      position: relative;
      height: 500px;
    }
    .sheet {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 290px;
      margin: -205px 0 0 -145px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: var(--sp-shadow-lg);
    }
    .s1 {
      transform: translate(-150px, 18px) rotate(-8deg);
    }
    .s2 {
      z-index: 1;
      transform: translate(150px, 18px) rotate(8deg);
    }
    .s3 {
      z-index: 2;
      width: 310px;
      margin: -225px 0 0 -155px;
    }

    .stats {
      border-top: 1px solid var(--sp-border);
      border-bottom: 1px solid var(--sp-border);
      background: #fff;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding-top: 22px;
      padding-bottom: 22px;
      text-align: center;
    }
    .stats strong {
      display: block;
      font-family: var(--sp-display);
      font-size: 1.9rem;
      font-weight: 600;
      line-height: 1.2;
    }
    .stats span {
      color: var(--sp-muted);
      font-size: 0.88rem;
    }

    .tpl-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }
    .center {
      margin-top: 34px;
      text-align: center;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .steps li {
      position: relative;
      padding: 28px 26px;
    }
    .steps mat-icon {
      width: 36px;
      height: 36px;
      color: var(--sp-primary);
      font-size: 36px;
    }
    .num {
      position: absolute;
      top: 18px;
      right: 22px;
      color: #eadfd3;
      font-family: var(--sp-display);
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
    }
    .steps h3,
    .feature h3 {
      margin: 12px 0 6px;
      font-family: var(--sp-font);
      font-size: 1.1rem;
      font-weight: 600;
    }
    .steps p,
    .feature p {
      color: var(--sp-muted);
      font-size: 0.96rem;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 30px 34px;
    }
    .feature {
      display: flex;
      gap: 16px;
    }
    .feature h3 {
      margin-top: 2px;
    }
    .icon {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: var(--sp-primary-soft);
      color: var(--sp-primary);
    }

    .closing {
      padding: 64px 0;
      background: var(--sp-primary-dark);
      color: #fff;
      text-align: center;
    }
    .closing h2 {
      color: #fff;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
    }
    .closing p {
      margin: 10px 0 24px;
      color: rgba(255, 255, 255, 0.85);
    }
    .light {
      --mat-button-filled-container-color: #fff;
      --mat-button-filled-label-text-color: var(--sp-primary-dark);
    }

    .sticky-cta {
      display: none;
    }

    @media (max-width: 1000px) {
      .tpl-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .features {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 860px) {
      .hero-grid {
        grid-template-columns: 1fr;
        padding-top: 40px;
        padding-bottom: 36px;
      }
      .stack {
        height: 360px;
      }
      .sheet {
        width: 190px;
        margin: -134px 0 0 -95px;
      }
      .s3 {
        width: 206px;
        margin: -146px 0 0 -103px;
      }
      .s1 {
        transform: translate(-96px, 14px) rotate(-8deg);
      }
      .s2 {
        transform: translate(96px, 14px) rotate(8deg);
      }
      .steps {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .features {
        grid-template-columns: 1fr;
      }
      .tpl-grid {
        gap: 12px;
      }
      .cta > * {
        flex: 1 1 100%;
      }
      .sticky-cta {
        position: sticky;
        bottom: 0;
        z-index: 40;
        display: block;
        padding: 10px 16px;
        border-top: 1px solid var(--sp-border);
        background: rgba(255, 255, 255, 0.96);
      }
      .sticky-cta a {
        width: 100%;
      }
    }
    .comm-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .comm {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      border: 1px solid var(--sp-border);
      border-radius: var(--sp-radius);
      background: #fff;
      color: var(--sp-ink);
      text-decoration: none;
      transition:
        border-color 0.15s ease,
        transform 0.15s ease;
    }
    .comm:hover {
      border-color: var(--sp-primary);
      transform: translateY(-2px);
    }
    .comm-thumb {
      flex: none;
      width: 68px;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(31, 26, 23, 0.25);
    }
    .comm-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      font-size: 0.85rem;
    }
    .comm-text strong {
      font-size: 1rem;
    }
    .comm-text > span {
      color: var(--sp-muted);
    }
    .comm-text em {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      margin-top: 4px;
      color: var(--sp-primary);
      font-style: normal;
      font-weight: 600;
    }
    .comm-text em mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }
    .intro {
      max-width: 860px;
    }
    .intro h2 {
      font-size: clamp(1.6rem, 3.2vw, 2.2rem);
    }
    .intro p {
      margin-top: 14px;
      color: #4a423c;
      font-size: 1.05rem;
    }
    .more-link a,
    .format-links a {
      color: var(--sp-primary);
      font-weight: 600;
      text-underline-offset: 3px;
    }
    .format-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .format-item {
      padding: 20px 22px;
      border: 1px solid var(--sp-border);
      border-radius: var(--sp-radius);
      background: #fff;
    }
    .format-item h3 {
      font-family: var(--sp-font);
      font-size: 1.05rem;
      font-weight: 600;
    }
    .format-item p {
      margin-top: 6px;
      color: var(--sp-muted);
      font-size: 0.93rem;
    }
    .format-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 22px;
      margin: 26px 0 0;
      padding: 0;
      list-style: none;
    }
    .trust-band {
      padding: 72px 0;
      border-top: 1px solid var(--sp-border);
    }
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }
    .trust-item {
      padding: 22px 20px;
      border: 1px solid var(--sp-border);
      border-radius: var(--sp-radius);
      background: var(--sp-bg);
    }
    .trust-item .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--sp-primary-soft);
      color: var(--sp-primary);
    }
    .trust-item h3 {
      margin-top: 14px;
      font-family: var(--sp-font);
      font-size: 1.02rem;
      font-weight: 600;
    }
    .trust-item p {
      margin-top: 6px;
      color: var(--sp-muted);
      font-size: 0.92rem;
    }
    @media (max-width: 1000px) {
      .comm-grid,
      .trust-grid,
      .format-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 620px) {
      .comm-grid,
      .trust-grid,
      .format-grid {
        grid-template-columns: 1fr;
      }
      .trust-band {
        padding: 48px 0;
      }
    }
  `,
})
export class Home {
  private readonly i18n = inject(I18nService);
  private readonly dialog = inject(MatDialog);
  protected readonly t = this.i18n.t;

  protected readonly total = TEMPLATES.length;
  protected readonly free = TEMPLATES.filter((x) => x.tier === 'free').length;
  /** A hand-picked mix for the home page: gold, marigold, magenta, Sikh, bride, groom, Marathi and classic Hindu. */
  protected readonly featured = ['zarika', 'haldi', 'rani', 'nishan', 'blush', 'dapper', 'paithani', 'mangal'].map(findTemplate);
  protected readonly hero = [findTemplate('haldi'), findTemplate('neelmahal'), findTemplate('zarika')];
  protected readonly communities = (
    ['hindu', 'marathi', 'muslim', 'sikh', 'christian', 'jain', 'bride', 'groom'] as const
  ).map((cat) => ({ cat, def: templatesIn(cat)[0] }));
  protected readonly trustItems = [
    { n: 1, icon: 'devices' },
    { n: 2, icon: 'no_accounts' },
    { n: 3, icon: 'verified_user' },
    { n: 4, icon: 'print' },
  ];
  protected readonly steps = [
    { n: 1, icon: 'grid_view' },
    { n: 2, icon: 'edit_note' },
    { n: 3, icon: 'school' },
    { n: 4, icon: 'family_restroom' },
    { n: 5, icon: 'tune' },
    { n: 6, icon: 'download_for_offline' },
  ];
  protected readonly formatItems = [1, 2, 3, 4, 5, 6];
  protected readonly features = [
    { n: 1, icon: 'visibility' },
    { n: 2, icon: 'swap_horiz' },
    { n: 3, icon: 'translate' },
    { n: 4, icon: 'crop' },
    { n: 5, icon: 'tune' },
    { n: 6, icon: 'shield' },
  ];

  constructor() {
    const seo = inject(SeoService);
    const pricing = inject(PricingService);
    pricing.load();

    effect(() => {
      seo.set({
        title: 'Free Marriage Biodata Maker Online – Create Biodata | ShubhPatra',
        description:
          'Create your marriage biodata online for free with ShubhPatra. Choose beautiful marriage biodata templates, customize your details and download your biodata as PDF.',
        path: '/',
        jsonLd: [
          // The site name and logo, which search engines can use in results.
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': environment.siteUrl + '/#website',
            name: SITE_NAME,
            alternateName: ['Free Marriage Biodata Maker Online'],
            url: environment.siteUrl + '/',
            inLanguage: ['en', 'hi', 'mr'],
            publisher: { '@id': environment.siteUrl + '/#organization' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': environment.siteUrl + '/#organization',
            name: SITE_NAME,
            url: environment.siteUrl + '/',
            logo: { '@type': 'ImageObject', url: environment.siteUrl + '/icon-512.png', width: 512, height: 512 },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ShubhPatra Marriage Biodata Maker',
            url: environment.siteUrl + '/',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            inLanguage: ['en', 'hi', 'mr'],
            description: 'Online marriage biodata maker with free and premium templates and PDF download.',
            offers: [
              { '@type': 'Offer', name: 'Free templates', price: '0', priceCurrency: 'INR' },
              {
                '@type': 'Offer',
                name: 'Premium download',
                price: String(pricing.product('PREMIUM_SINGLE').amount / 100),
                priceCurrency: 'INR',
              },
              {
                '@type': 'Offer',
                name: 'Premium collection',
                price: String(pricing.product('PREMIUM_COLLECTION').amount / 100),
                priceCurrency: 'INR',
              },
            ],
          },
        ],
      });
    });
  }

  protected async preview(def: TemplateDefinition): Promise<void> {
    const { TemplatePreviewDialog } = await import('../shared/template-preview-dialog');
    this.dialog.open(TemplatePreviewDialog, {
      data: { def, list: this.featured },
      width: '640px',
      maxWidth: '96vw',
      autoFocus: 'dialog',
    });
  }
}
