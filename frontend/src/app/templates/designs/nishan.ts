import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl } from '../base/ornaments';
import { checkTile, diamondDot } from '../base/ornaments-extra';

/** Nishan: deep blue header with a saffron Ik Onkar roundel, a saffron stripe and a checked border. */
@Component({
  selector: 'tpl-nishan',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-nishan' },
  styleUrl: './nishan.scss',
  template: `
    @if (page().first) {
      <header class="head">
        <div class="pat" [style.background-image]="art.pat"></div>
        <div class="seal">
          <bd-symbol [symbol]="model().symbol" color="#14325C" accent="#FFFFFF" />
        </div>
        <div class="who">
          <p class="bd-blessing">{{ model().blessing }}</p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
        </div>
        @if (model().photo; as p) {
          <div class="ph"><bd-photo [src]="p" /></div>
        }
      </header>
    } @else {
      <header class="head slim"><div class="pat" [style.background-image]="art.pat"></div></header>
    }
    <div class="stripe"><i></i><i></i><i></i></div>
    <div class="body">
      @if (!page().first) {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
    <div class="check" [style.background-image]="art.check"></div>
  `,
})
export class NishanTemplate extends TemplateBase {
  protected readonly art = {
    pat: cssUrl(diamondDot('#E7B04B', '#14325C')),
    check: cssUrl(checkTile('#14325C', '#F4A300')),
  };
}
