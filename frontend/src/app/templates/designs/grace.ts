import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl } from '../base/ornaments';
import { oliveSprig } from '../base/ornaments-extra';

/** Grace: soft ivory page, an olive-sprig border and a calm arched portrait under a cross. */
@Component({
  selector: 'tpl-grace',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-grace' },
  styleUrl: './grace.scss',
  template: `
    <div class="frame"></div>
    <div class="sprig top" [style.background-image]="art.sprig"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <bd-symbol [symbol]="model().symbol" color="#4F6D8A" accent="#4F6D8A" />
          <p class="bd-blessing">{{ model().blessing }}</p>
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
          @if (model().photo; as p) {
            <div class="arch"><bd-photo [src]="p" /></div>
          }
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
    <div class="sprig bottom" [style.background-image]="art.sprig"></div>
  `,
})
export class GraceTemplate extends TemplateBase {
  protected readonly art = { sprig: cssUrl(oliveSprig('#7C9A7E', '#9DB3A0')) };
}
