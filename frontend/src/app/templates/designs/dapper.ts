import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { diagonalHeader } from '../base/ornaments-extra';

/**
 * Dapper: slate header cut on the diagonal with a copper edge, and numbered section headings.
 * The diagonal is an SVG image, because the PDF rasterizer cannot clip elements to a polygon.
 */
@Component({
  selector: 'tpl-dapper',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-dapper' },
  styleUrl: './dapper.scss',
  template: `
    @if (page().first) {
      <header class="head">
        <img class="slab" [src]="art.head" alt="" />
        <div class="row">
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
          <div class="who">
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#E8B48A" accent="#FFFFFF" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
            <p class="name" [class.long]="nameLong()">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          </div>
        </div>
      </header>
    } @else {
      <header class="head slim"></header>
    }
    <div class="body">
      @if (!page().first) {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
    <div class="foot"></div>
  `,
})
export class DapperTemplate extends TemplateBase {
  protected readonly art = { head: diagonalHeader('#1D2733', '#B8693B') };
}
