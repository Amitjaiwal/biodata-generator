import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Monogram: black and gold with an initials seal and section titles set in a left gutter. */
@Component({
  selector: 'tpl-monogram',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-monogram' },
  styleUrl: './monogram.scss',
  template: `
    <div class="bar"></div>
    <div class="pad">
      @if (page().first) {
        <header class="head">
          <div class="seal">
            <span>{{ model().initials }}</span>
          </div>
          <div class="who">
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="name" [class.indic]="nameIndic()">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
        </header>
        @if (model().blessing) {
          <p class="bless">
            <bd-symbol [symbol]="model().symbol" color="#A8873A" accent="#161616" />
            <span class="bd-blessing">{{ model().blessing }}</span>
          </p>
        }
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class MonogramTemplate extends TemplateBase {}
