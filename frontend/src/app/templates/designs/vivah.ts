import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { kalash } from '../base/ornaments';

/** Shubh Vivah: classic red-on-cream print style with kalash, a name ribbon and a horoscope box. */
@Component({
  selector: 'tpl-vivah',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-vivah' },
  styleUrl: './vivah.scss',
  template: `
    <div class="frame"></div>
    <div class="frame2"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <img class="kal" [src]="art.kalash" alt="" />
          <div class="mid">
            <bd-symbol [symbol]="model().symbol" color="#B5121B" accent="#C99A1B" />
            <p class="bd-blessing">{{ model().blessing }}</p>
            <p class="title">{{ model().title }}</p>
          </div>
          <img class="kal" [src]="art.kalash" alt="" />
        </header>
        <div class="ribbon">
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </div>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" />
        <aside class="side">
          @if (page().first) {
            @if (model().photo; as p) {
              <div class="ph"><bd-photo [src]="p" /></div>
            }
          }
          <bd-sections flow="side" [blocks]="page().side" sep="" />
        </aside>
      </div>
    </div>
  `,
})
export class VivahTemplate extends TemplateBase {
  protected readonly art = { kalash: kalash('#C99A1B', '#B5121B', '#3F7D3A') };
}
