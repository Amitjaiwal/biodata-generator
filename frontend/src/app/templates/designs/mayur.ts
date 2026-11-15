import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { peacockFeather } from '../base/ornaments';

/** Mayur: a peacock-feather fan in the corner with details in a ruled table. */
@Component({
  selector: 'tpl-mayur',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-mayur' },
  styleUrl: './mayur.scss',
  template: `
    <div class="frame"></div>
    <div class="fan tr">
      <img class="f a" [src]="art.feather" alt="" />
      <img class="f b" [src]="art.feather" alt="" />
      <img class="f c" [src]="art.feather" alt="" />
    </div>
    <div class="inner">
      @if (page().first) {
        <header class="head">
          @if (model().photo; as p) {
            <div class="ph"><bd-photo [src]="p" /></div>
          }
          <div class="who">
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#0B6E6E" accent="#C9A227" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class MayurTemplate extends TemplateBase {
  protected readonly art = { feather: peacockFeather('#0B8A7A', '#1B4F9C', '#D9B037') };
}
