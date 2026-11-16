import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { bloom } from '../base/ornaments-extra';

/** Blush: soft rose page, a circular portrait with blooms and details laid out as white cards. */
@Component({
  selector: 'tpl-blush',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-blush' },
  styleUrl: './blush.scss',
  template: `
    <img class="bloom a" [src]="art.bloom" alt="" />
    <img class="bloom b" [src]="art.bloom" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <div class="who">
            <p class="bless">
              <bd-symbol [symbol]="model().symbol" color="#B4506A" accent="#D9A441" />
              <span class="bd-blessing">{{ model().blessing }}</span>
            </p>
            <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            <p class="name">{{ model().name }}</p>
            @if (model().tagline) {
              <p class="tag">{{ model().tagline }}</p>
            }
          </div>
          @if (model().photo; as p) {
            <div class="ring"><bd-photo [src]="p" /></div>
          }
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <div class="cols">
        <bd-sections [blocks]="page().main" sep="" />
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </div>
    </div>
  `,
})
export class BlushTemplate extends TemplateBase {
  protected readonly art = { bloom: bloom('#F4B6C2', '#E88EA3', '#F6D365', '#9CB89A') };
}
