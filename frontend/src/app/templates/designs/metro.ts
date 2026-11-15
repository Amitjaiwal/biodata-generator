import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Metro: bold indigo header with an overlapping portrait and details in two columns of cards. */
@Component({
  selector: 'tpl-metro',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-metro' },
  styleUrl: './metro.scss',
  template: `
    @if (page().first) {
      <header class="head">
        <div class="who">
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </div>
        <p class="bless">
          <bd-symbol [symbol]="model().symbol" color="#FFB703" accent="#FFFFFF" />
          <span class="bd-blessing">{{ model().blessing }}</span>
        </p>
      </header>
      @if (model().photo; as p) {
        <div class="ph"><bd-photo [src]="p" /></div>
      }
    } @else {
      <div class="head slim"></div>
    }
    <div class="inner">
      @if (!page().first) {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
  `,
})
export class MetroTemplate extends TemplateBase {}
