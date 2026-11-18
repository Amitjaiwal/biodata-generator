import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { I18nService } from '../core/i18n/i18n.service';
import { TEMPLATES } from '../templates/registry';

const COUNT = 14;
const FREE_COUNT = TEMPLATES.filter((x) => x.tier === 'free').length;

export interface FaqItem {
  q: string;
  a: string;
}

/** Builds the FAQ in the current site language. Also used for FAQPage structured data. */
export function faqItems(t: I18nService['t']): FaqItem[] {
  const items: FaqItem[] = [];
  for (let i = 1; i <= COUNT; i++) items.push({ q: t('faq.q' + i), a: t('faq.a' + i, { free: FREE_COUNT }) });
  return items;
}

@Component({
  selector: 'app-faq-list',
  imports: [MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-accordion>
      @for (item of items(); track $index) {
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>{{ item.q }}</mat-panel-title>
          </mat-expansion-panel-header>
          <p>{{ item.a }}</p>
        </mat-expansion-panel>
      }
    </mat-accordion>
  `,
  styles: `
    :host {
      display: block;
      max-width: 780px;
      margin: 0 auto;
    }
    mat-expansion-panel {
      --mat-expansion-container-shape: 14px;
      margin-bottom: 10px;
      border: 1px solid var(--sp-border);
      box-shadow: none !important;
    }
    mat-panel-title {
      font-weight: 600;
    }
    mat-expansion-panel-header {
      height: auto;
      min-height: 56px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    p {
      color: #4a423c;
    }
  `,
})
export class FaqList {
  private readonly i18n = inject(I18nService);
  protected readonly items = computed(() => faqItems(this.i18n.t));
}
