import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Ahimsa: saffron header band with a round portrait and striped detail rows. */
@Component({
  selector: 'tpl-ahimsa',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-ahimsa' },
  styleUrl: './ahimsa.scss',
  template: `
    @if (page().first) {
      <header class="head">
        @if (model().photo; as p) {
          <div class="ph"><bd-photo [src]="p" /></div>
        }
        <div class="who">
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </div>
        <div class="bless">
          <bd-symbol [symbol]="model().symbol" color="#C2620A" accent="#4A2F12" />
          <p class="bd-blessing">{{ model().blessing }}</p>
        </div>
      </header>
    } @else {
      <div class="strip"></div>
    }
    <div class="inner">
      @if (!page().first) {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
    <div class="foot"></div>
  `,
})
export class AhimsaTemplate extends TemplateBase {}
