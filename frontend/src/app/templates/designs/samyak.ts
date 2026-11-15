import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { lotus } from '../base/ornaments';

/** Samyak: calm white and gold layout with a tinted right column and an arched portrait. */
@Component({
  selector: 'tpl-samyak',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-samyak' },
  styleUrl: './samyak.scss',
  template: `
    <div class="main">
      @if (page().first) {
        <header class="head">
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
          <img class="lotus" [src]="art.lotus" alt="" />
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
    <aside class="side">
      @if (page().first) {
        <div class="bless">
          <bd-symbol [symbol]="model().symbol" color="#A67C1A" accent="#33270F" />
          <p class="bd-blessing">{{ model().blessing }}</p>
        </div>
        @if (model().photo; as p) {
          <div class="ph"><bd-photo [src]="p" /></div>
        }
      }
      <bd-sections flow="side" [blocks]="page().side" sep="" />
    </aside>
  `,
})
export class SamyakTemplate extends TemplateBase {
  protected readonly art = { lotus: lotus('#D9B45A', '#A67C1A') };
}
