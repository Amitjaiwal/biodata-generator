import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Saral Minimal: left-aligned, black and white, details in a two-column grid. */
@Component({
  selector: 'tpl-saral',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-saral' },
  styleUrl: './saral.scss',
  template: `
    <div class="pad">
      @if (page().first) {
        <header class="head">
          <div class="who">
            <p class="kicker">
              <bd-symbol [symbol]="model().symbol" color="#111111" accent="#888888" />
              <span [class.indic]="titleIndic()">{{ model().title }}</span>
            </p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
            <p class="bd-blessing">{{ model().blessing }}</p>
          </div>
          @if (model().photo; as p) {
            <bd-photo [src]="p" />
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class SaralTemplate extends TemplateBase {}
