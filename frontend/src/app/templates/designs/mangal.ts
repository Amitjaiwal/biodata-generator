import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cornerClassic, divider } from '../base/ornaments';

/** Mangal Classic: centred traditional layout inside a maroon and gold double frame. */
@Component({
  selector: 'tpl-mangal',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-mangal' },
  styleUrl: './mangal.scss',
  template: `
    <div class="frame"></div>
    <div class="frame2"></div>
    <img class="corner tl" [src]="art.corner" alt="" />
    <img class="corner tr" [src]="art.corner" alt="" />
    <img class="corner bl" [src]="art.corner" alt="" />
    <img class="corner br" [src]="art.corner" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <bd-symbol [symbol]="model().symbol" color="#7A1F2B" accent="#B8892B" />
          <p class="bd-blessing">{{ model().blessing }}</p>
          <img class="div" [src]="art.divider" alt="" />
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
        </header>
        <div class="intro">
          <div class="who">
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
        </div>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" />
    </div>
  `,
})
export class MangalTemplate extends TemplateBase {
  protected readonly art = { corner: cornerClassic('#B8892B'), divider: divider('#B8892B') };
}
