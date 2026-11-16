import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, starTile } from '../base/ornaments';
import { chamferSheet, octagonMask } from '../base/ornaments-extra';

/**
 * Neel Mahal: royal blue page and an ivory sheet with chamfered gold corners and an octagonal portrait.
 * The sheet and the octagon are SVG images, because the PDF rasterizer cannot clip elements to a polygon.
 */
@Component({
  selector: 'tpl-neelmahal',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-neelmahal' },
  styleUrl: './neelmahal.scss',
  template: `
    <div class="lattice" [style.background-image]="art.star"></div>
    <img class="sheetbg" [src]="art.sheet" alt="" />
    <div class="sheet">
      @if (page().first) {
        <header class="head">
          <div class="who">
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#12306B" accent="#C9A227" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          </div>
          @if (model().photo; as p) {
            <div class="oct">
              <bd-photo [src]="p" />
              <img class="mask" [src]="art.oct" alt="" />
            </div>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
  `,
})
export class NeelMahalTemplate extends TemplateBase {
  protected readonly art = {
    star: cssUrl(starTile('#C9A227')),
    sheet: chamferSheet('#FBF6E8', '#C9A227'),
    oct: octagonMask('#FBF6E8', '#C9A227'),
  };
}
