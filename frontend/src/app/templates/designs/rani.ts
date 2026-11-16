import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, scallopTile } from '../base/ornaments';
import { diamondDot } from '../base/ornaments-extra';

/** Rani: magenta page with a gold diamond border, a cream panel hung with gold scallops and ribbon headings. */
@Component({
  selector: 'tpl-rani',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-rani' },
  styleUrl: './rani.scss',
  template: `
    <div class="border" [style.background-image]="art.dots"></div>
    <div class="panel">
      <div class="scallop" [style.background-image]="art.scallop"></div>
      <div class="inner">
        @if (page().first) {
          <header class="head">
            <bd-symbol [symbol]="model().symbol" color="#8E1B5C" accent="#D4A73A" />
            <p class="bd-blessing">{{ model().blessing }}</p>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <div class="id">
              @if (model().photo; as p) {
                <div class="ring"><bd-photo [src]="p" /></div>
              }
              <div class="who">
                <p class="name">{{ model().name }}</p>
                @if (model().tagline) {
                  <p class="tag">{{ model().tagline }}</p>
                }
              </div>
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
    </div>
  `,
})
export class RaniTemplate extends TemplateBase {
  protected readonly art = {
    dots: cssUrl(diamondDot('#E7C46A', '#8E1B5C')),
    scallop: cssUrl(scallopTile('#D4A73A')),
  };
}
