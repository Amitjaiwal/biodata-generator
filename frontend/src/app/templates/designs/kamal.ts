import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { lotus, mandala } from '../base/ornaments';

/** Kamal: portrait inside a mandala halo, with details in soft outlined panels. */
@Component({
  selector: 'tpl-kamal',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-kamal' },
  styleUrl: './kamal.scss',
  template: `
    <img class="water" [src]="art.mandala" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <p class="bd-blessing">{{ model().blessing }}</p>
          <div class="halo">
            <img class="mand" [src]="art.mandala" alt="" />
            @if (model().photo; as p) {
              <bd-photo [src]="p" />
            } @else {
              <bd-symbol [symbol]="model().symbol" color="#B83B5E" accent="#C59B3B" />
            }
          </div>
          <p class="name">{{ model().name }}</p>
          <p class="title">
            <img class="lotus" [src]="art.lotus" alt="" />
            <span>{{ model().title }}</span>
            @if (model().tagline) {
              <span class="dot">·</span><span>{{ model().tagline }}</span>
            }
            <img class="lotus" [src]="art.lotus" alt="" />
          </p>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class KamalTemplate extends TemplateBase {
  protected readonly art = { mandala: mandala('#C59B3B', '#B83B5E'), lotus: lotus('#D9728E', '#B83B5E') };
}
