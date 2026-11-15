import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEMPLATE_CATEGORIES } from './core/models/template.model';

/**
 * Every page is prerendered to a static HTML file, so the site works on any static host
 * (Netlify, Cloudflare, Vercel) without rewrite rules.
 *
 * The builder page is prerendered as an empty shell. The visitor's saved biodata is read from
 * their browser only after the page loads, so no personal data is ever part of the build.
 * Unknown addresses are served the client-rendered shell as 404.html (see scripts/postbuild.mjs).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'templates/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => TEMPLATE_CATEGORIES.map((category) => ({ category })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
