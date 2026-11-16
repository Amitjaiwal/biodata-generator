import { ChangeDetectionStrategy, Component, Directive, computed, input } from '@angular/core';
import { SymbolKey } from '../../core/models/biodata.model';
import { PageModel, RenderBlock, RenderModel } from '../../core/models/render.model';
import { crescent, cross, cssUrl, diya, jainHand, kalash, lotus } from './ornaments';

const INDIC = /[ऀ-ॿ਀-੿؀-ۿ]/;

/**
 * Contract every design implements. The preview engine supplies the localized model and
 * the blocks for one page; the design only decides how they look.
 */
@Directive({
  host: {
    class: 'bd-page',
    '[attr.lang]': 'model().lang',
    '[class.bd-first]': 'page().first',
    '[class.bd-next]': '!page().first',
    '[class.bd-no-photo]': '!model().photo',
  },
})
export abstract class TemplateBase {
  readonly model = input.required<RenderModel>();
  readonly page = input.required<PageModel>();

  /** True when the heading is in a complex script, so designs can drop letter-spacing. */
  protected readonly titleIndic = computed(() => INDIC.test(this.model().title));
  protected readonly nameIndic = computed(() => INDIC.test(this.model().name));
  /** True for long names, so designs with a big display name can step the size down. */
  protected readonly nameLong = computed(() => this.model().name.length > 26);
}

/**
 * Renders a flow of sections. Markup is identical for every design; the design's stylesheet
 * turns it into rows, grids, tables or cards. `data-*` hooks are read by the paginator.
 */
@Component({
  selector: 'bd-sections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bd-flow', '[attr.data-flow]': 'flow()' },
  template: `
    @for (b of blocks(); track b.id) {
      <section class="bd-sec" [class]="'bd-sec-' + b.key" [attr.data-block]="b.id">
        <div class="bd-sec-title" [class.indic]="indic(b.title)"><span>{{ b.title }}</span></div>
        <div class="bd-rows">
          @for (r of b.rows; track r.id) {
            <div class="bd-row" data-row [class.bd-long]="r.long">
              <span class="bd-l" [class.indic]="indic(r.label)">{{ r.label }}</span>
              <span class="bd-sep">{{ sep() }}</span>
              <span class="bd-v">{{ r.value }}</span>
            </div>
          }
        </div>
      </section>
    }
  `,
})
export class BdSections {
  readonly blocks = input.required<RenderBlock[]>();
  readonly flow = input<'main' | 'side'>('main');
  readonly sep = input(':');

  protected indic(text: string): boolean {
    return INDIC.test(text);
  }
}

const TEXT_SYMBOLS: Partial<Record<SymbolKey, string>> = { om: 'ॐ', shree: 'श्री', ikonkar: 'ੴ' };

/** Sacred symbol shown at the top of a biodata. Size follows the font-size of the host. */
@Component({
  selector: 'bd-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bd-symbol', '[class.bd-symbol-none]': "symbol() === 'none'", '[style.color]': 'color()' },
  template: `
    @if (text(); as t) {
      <span class="bd-symbol-text">{{ t }}</span>
    } @else if (src(); as s) {
      <img class="bd-symbol-img" [src]="s" alt="" />
    }
  `,
})
export class BdSymbol {
  readonly symbol = input.required<SymbolKey>();
  readonly color = input('#8a1c1c');
  readonly accent = input('#c9a227');

  protected readonly text = computed(() => TEXT_SYMBOLS[this.symbol()] ?? null);
  protected readonly src = computed(() => {
    const c = this.color();
    const a = this.accent();
    switch (this.symbol()) {
      case 'kalash':
        return kalash(c, a, '#3f7d3a');
      case 'lotus':
        return lotus(c, a);
      case 'diya':
        return diya(c, a);
      case 'crescent':
        return crescent(c);
      case 'cross':
        return cross(c);
      case 'jain':
        return jainHand(c, '#ffffff');
      default:
        return null;
    }
  });
}

/** Profile photo drawn as a cover background so every frame shape crops it cleanly. */
@Component({
  selector: 'bd-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bd-photo', role: 'img', '[style.background-image]': 'bg()' },
  template: '',
})
export class BdPhoto {
  readonly src = input.required<string>();
  protected readonly bg = computed(() => cssUrl(this.src()));
}

/** Slim header for continuation pages: name on the left, page number on the right. */
@Component({
  selector: "bd-cont",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "bd-cont" },
  template: `<span>{{ model().name }}</span><span>{{ page().index + 1 }} / {{ page().total }}</span>`,
})
export class BdCont {
  readonly model = input.required<RenderModel>();
  readonly page = input.required<PageModel>();
}

export const TEMPLATE_IMPORTS = [BdSections, BdSymbol, BdPhoto, BdCont] as const;
