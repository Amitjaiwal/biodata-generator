import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cornerClassic, divider, multifoilArch } from '../base/ornaments';

/** Rajwada: midnight page with gold line-work, a palace-arch portrait and paired detail columns. */
@Component({
  selector: 'tpl-rajwada',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-rajwada' },
  styleUrl: './rajwada.scss',
  template: `
    <div class="frame"></div>
    <img class="corner tl" [src]="art.corner" alt="" />
    <img class="corner tr" [src]="art.corner" alt="" />
    <img class="corner bl" [src]="art.corner" alt="" />
    <img class="corner br" [src]="art.corner" alt="" />
    <div class="inner">
      @if (page().first) {
        <header class="head">
          <p class="bd-blessing">{{ model().blessing }}</p>
          <div class="hero">
            <div class="wing">
              <bd-symbol [symbol]="model().symbol" color="#D9B65C" accent="#F3EAD3" />
              <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
            </div>
            @if (model().photo; as p) {
              <div class="arch">
                <img class="foil" [src]="art.arch" alt="" />
                <bd-photo [src]="p" />
              </div>
            }
            <div class="wing">
              <img class="div" [src]="art.divider" alt="" />
              @if (model().tagline) {
                <p class="tag">{{ model().tagline }}</p>
              }
            </div>
          </div>
          <p class="name" [class.indic]="nameIndic()">{{ model().name }}</p>
        </header>
      } @else {
        <bd-cont [model]="model()" [page]="page()" />
      }
      <bd-sections [blocks]="page().main" sep="" />
    </div>
  `,
})
export class RajwadaTemplate extends TemplateBase {
  protected readonly art = {
    corner: cornerClassic('#D9B65C'),
    divider: divider('#D9B65C'),
    arch: multifoilArch('#D9B65C'),
  };
}
