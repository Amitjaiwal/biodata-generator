import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { PageModel, RenderModel } from '../../core/models/render.model';
import { TemplateDefinition } from '../../core/models/template.model';
import { BlockMetric, paginateFlow, splitFlows, toPageModels } from '../render/paginate';

export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
const PAGE_GAP = 24;
const MIN_FIT_SCALE = 0.8;
const FIT_STEP = 0.04;
const MAX_CORRECTIONS = 4;

interface FlowMeasure {
  capacity: number;
  metrics: Record<string, BlockMetric>;
}

/**
 * The one preview engine shared by every design.
 *
 * It renders the chosen template twice off-screen (a first page holding every block, and an
 * empty continuation page), measures the blocks and the space each page type offers, splits
 * the content into A4 pages and renders those. The visible pages are the exact DOM that the
 * PDF exporter rasterizes, so preview and download always match.
 */
@Component({
  selector: 'app-preview-engine',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sizer" [style.width.px]="width()" [style.height.px]="height()">
      <div class="pages" #pagesEl [style.transform]="'scale(' + scale() + ')'">
        @for (p of pages(); track p.index) {
          <div class="a4" data-a4 [style.--bd-fs]="usedScale()">
            <ng-container *ngComponentOutlet="def().component; inputs: { model: model(), page: p }" />
            @if (watermark()) {
              <div class="wm" aria-hidden="true">
                @for (i of marks; track i) {
                  <span>{{ watermark() }}</span>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
    <div class="measure" #measureEl aria-hidden="true" [style.--bd-fs]="tryScale()">
      <ng-container *ngComponentOutlet="def().component; inputs: { model: model(), page: measureFirst() }" />
      <ng-container *ngComponentOutlet="def().component; inputs: { model: model(), page: measureNext }" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    .sizer {
      position: relative;
      margin: 0 auto;
    }
    .pages {
      position: absolute;
      top: 0;
      left: 0;
      width: 794px;
      transform-origin: 0 0;
    }
    .a4 {
      position: relative;
      width: 794px;
      height: 1123px;
      margin-bottom: 24px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 6px rgba(31, 26, 23, 0.1), 0 14px 40px rgba(31, 26, 23, 0.14);
    }
    .a4:last-child {
      margin-bottom: 0;
    }
    .wm {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      justify-content: space-around;
      overflow: hidden;
      pointer-events: none;
    }
    .wm span {
      flex: 0 0 50%;
      color: rgba(120, 20, 20, 0.13);
      font: 700 30px/1 'Inter', sans-serif;
      letter-spacing: 0.04em;
      text-align: center;
      white-space: nowrap;
      transform: rotate(-28deg);
    }
    .measure {
      position: absolute;
      top: 0;
      left: -10000px;
      width: 794px;
      height: 1123px;
      overflow: hidden;
      visibility: hidden;
      pointer-events: none;
    }
  `,
})
export class PreviewEngine {
  readonly model = input.required<RenderModel>();
  readonly def = input.required<TemplateDefinition>();
  /** Display zoom of the pages (1 = actual A4 size at 96 dpi). */
  readonly scale = input(1);
  /** User-chosen multiplier for template font sizes. */
  readonly fontScale = input(1);
  /** Try smaller text before spilling onto a second page. */
  readonly fitOnePage = input(false);
  /** Text repeated across the page; empty for none. */
  readonly watermark = input('');

  readonly pageCount = output<number>();

  private readonly injector = inject(Injector);
  private readonly measureEl = viewChild.required<ElementRef<HTMLElement>>('measureEl');
  private readonly pagesEl = viewChild.required<ElementRef<HTMLElement>>('pagesEl');

  protected readonly pages = signal<PageModel[]>([]);
  protected readonly tryScale = signal(1);
  protected readonly usedScale = signal(1);
  protected readonly marks = [0, 1, 2, 3, 4, 5, 6, 7];

  private readonly flows = computed(() => splitFlows(this.model().blocks, this.def().side));
  protected readonly measureFirst = computed<PageModel>(() => {
    const f = this.flows();
    return { index: 0, total: 1, first: true, main: f.main, side: f.side };
  });
  protected readonly measureNext: PageModel = { index: 1, total: 2, first: false, main: [], side: [] };

  protected readonly width = computed(() => PAGE_WIDTH * this.scale());
  protected readonly height = computed(() => {
    const n = Math.max(1, this.pages().length);
    return (n * PAGE_HEIGHT + (n - 1) * PAGE_GAP) * this.scale();
  });

  private pending = false;
  private destroyed = false;
  /** Shrinks page capacity when a rendered page still overflows after pagination. */
  private capacityFactor = 1;
  private corrections = 0;
  private fitGaveUp = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => (this.destroyed = true));

    effect(() => {
      this.model();
      this.def();
      const fontScale = this.fontScale();
      this.fitOnePage();
      untracked(() => {
        this.tryScale.set(fontScale);
        this.capacityFactor = 1;
        this.corrections = 0;
        this.fitGaveUp = false;
        this.schedule();
      });
    });

    afterNextRender(() => {
      // Web fonts change text metrics, so measure again whenever a font finishes loading.
      const fonts = document.fonts;
      const again = (): void => this.schedule();
      fonts.ready.then(again);
      fonts.addEventListener('loadingdone', again);
      destroyRef.onDestroy(() => fonts.removeEventListener('loadingdone', again));

      // The preview can be hidden (mobile edit view). Measure again once it is laid out.
      const visibility = new ResizeObserver(again);
      visibility.observe(this.measureEl().nativeElement);
      destroyRef.onDestroy(() => visibility.disconnect());
    });
  }

  /** Resolves once pagination has caught up with the latest input (or after a short timeout). */
  settled(): Promise<void> {
    return new Promise((resolve) => {
      let calm = 0;
      let frames = 0;
      const tick = (): void => {
        calm = this.pending ? 0 : calm + 1;
        if (calm >= 3 || ++frames > 120 || this.destroyed) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /** The rendered A4 page elements, in order, for the PDF exporter and printing. */
  pageElements(): HTMLElement[] {
    return Array.from(this.pagesEl().nativeElement.querySelectorAll<HTMLElement>(':scope > [data-a4]'));
  }

  /**
   * Queues one measuring pass after the next render. The microtask hop starts a fresh
   * change-detection cycle, so repeated fit attempts never pile up inside a single tick.
   */
  private schedule(): void {
    if (this.pending || this.destroyed) return;
    this.pending = true;
    queueMicrotask(() => {
      if (this.destroyed) return;
      afterNextRender(
        () => {
          this.pending = false;
          if (!this.destroyed) this.paginate();
        },
        { injector: this.injector },
      );
    });
  }

  private paginate(): void {
    const host = this.measureEl().nativeElement;
    const first = host.children[0] as HTMLElement | undefined;
    const next = host.children[1] as HTMLElement | undefined;
    // Hidden (display: none) hosts have no geometry; wait until the preview is visible.
    if (!first || !next || first.offsetHeight === 0) return;

    const flows = this.flows();
    const pack = (flow: 'main' | 'side', blocks: typeof flows.main): typeof flows.main[] => {
      const a = this.measureFlow(first, flow, true);
      const b = this.measureFlow(next, flow, false);
      if (!a) return blocks.length ? [blocks] : [[]];
      const firstCap = a.capacity * this.capacityFactor;
      const nextCap = (b?.capacity ?? a.capacity) * this.capacityFactor;
      return paginateFlow(blocks, a.metrics, firstCap, nextCap);
    };

    const pages = toPageModels(pack('main', flows.main), pack('side', flows.side));

    if (this.fitOnePage() && !this.fitGaveUp && pages.length > 1) {
      const smaller = Math.round((this.tryScale() - FIT_STEP) * 100) / 100;
      if (smaller >= MIN_FIT_SCALE) {
        this.tryScale.set(smaller);
      } else {
        // Too long for one page even at the smallest size: use the chosen size on several pages.
        this.fitGaveUp = true;
        this.tryScale.set(this.fontScale());
      }
      this.schedule();
      return;
    }

    this.usedScale.set(this.tryScale());
    this.pages.set(pages);
    this.pageCount.emit(pages.length);
    this.verifyAfterRender();
  }

  /** Reads capacity and block geometry of one flow from a measuring instance. */
  private measureFlow(page: HTMLElement, flow: 'main' | 'side', withBlocks: boolean): FlowMeasure | null {
    const flowEl = page.querySelector<HTMLElement>(`[data-flow="${flow}"]`);
    if (!flowEl) return null;
    const metrics: Record<string, BlockMetric> = {};
    if (withBlocks) {
      const blocks = Array.from(flowEl.querySelectorAll<HTMLElement>(':scope > [data-block]'));
      const rects = blocks.map((b) => b.getBoundingClientRect());
      blocks.forEach((el, i) => {
        const rect = rects[i];
        const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-row]')).map((r) => r.getBoundingClientRect());
        const gap = i + 1 < rects.length ? Math.max(0, rects[i + 1].top - rect.bottom) : 0;
        metrics[el.dataset['block']!] = {
          height: rect.height,
          gap,
          head: rows.length ? rows[0].top - rect.top : rect.height,
          rowBottoms: rows.map((r) => r.bottom - rect.top),
        };
      });
    }
    return { capacity: flowEl.clientHeight, metrics };
  }

  /** Safety net: if a real page still overflows, paginate again with a little less capacity. */
  private verifyAfterRender(): void {
    queueMicrotask(() => this.destroyed || afterNextRender(
      () => {
        if (this.destroyed || this.pending || this.corrections >= MAX_CORRECTIONS) return;
        const flows = this.pagesEl().nativeElement.querySelectorAll<HTMLElement>('[data-flow]');
        const overflowing = Array.from(flows).some((f) => f.scrollHeight > f.clientHeight + 1);
        if (overflowing) {
          this.corrections++;
          this.capacityFactor -= 0.04;
          this.schedule();
        }
      },
      { injector: this.injector },
    ));
  }
}
