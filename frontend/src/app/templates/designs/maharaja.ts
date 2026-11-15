import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, mandala, scallopTile } from '../base/ornaments';

/** Maharaja: maroon banner with mandalas, a gold-ringed medallion portrait and two columns. */
@Component({
  selector: 'tpl-maharaja',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-maharaja' },
  styleUrl: './maharaja.scss',
  template: `
    @if (page().first) {
      <div class="banner">
        <img class="mand left" [src]="art.mandala" alt="" />
        <img class="mand right" [src]="art.mandala" alt="" />
        <bd-symbol [symbol]="model().symbol" color="#E7C873" accent="#FFF3D0" />
        <p class="bd-blessing">{{ model().blessing }}</p>
        <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
      </div>
      <div class="scallop" [style.background-image]="art.scallop"></div>
      @if (model().photo; as p) {
        <div class="medal"><bd-photo [src]="p" /></div>
      }
    } @else {
      <div class="banner slim"></div>
      <div class="scallop" [style.background-image]="art.scallop"></div>
    }
    <div class="inner">
      @if (page().first) {
        <div class="who">
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </div>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
    <div class="edge"></div>
  `,
})
export class MaharajaTemplate extends TemplateBase {
  protected readonly art = { mandala: mandala('#E7C873'), scallop: cssUrl(scallopTile('#5B0F1B')) };
}
