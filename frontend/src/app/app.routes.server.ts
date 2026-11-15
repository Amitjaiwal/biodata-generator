import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEMPLATE_CATEGORIES } from './core/models/template.model';

/**
 * Marketing pages are prerendered to static HTML for search engines. The builder works on
 * private data held in the browser, so it is rendered on the client only.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'create', renderMode: RenderMode.Client },
  {
    path: 'templates/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => TEMPLATE_CATEGORIES.map((category) => ({ category })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
