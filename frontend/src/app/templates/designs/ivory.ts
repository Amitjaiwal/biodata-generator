import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';

/** Ivory: airy centred composition where labels and values meet on a central axis. */
@Component({
  selector: 'tpl-ivory',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-ivory' },
  styleUrl: './ivory.scss',
  template: `
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <bd-symbol [symbol]="model().symbol" color="#A98B4F" accent="#2B2620" />
          <p class="bd-blessing">{{ model().blessing }}</p>
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
          <p class="name">{{ model().name }}</p>
          <div class="rule"></div>
          <p class="title" [class.indic]="titleIndic()">
            <span>{{ model().title }}</span>
          </p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class IvoryTemplate extends TemplateBase {}
