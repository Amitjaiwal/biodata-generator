import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CATEGORY_SEO } from '../core/data/site';
import { I18nService } from '../core/i18n/i18n.service';
import { TEMPLATE_CATEGORIES, TemplateCategory, TemplateDefinition, TemplateTier } from '../core/models/template.model';
import { SeoService } from '../core/services/seo.service';
import { TemplateCard } from '../shared/template-card';
import { TEMPLATES, templatesIn } from '../templates/registry';

type TierFilter = 'all' | TemplateTier;

/** Template gallery. Each category has its own URL so it can be found through search. */
@Component({
  selector: 'app-templates',
  imports: [RouterLink, MatButtonModule, MatIconModule, TemplateCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="top">
      <div class="container">
        <h1>{{ heading() }}</h1>
        <p class="sub">{{ category() ? intro() : t('gallery.sub', { n: total }) }}</p>

        <nav class="chips" aria-label="Categories">
          <a routerLink="/templates" [queryParams]="tierParams()" [class.on]="!category()">{{ t('gallery.all') }}</a>
          @for (c of categories; track c) {
            <a [routerLink]="['/templates', c]" [queryParams]="tierParams()" [class.on]="category() === c">
              {{ t('cat.' + c) }}
            </a>
          }
        </nav>

        <div class="bar">
          <div class="tiers" role="group" aria-label="Price">
            @for (x of tiers; track x) {
              <a
                [routerLink]="[]"
                [queryParams]="{ tier: x === 'all' ? null : x }"
                queryParamsHandling="merge"
                [class.on]="tier() === x"
                [attr.aria-current]="tier() === x ? 'true' : null"
              >
                {{ x === 'all' ? t('gallery.all') : x === 'free' ? t('common.free') : t('common.premium') }}
              </a>
            }
          </div>
          <span class="count">{{ t('gallery.count', { n: list().length }) }}</span>
        </div>
      </div>
    </section>

    <section class="container grid-wrap">
      <div class="grid">
        @for (def of list(); track def.id) {
          <app-template-card [def]="def" (preview)="preview($event)" />
        }
      </div>
      @if (!list().length) {
        <p class="empty">
          <a matButton="tonal" routerLink="/templates">{{ t('home.featured.all') }}</a>
        </p>
      }
    </section>
  `,
  styles: `
    .top {
      padding: 44px 0 18px;
      background: var(--sp-bg);
    }
    h1 {
      font-size: clamp(1.8rem, 3.6vw, 2.6rem);
    }
    .sub {
      max-width: 720px;
      margin-top: 10px;
      color: var(--sp-muted);
      font-size: 1.05rem;
    }
    .chips {
      display: flex;
      gap: 8px;
      margin: 24px -20px 0;
      padding: 0 20px 6px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chips a,
    .tiers a {
      flex: none;
      padding: 8px 16px;
      border: 1px solid var(--sp-border);
      border-radius: 999px;
      background: #fff;
      color: var(--sp-ink);
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
    }
    .chips a.on {
      border-color: var(--sp-primary);
      background: var(--sp-primary);
      color: #fff;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 16px;
    }
    .tiers {
      display: inline-flex;
      padding: 3px;
      border: 1px solid var(--sp-border);
      border-radius: 999px;
      background: #fff;
    }
    .tiers a {
      padding: 6px 14px;
      border: 0;
      font-size: 0.85rem;
    }
    .tiers a.on {
      background: var(--sp-ink);
      color: #fff;
    }
    .count {
      color: var(--sp-muted);
      font-size: 0.9rem;
    }
    .grid-wrap {
      padding-top: 28px;
      padding-bottom: 72px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }
    .empty {
      padding: 40px 0;
      text-align: center;
    }
    @media (max-width: 1000px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
    }
  `,
})
export class Templates {
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  protected readonly t = inject(I18nService).t;

  protected readonly categories = TEMPLATE_CATEGORIES;
  protected readonly tiers: TierFilter[] = ['all', 'free', 'premium'];
  protected readonly total = TEMPLATES.length;

  protected readonly category = toSignal(
    this.route.paramMap.pipe(
      map((p) => {
        const c = p.get('category');
        return c && (TEMPLATE_CATEGORIES as readonly string[]).includes(c) ? (c as TemplateCategory) : null;
      }),
    ),
    { initialValue: null },
  );

  protected readonly tier = toSignal(
    this.route.queryParamMap.pipe(
      map((q): TierFilter => {
        const v = q.get('tier');
        return v === 'free' || v === 'premium' ? v : 'all';
      }),
    ),
    { initialValue: 'all' as TierFilter },
  );

  protected readonly list = computed(() => {
    const tier = this.tier();
    return templatesIn(this.category() ?? 'all').filter((x) => tier === 'all' || x.tier === tier);
  });

  protected readonly heading = computed(() => {
    const c = this.category();
    return c ? CATEGORY_SEO[c].h1 : this.t('gallery.title');
  });

  protected readonly intro = computed(() => {
    const c = this.category();
    return c ? CATEGORY_SEO[c].description : '';
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const c = this.category();
      const path = c ? `/templates/${c}` : '/templates';
      const names = templatesIn(c ?? 'all');
      seo.set({
        title: c ? CATEGORY_SEO[c].title : 'Marriage Biodata Templates: 20 Free and Premium Designs | ShubhPatra',
        description: c
          ? CATEGORY_SEO[c].description
          : 'Browse 20 original marriage biodata templates: traditional, modern, royal, minimal, floral, Hindu, Muslim, Jain and Marathi designs. Free and premium.',
        path,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: c ? CATEGORY_SEO[c].h1 : 'Marriage Biodata Templates',
            url: environment.siteUrl + path,
            numberOfItems: names.length,
            itemListElement: names.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name })),
          },
        ],
      });
    });
  }

  protected tierParams(): { tier: string | null } {
    const tier = this.tier();
    return { tier: tier === 'all' ? null : tier };
  }

  protected async preview(def: TemplateDefinition): Promise<void> {
    const { TemplatePreviewDialog } = await import('../shared/template-preview-dialog');
    this.dialog.open(TemplatePreviewDialog, { data: def, width: '640px', maxWidth: '96vw', autoFocus: 'dialog' });
  }
}
