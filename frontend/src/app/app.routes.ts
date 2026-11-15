import { CanMatchFn, Routes } from '@angular/router';
import { LANDINGS } from './core/data/landings';
import { TEMPLATE_CATEGORIES } from './core/models/template.model';

const knownCategory: CanMatchFn = (_route, segments) =>
  (TEMPLATE_CATEGORIES as readonly string[]).includes(segments[1]?.path ?? '');

const legal = () => import('./pages/legal').then((m) => m.Legal);
const landing = () => import('./pages/landing').then((m) => m.LandingPage);

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'templates', loadComponent: () => import('./pages/templates').then((m) => m.Templates) },
  {
    path: 'templates/:category',
    canMatch: [knownCategory],
    loadComponent: () => import('./pages/templates').then((m) => m.Templates),
  },
  { path: 'create', loadComponent: () => import('./pages/create').then((m) => m.Create) },
  { path: 'pricing', loadComponent: () => import('./pages/pricing').then((m) => m.Pricing) },
  { path: 'privacy', loadComponent: legal, data: { doc: 'privacy' } },
  { path: 'terms', loadComponent: legal, data: { doc: 'terms' } },
  { path: 'refund-policy', loadComponent: legal, data: { doc: 'refund' } },
  { path: 'contact', loadComponent: legal, data: { doc: 'contact' } },
  ...LANDINGS.map((l) => ({ path: l.slug, loadComponent: landing, data: { landing: l } })),
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
