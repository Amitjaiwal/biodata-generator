import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cornerGold } from '../base/ornaments-extra';

/** Zarika: black page with a double gold-foil frame, corner brackets and an oval portrait. */
@Component({
  selector: 'tpl-zarika',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-zarika' },
  styleUrl: './zarika.scss',
  template: `
    <div class="frame"></div>
    <img class="corner tl" [src]="art.corner" alt="" />
    <img class="corner tr" [src]="art.corner" alt="" />
    <img class="corner bl" [src]="art.corner" alt="" />
    <img class="corner br" [src]="art.corner" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <bd-symbol [symbol]="model().symbol" color="#D9B45A" accent="#FFF1C7" />
          <p class="bd-blessing">{{ model().blessing }}</p>
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          @if (model().photo; as p) {
            <div class="oval"><bd-photo [src]="p" /></div>
          }
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
          <div class="rule"><i></i></div>
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
export class ZarikaTemplate extends TemplateBase {
  protected readonly art = { corner: cornerGold('#D9B45A') };
}
