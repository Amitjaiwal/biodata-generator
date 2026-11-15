import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { samplePage } from '../core/data/sample-models';
import { TemplateDefinition } from '../core/models/template.model';

/**
 * Live miniature of a design rendered with sample data. It is the real template scaled
 * down with CSS, so thumbnails can never drift from the actual output.
 */
@Component({
  selector: 'app-template-thumb',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="thumb" aria-hidden="true">
      <div class="thumb-page">
        <ng-container *ngComponentOutlet="def().component; inputs: inputs()" />
      </div>
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
  `,
})
export class TemplateThumb {
  readonly def = input.required<TemplateDefinition>();
  protected readonly inputs = computed(() => {
    const { model, page } = samplePage(this.def());
    return { model, page };
  });
}
