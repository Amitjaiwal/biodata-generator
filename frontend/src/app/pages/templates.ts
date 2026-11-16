import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, computed, effect, inject } from '@angular/core';
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
import { EntitlementService } from '../core/services/entitlement.service';
import { PricingService } from '../core/services/pricing.service';
import { SeoService } from '../core/services/seo.service';
import { TemplateCard } from '../shared/template-card';
import { TEMPLATES, templatesIn } from '../templates/registry';

type TierFilter = 'all' | TemplateTier;

const PREMIUM_COUNT = TEMPLATES.filter((x) => x.tier === 'premium').length;

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
      </div>
    </section>

    <div class="filters">
      <div class="container">
        <nav class="chips" aria-label="Categories">
          <a routerLink="/templates" [queryParams]="tierParams()" [class.on]="!category()">{{ t('gallery.all') }}</a>
          @for (c of categories; track c) {
            <a [routerLink]="['/templates', c]" [queryParams]="tierParams()" [class.on]="category() === c">
              {{ t('cat.' + c) }}<small>{{ counts[c] }}</small>
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
          <span class="count" aria-live="polite">{{ list().length === 1 ? t('gallery.count1') : t('gallery.count', { n: list().length }) }}</span>
        </div>
      </div>
    </div>

    <section class="container grid-wrap">
      @if (showPromo()) {
        <aside class="promo">
          <mat-icon>workspace_premium</mat-icon>
          <div>
            <strong>{{ t('gallery.promo.title', { n: premiumCount, price: pricing.price('PREMIUM_COLLECTION') }) }}</strong>
            <span>{{ t('gallery.promo.sub', { single: pricing.price('PREMIUM_SINGLE') }) }}</span>
          </div>
          <a matButton="filled" routerLink="/pricing">{{ t('gallery.promo.cta') }}</a>
        </aside>
      }
      <div class="grid">
        @for (def of list(); track def.id) {
          <app-template-card [def]="def" (preview)="preview($event)" />
        }
      </div>
      @if (!list().length) {
        <div class="empty">
          <p>{{ t('gallery.empty') }}</p>
          <a matButton="tonal" routerLink="/templates">{{ t('gallery.reset') }}</a>
        </div>
      }
    </section>
  `,
  styles: `
    .top {
      padding: 44px 0 14px;
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
    .filters {
      position: sticky;
      top: var(--sp-header-h);
      z-index: 20;
      padding: 10px 0 12px;
      border-bottom: 1px solid var(--sp-border);
      background: var(--sp-bg);
    }
    .chips {
      display: flex;
      gap: 8px;
      margin: 0 -20px;
      padding: 0 20px 6px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chips::-webkit-scrollbar {
      display: none;
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
    .chips a small {
      margin-left: 6px;
      opacity: 0.6;
      font-size: 0.78rem;
    }
    .chips a:hover {
      border-color: var(--sp-primary);
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
      margin-top: 8px;
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
      padding-top: 24px;
      padding-bottom: 72px;
    }
    .promo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 22px;
      padding: 16px 20px;
      border: 1px solid #ecd9a6;
      border-radius: var(--sp-radius);
      background: #fff8e1;
    }
    .promo > mat-icon {
      flex: none;
      width: 34px;
      height: 34px;
      color: #b07a00;
      font-size: 34px;
    }
    .promo div {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }
    .promo span {
      color: #6b5a2a;
      font-size: 0.9rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }
    .empty {
      padding: 48px 0;
      text-align: center;
    }
    .empty p {
      margin-bottom: 14px;
      color: var(--sp-muted);
    }
    @media (max-width: 1000px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    @media (max-width: 720px) {
      .top {
        padding-top: 28px;
      }
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .promo {
        flex-wrap: wrap;
        padding: 12px 14px;
      }
      .promo span {
        display: none;
      }
      .promo a {
        width: 100%;
      }
    }
  `,
})
export class Templates {
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly entitlements = inject(EntitlementService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly pricing = inject(PricingService);
  protected readonly t = inject(I18nService).t;

  protected readonly categories = TEMPLATE_CATEGORIES;
  protected readonly tiers: TierFilter[] = ['all', 'free', 'premium'];
  protected readonly total = TEMPLATES.length;
  protected readonly premiumCount = PREMIUM_COUNT;
  protected readonly counts = Object.fromEntries(
    TEMPLATE_CATEGORIES.map((c) => [c, templatesIn(c).length]),
  ) as Record<TemplateCategory, number>;

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

  /** The designs to show: newest first, otherwise in catalogue order. */
  protected readonly list = computed(() => {
    const tier = this.tier();
    const found = templatesIn(this.category() ?? 'all').filter((x) => tier === 'all' || x.tier === tier);
    return [...found].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  });

  /** Nudge towards the collection while someone is browsing premium designs. */
  protected readonly showPromo = computed(
    () => this.tier() !== 'free' && this.list().some((x) => x.tier === 'premium') && !this.entitlements.hasCollection(),
  );

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
    this.pricing.load();
    // On a phone the category row scrolls sideways; bring the chosen category into view.
    effect(() => {
      this.category();
      if (!this.browser) return;
      setTimeout(() => {
        this.host.nativeElement.querySelector('.chips a.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
      }, 0);
    });
    effect(() => {
      const c = this.category();
      const path = c ? `/templates/${c}` : '/templates';
      const names = templatesIn(c ?? 'all');
      const name = c ? CATEGORY_SEO[c].h1 : 'Marriage Biodata Templates';
      seo.set({
        title: c ? CATEGORY_SEO[c].title : `Marriage Biodata Templates: ${TEMPLATES.length} Free and Premium Designs | ShubhPatra`,
        description: c
          ? CATEGORY_SEO[c].description
          : `Browse ${TEMPLATES.length} original marriage biodata templates: royal, gold, traditional, Hindu, Marathi, Muslim, Sikh, Christian, Jain, modern bride and groom designs. Free and premium, with PDF download.`,
        path,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name,
            url: environment.siteUrl + path,
            numberOfItems: names.length,
            itemListElement: names.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl + '/' },
              { '@type': 'ListItem', position: 2, name: 'Templates', item: environment.siteUrl + '/templates' },
              ...(c ? [{ '@type': 'ListItem', position: 3, name, item: environment.siteUrl + path }] : []),
            ],
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
    this.dialog.open(TemplatePreviewDialog, {
      data: { def, list: this.list() },
      width: '640px',
      maxWidth: '96vw',
      autoFocus: 'dialog',
    });
  }
}
