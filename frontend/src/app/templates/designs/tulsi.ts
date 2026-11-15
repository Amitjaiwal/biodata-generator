import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, vineTile } from '../base/ornaments';

/** Tulsi: climbing vines down both edges with a large offset portrait beside the name. */
@Component({
  selector: 'tpl-tulsi',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-tulsi' },
  styleUrl: './tulsi.scss',
  template: `
    <div class="vine left" [style.background-image]="art.vine"></div>
    <div class="vine right" [style.background-image]="art.vine"></div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          @if (model().photo; as p) {
            <div class="ph">
              <div class="shade"></div>
              <bd-photo [src]="p" />
            </div>
          }
          <div class="who">
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#2F6B3F" accent="#9BC29F" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
          </div>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class TulsiTemplate extends TemplateBase {
  protected readonly art = { vine: cssUrl(vineTile('#5E9B68', '#2F6B3F')) };
}
