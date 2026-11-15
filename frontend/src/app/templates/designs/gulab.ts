import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cornerFloral } from '../base/ornaments';

/** Gulab Floral: blush page with floral corner sprays and an oval portrait. */
@Component({
  selector: 'tpl-gulab',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-gulab' },
  styleUrl: './gulab.scss',
  template: `
    <img class="spray tl" [src]="art.corner" alt="" />
    <img class="spray br" [src]="art.corner" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <bd-symbol [symbol]="model().symbol" color="#B5536C" accent="#7A9A7E" />
          <p class="bd-blessing">{{ model().blessing }}</p>
          <p class="title">{{ model().title }}</p>
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class GulabTemplate extends TemplateBase {
  protected readonly art = { corner: cornerFloral('#7A9A7E', '#D98BA0', '#F3C9A8') };
}
