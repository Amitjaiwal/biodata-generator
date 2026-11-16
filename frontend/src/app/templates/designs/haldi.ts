import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl } from '../base/ornaments';
import { marigoldGarland, roundedCard } from '../base/ornaments-extra';

/** Haldi: warm saffron page, hanging marigold garlands and a cream card with an arched portrait. */
@Component({
  selector: 'tpl-haldi',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-haldi' },
  styleUrl: './haldi.scss',
  template: `
    <img class="leafbg" [src]="art.card" alt="" />
    <div class="garland" [style.background-image]="art.garland"></div>
    <div class="leaf">
      @if (page().first) {
        <header class="head">
          @if (model().photo; as p) {
            <div class="arch"><bd-photo [src]="p" /></div>
          }
          <div class="who">
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#B2420F" accent="#E8A317" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
    <div class="garland low" [style.background-image]="art.garland"></div>
  `,
})
export class HaldiTemplate extends TemplateBase {
  protected readonly art = {
    garland: cssUrl(marigoldGarland('#F59E0B', '#EA580C', '#7C2D12', '#2F7D32', '#7C2D12')),
    card: roundedCard('#FFFBEB', '#7C2D12', 'rgba(194,65,12,0.5)', 64, 34, 34, 22),
  };
}
