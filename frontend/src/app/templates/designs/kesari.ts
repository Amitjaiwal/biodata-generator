import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, toranTile } from '../base/ornaments';

/** Kesari: saffron Marathi-style layout with a marigold toran and ribbon section titles. */
@Component({
  selector: 'tpl-kesari',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-kesari' },
  styleUrl: './kesari.scss',
  template: `
    <div class="frame"></div>
    <div class="toran" [style.background-image]="art.toran"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <p class="bd-blessing">{{ model().blessing }}</p>
          <div class="titlerow">
            <bd-symbol [symbol]="model().symbol" color="#9A031E" accent="#E36414" />
            <p class="title">{{ model().title }}</p>
            <bd-symbol [symbol]="model().symbol" color="#9A031E" accent="#E36414" />
          </div>
        </header>
        <div class="intro">
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
          <div class="who">
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
        </div>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" />
    </div>
  `,
})
export class KesariTemplate extends TemplateBase {
  protected readonly art = { toran: cssUrl(toranTile('#386641', '#F08A24', '#9A031E')) };
}
