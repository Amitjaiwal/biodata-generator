import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, starTile } from '../base/ornaments';

/** Noor: emerald star-lattice bands with an arched portrait beside the heading. */
@Component({
  selector: 'tpl-noor',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-noor' },
  styleUrl: './noor.scss',
  template: `
    <div class="band top" [style.background-image]="art.star"></div>
    <div class="band bottom" [style.background-image]="art.star"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <div class="who">
            <bd-symbol [symbol]="model().symbol" color="#0B5D4B" accent="#B8962E" />
            <p class="bd-blessing">{{ model().blessing }}</p>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <div class="rule"></div>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class NoorTemplate extends TemplateBase {
  protected readonly art = { star: cssUrl(starTile('#D9BF6A')) };
}
