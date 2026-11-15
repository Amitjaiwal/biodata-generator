import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Sage Elegant: editorial serif heading over a narrow photo column and a wide detail column. */
@Component({
  selector: 'tpl-sage',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-sage' },
  styleUrl: './sage.scss',
  template: `
    <div class="pad">
      @if (page().first) {
        <header class="head">
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <aside class="side">
          @if (page().first) {
            @if (model().photo; as p) {
              <bd-photo [src]="p" />
            }
            <div class="bless">
              <bd-symbol [symbol]="model().symbol" color="#5F7161" accent="#A9B8A5" />
              <p class="bd-blessing">{{ model().blessing }}</p>
            </div>
          }
          <bd-sections flow="side" [blocks]="page().side" sep="" />
        </aside>
        <bd-sections [blocks]="page().main" sep="" />
      </div>
    </div>
  `,
})
export class SageTemplate extends TemplateBase {}
