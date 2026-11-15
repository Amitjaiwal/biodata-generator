import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Nila Modern: navy sidebar with a round photo, details in the main column. */
@Component({
  selector: 'tpl-nila',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-nila' },
  styleUrl: './nila.scss',
  template: `
    <aside class="side">
      @if (page().first) {
        @if (model().photo; as p) {
          <div class="ph"><bd-photo [src]="p" /></div>
        }
        <p class="name">{{ model().name }}</p>
        @if (model().tagline) {
          <p class="tag">{{ model().tagline }}</p>
        }
        <div class="rule"></div>
      }
      <bd-sections flow="side" [blocks]="page().side" sep="" />
    </aside>
    <div class="main">
      @if (page().first) {
        <header class="head">
          <div>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="bd-blessing">{{ model().blessing }}</p>
          </div>
          <bd-symbol [symbol]="model().symbol" color="#FCA311" accent="#14213D" />
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class NilaTemplate extends TemplateBase {}
