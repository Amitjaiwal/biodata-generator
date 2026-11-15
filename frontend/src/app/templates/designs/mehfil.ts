import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TEMPLATE_IMPORTS, TemplateBase } from '../base/blocks';
import { cssUrl, multifoilArch, starTile } from '../base/ornaments';

/** Mehfil: teal header with a lattice pattern and cusped-arch portrait, plus a tinted side panel. */
@Component({
  selector: 'tpl-mehfil',
  imports: [TEMPLATE_IMPORTS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 't-mehfil' },
  styleUrl: './mehfil.scss',
  template: `
    @if (page().first) {
      <header class="head">
        <div class="lattice" [style.background-image]="art.star"></div>
        <div class="who">
          <p class="bless">
            <bd-symbol [symbol]="model().symbol" color="#E3C87A" accent="#FFFFFF" />
            <span class="bd-blessing">{{ model().blessing }}</span>
          </p>
          <p class="name">{{ model().name }}</p>
          @if (model().tagline) {
            <p class="tag">{{ model().tagline }}</p>
          }
          <p class="title" [class.indic]="titleIndic()">{{ model().title }}</p>
        </div>
        @if (model().photo; as p) {
          <div class="ph">
            <img class="foil" [src]="art.arch" alt="" />
            <bd-photo [src]="p" />
          </div>
        }
      </header>
    } @else {
      <div class="head slim"><div class="lattice" [style.background-image]="art.star"></div></div>
    }
    <div class="cols">
      <div class="maincol">
        @if (!page().first) {
          <bd-cont [model]="model()" [page]="page()" />
        }
        <bd-sections [blocks]="page().main" sep="" />
      </div>
      <aside class="panel">
        <bd-sections flow="side" [blocks]="page().side" sep="" />
      </aside>
    </div>
  `,
})
export class MehfilTemplate extends TemplateBase {
  protected readonly art = { star: cssUrl(starTile('#E3C87A')), arch: multifoilArch('#E3C87A', '#0F4C5C') };
}
