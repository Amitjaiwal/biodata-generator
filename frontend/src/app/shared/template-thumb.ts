import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { samplePage } from '../core/data/sample-models';
import { TemplateDefinition } from '../core/models/template.model';

/**
 * Live miniature of a design rendered with sample data. It is the real template scaled
 * down with CSS, so thumbnails can never drift from the actual output.
 *
 * By default the miniature is only built when it scrolls into view. That keeps the gallery's
 * HTML and DOM small, which matters on phones. Above-the-fold uses set `lazy` to false.
 */
@Component({
  selector: 'app-template-thumb',
  imports: [NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="thumb" role="img" [attr.aria-label]="label()">
      <ng-template #page>
        <div class="thumb-page" aria-hidden="true">
          <ng-container *ngComponentOutlet="def().component; inputs: inputs()" />
        </div>
      </ng-template>
      @switch (lazy()) {
        @case (true) {
          @defer (on viewport) {
            <ng-container *ngTemplateOutlet="page" />
          } @placeholder {
            <div class="ph" [style.background]="def().accent"></div>
          }
        }
        @case ('idle') {
          @defer (on idle) {
            <ng-container *ngTemplateOutlet="page" />
          } @placeholder {
            <div class="ph paper" [style.border-top-color]="def().accent"></div>
          }
        }
        @default {
          <ng-container *ngTemplateOutlet="page" />
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .thumb {
      position: relative;
      overflow: hidden;
      aspect-ratio: 794 / 1123;
      background: #fff;
      container-type: inline-size;
    }
    .thumb-page {
      width: 794px;
      height: 1123px;
      transform: scale(0.3);
      /* Unitless ratio of the container width to the A4 width, without JavaScript. */
      transform: scale(tan(atan2(100cqw, 794px)));
      transform-origin: 0 0;
      pointer-events: none;
      user-select: none;
    }
    .ph {
      width: 100%;
      height: 100%;
      opacity: 0.07;
    }
    /* Blank paper shown until an above-the-fold preview is built, so the hero keeps its shape. */
    .ph.paper {
      border-top: 14px solid;
      background: #fff;
      opacity: 1;
    }
  `,
})
export class TemplateThumb {
  readonly def = input.required<TemplateDefinition>();
  /** true: build when scrolled into view. 'idle': build once the browser is idle (for above-the-fold art). false: build now. */
  readonly lazy = input<boolean | 'idle'>(true);

  private readonly t = inject(I18nService).t;
  protected readonly label = computed(() => this.t('thumb.label', { name: this.def().name }));
  protected readonly inputs = computed(() => {
    const { model, page } = samplePage(this.def());
    return { model, page };
  });
}
