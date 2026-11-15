import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, peacockFeather, weaveTile } from '../base/ornaments';

/** Paithani: woven sari-border bands in purple and gold with peacock feathers. */
@Component({
  selector: 'tpl-paithani',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-paithani' },
  styleUrl: './paithani.scss',
  template: `
    <div class="weave left" [style.background-image]="art.weave"></div>
    <div class="weave top" [style.background-image]="art.weave"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <div class="who">
            <p class="bd-blessing">{{ model().blessing }}</p>
            <p class="title">
              <bd-symbol [symbol]="model().symbol" color="#5B2A86" accent="#D4A017" />
              <span>{{ model().title }}</span>
            </p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
          <div class="portrait">
            <img class="feather f1" [src]="art.feather" alt="" />
            <img class="feather f2" [src]="art.feather" alt="" />
            @if (model().photo; as p) {
              <div class="ph"><bd-photo [src]="p" /></div>
            }
          </div>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" />
    </div>
  `,
})
export class PaithaniTemplate extends TemplateBase {
  protected readonly art = {
    weave: cssUrl(weaveTile('#E3B93C', '#2D6A4F')),
    feather: peacockFeather('#1F7A6B', '#27408B', '#D4A017'),
  };
}
