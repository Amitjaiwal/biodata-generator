import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Part {
  text: string;
  link: string | null;
}

/** A link is [label](/path). The path must start with a single slash, so "//other-site" is never linked. */
const LINK = /\[([^\]]+)\]\((\/(?!\/)[^)\s]*)\)/g;

/** Splits text containing `[label](/path)` into plain and linked parts. Only site-relative paths are linked. */
export function parseRichText(text: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ text: text.slice(last, at), link: null });
    parts.push({ text: m[1], link: m[2] });
    last = at + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), link: null });
  return parts;
}

/**
 * Renders a paragraph's text with internal links written as `[anchor text](/path)`, so page copy can
 * link to other pages in the middle of a sentence without any raw HTML.
 */
@Component({
  selector: 'app-rich',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (p of parts(); track $index) {@if (p.link) {<a [routerLink]="p.link">{{ p.text }}</a>} @else {{{ p.text }}}}`,
  styles: `
    a {
      color: var(--sp-primary);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    a:hover {
      color: var(--sp-primary-dark);
    }
  `,
})
export class RichText {
  readonly text = input.required<string>();
  protected readonly parts = computed(() => parseRichText(this.text()));
}
