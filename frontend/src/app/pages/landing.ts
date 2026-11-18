import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LANDINGS, Landing, findLanding } from '../core/data/landings';
import { I18nService } from '../core/i18n/i18n.service';
import { TemplateDefinition } from '../core/models/template.model';
import { SeoService } from '../core/services/seo.service';
import { RichText } from '../shared/rich-text';
import { TemplateCard } from '../shared/template-card';
import { TEMPLATES, templatesIn } from '../templates/registry';

/** Search landing page for a community, a language, a bride or groom, or the general format guide. */
@Component({
  selector: 'app-landing',
  imports: [RouterLink, MatButtonModule, TemplateCard, RichText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (page(); as p) {
      <section class="top" [attr.lang]="p.lang">
        <div class="container">
          <h1>{{ p.h1 }}</h1>
          <p class="intro"><app-rich [text]="p.intro" /></p>
          <div class="cta">
            <a matButton="filled" class="btn-lg" routerLink="/create">{{ p.cta }}</a>
            <a matButton="outlined" class="btn-lg" [routerLink]="p.category ? ['/templates', p.category] : '/templates'">
              {{ t('home.hero.cta2') }}
            </a>
          </div>
        </div>
      </section>

      <section class="section" [attr.lang]="p.lang">
        <div class="container">
          <h2 class="grid-h">{{ p.gridHeading }}</h2>
          <div class="grid">
            @for (def of designs(); track def.id) {
              <app-template-card [def]="def" (preview)="preview($event)" />
            }
          </div>
        </div>
      </section>

      <section class="section section-alt" [attr.lang]="p.lang">
        <div class="container prose">
          @for (s of p.sections; track s.heading) {
            <h2>{{ s.heading }}</h2>
            @for (para of s.body ?? []; track para) {
              <p><app-rich [text]="para" /></p>
            }
            @if (s.list; as items) {
              <ul>
                @for (item of items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
            @for (item of s.items ?? []; track item.title) {
              <h3>{{ item.title }}</h3>
              <p><app-rich [text]="item.text" /></p>
            }
          }
          <p class="end"><a matButton="filled" class="btn-lg" routerLink="/create">{{ p.cta }}</a></p>

          <nav class="related" [attr.aria-label]="t('landing.related')">
            <h2>{{ t('landing.related') }}</h2>
            <ul>
              @for (r of related(); track r.slug) {
                <li>
                  <a [routerLink]="'/' + r.slug" [attr.lang]="r.lang">{{ r.navLabel }}</a>
                </li>
              }
              <li>
                <a routerLink="/templates">{{ t('landing.allTemplates') }}</a>
              </li>
              <li>
                <a routerLink="/">{{ t('landing.home') }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    }
  `,
  styles: `
    .top {
      padding: 56px 0 48px;
      background: var(--sp-bg);
    }
    h1 {
      max-width: 820px;
      font-size: clamp(2rem, 4.4vw, 3rem);
    }
    .intro {
      max-width: 720px;
      margin-top: 16px;
      color: #4a423c;
      font-size: 1.1rem;
    }
    .cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 26px;
    }
    .grid-h {
      margin-bottom: 26px;
      font-size: clamp(1.5rem, 3vw, 2rem);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }
    .prose h2:first-child {
      margin-top: 0;
    }
    .prose h3 {
      margin: 1.2em 0 0.3em;
      font-family: var(--sp-font);
      font-size: 1.08rem;
      font-weight: 600;
    }
    .prose h3 + p {
      margin-top: 0;
    }
    .prose ul {
      padding-left: 1.2em;
    }
    .prose li {
      margin: 0.35em 0;
    }
    .end {
      margin-top: 28px;
    }
    .related {
      margin-top: 44px;
      padding-top: 8px;
      border-top: 1px solid var(--sp-border);
    }
    .related ul {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 10px;
      margin: 12px 0 0;
      padding: 0;
      list-style: none;
    }
    .related li {
      margin: 0;
    }
    .related a {
      display: inline-block;
      padding: 7px 14px;
      border: 1px solid var(--sp-border);
      border-radius: 999px;
      background: #fff;
      color: var(--sp-ink);
      font-size: 0.92rem;
      text-decoration: none;
    }
    .related a:hover {
      border-color: var(--sp-primary);
      color: var(--sp-primary);
    }
    @media (max-width: 1000px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
    }
  `,
})
export class LandingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);
  private readonly dialog = inject(MatDialog);
  protected readonly t = this.i18n.t;

  protected readonly page = toSignal(this.route.data.pipe(map((d) => d['landing'] as Landing | undefined)), {
    initialValue: this.route.snapshot.data['landing'] as Landing | undefined,
  });

  protected readonly designs = computed<TemplateDefinition[]>(() => {
    const p = this.page();
    if (!p) return [];
    const base = p.category ? templatesIn(p.category) : TEMPLATES.filter((x) => x.featured);
    const list = p.tier ? base.filter((x) => x.tier === p.tier) : base;
    // Free-design pages fall back to every free design when the featured ones are few.
    const pool = p.tier && list.length < 8 ? TEMPLATES.filter((x) => x.tier === p.tier) : list;
    return pool.slice(0, 8);
  });

  protected readonly related = computed<Landing[]>(() => {
    const p = this.page();
    return (p?.related ?? []).map((slug) => findLanding(slug)).filter((x): x is Landing => !!x && x.slug !== p?.slug);
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.page();
      if (!p) return;
      // Pages written in Hindi or Marathi switch the site chrome too, unless the visitor chose a language.
      this.i18n.suggest(p.lang);
      seo.set({
        title: p.title,
        description: p.description,
        path: '/' + p.slug,
        lang: p.lang,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl + '/' },
              { '@type': 'ListItem', position: 2, name: p.h1, item: environment.siteUrl + '/' + p.slug },
            ],
          },
        ],
      });
    });
  }

  protected async preview(def: TemplateDefinition): Promise<void> {
    const { TemplatePreviewDialog } = await import('../shared/template-preview-dialog');
    this.dialog.open(TemplatePreviewDialog, {
      data: { def, list: this.designs() },
      width: '640px',
      maxWidth: '96vw',
      autoFocus: 'dialog',
    });
  }
}

export const LANDING_SLUGS = LANDINGS.map((l) => l.slug);
