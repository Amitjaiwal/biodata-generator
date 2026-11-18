// SEO audit of the built site (dist/frontend/browser). Run after `npm run build`:
//   npm run seo:audit
// Fails (exit code 1) on errors that would hurt indexing; prints warnings for things worth a look.
// It only reads files, so it is safe to run anywhere. SITE_URL overrides the production origin.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist', 'frontend', 'browser');
const site = (process.env.SITE_URL || 'https://marriagesbiodatamaker.com').replace(/\/+$/, '');

const errors = [];
const warnings = [];
const err = (route, msg) => errors.push(`/${route}  ${msg}`);
const warn = (route, msg) => warnings.push(`/${route}  ${msg}`);

if (!existsSync(dist)) {
  console.error('Build output not found: ' + dist + '\nRun "npm run build" first.');
  process.exit(2);
}

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (name === 'index.html') found.push(relative(dist, dir).split(sep).join('/'));
  }
  return found;
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => {
  const m = new RegExp(`${name}="([^"]*)"`).exec(tag);
  return m ? decode(m[1]) : null;
};

/** Parses one prerendered page with a few regular expressions (no dependencies). */
function parse(route) {
  const html = readFileSync(join(dist, route, 'index.html'), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const title = decode((/<title>([^<]*)<\/title>/.exec(head) ?? [])[1] ?? '');
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]);
  const meta = (key, value) => {
    const tag = metas.find((t) => attr(t, key) === value);
    return tag ? attr(tag, 'content') : null;
  };
  const canonicalTag = (/<link\b[^>]*rel="canonical"[^>]*>/.exec(head) ?? [])[0];
  const body = html.slice(html.indexOf('<body'));
  const text = body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const jsonLd = [...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return {
    route,
    html,
    title,
    description: meta('name', 'description'),
    robots: meta('name', 'robots'),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : null,
    lang: (/<html[^>]*\blang="([^"]*)"/.exec(html) ?? [])[1] ?? null,
    ogTitle: meta('property', 'og:title'),
    ogDescription: meta('property', 'og:description'),
    ogImage: meta('property', 'og:image'),
    ogUrl: meta('property', 'og:url'),
    twitterCard: meta('name', 'twitter:card'),
    h1: [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())),
    h2: [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].length,
    words: text ? text.split(' ').length : 0,
    jsonLd,
    links: [...body.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((m) => decode(m[1])),
    images: [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]),
  };
}

const routes = walk(dist).filter((r) => r !== '404');
const pages = routes.map(parse);
const byRoute = new Map(pages.map((p) => [p.route, p]));

const expectedUrl = (route) => (route === '' ? site + '/' : `${site}/${route}`);
const exists = (path) => {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return existsSync(join(dist, clean, 'index.html')) || (clean && existsSync(join(dist, clean)) && statSync(join(dist, clean)).isFile());
};

const REQUIRED_SCHEMA_FIELDS = {
  WebSite: ['name', 'url'],
  Organization: ['name', 'url', 'logo'],
  WebApplication: ['name', 'url', 'applicationCategory'],
  BreadcrumbList: ['itemListElement'],
  ItemList: ['itemListElement'],
  WebPage: ['name', 'url'],
  CollectionPage: ['name', 'url'],
};

for (const p of pages) {
  const r = p.route;
  const canonicalPages = p.canonical === expectedUrl(r);

  // Title and description
  if (!p.title) err(r, 'missing <title>');
  else if (p.title.length > 70) warn(r, `title is ${p.title.length} characters (search results show about 60): ${p.title}`);
  if (!p.description) err(r, 'missing meta description');
  else if (p.description.length < 70 || p.description.length > 175) warn(r, `description is ${p.description.length} characters (aim for 90 to 160)`);

  // Canonical and robots
  if (!p.canonical) err(r, 'missing canonical link');
  else if (!p.canonical.startsWith(site + '/') && p.canonical !== site) err(r, `canonical is not on the production origin: ${p.canonical}`);
  else if (!canonicalPages) p._alias = true;
  if (p.ogUrl && p.canonical && p.ogUrl !== p.canonical) err(r, `og:url (${p.ogUrl}) differs from canonical (${p.canonical})`);
  if (/noindex/i.test(p.robots ?? '')) warn(r, 'page is marked noindex');

  // Headings
  if (p.h1.length !== 1) err(r, `expected exactly one <h1>, found ${p.h1.length}`);
  if (!p._alias && p.h2 === 0 && r !== 'create') warn(r, 'no <h2> headings');

  // Social tags
  if (!p.ogTitle || !p.ogDescription || !p.ogImage) err(r, 'missing Open Graph title, description or image');
  if (!p.twitterCard) warn(r, 'missing twitter:card');
  if (!p.lang) err(r, 'missing <html lang>');

  // Structured data
  for (const raw of p.jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      err(r, 'JSON-LD does not parse');
      continue;
    }
    if (data['@context'] !== 'https://schema.org') err(r, 'JSON-LD without schema.org @context');
    const type = data['@type'];
    if (!type) err(r, 'JSON-LD without @type');
    if (type === 'FAQPage') warn(r, 'FAQPage markup: Google only shows FAQ rich results for authoritative government and health sites');
    for (const field of REQUIRED_SCHEMA_FIELDS[type] ?? []) if (data[field] === undefined) err(r, `${type} JSON-LD is missing "${field}"`);
    if (/ratingValue|reviewCount|aggregateRating/.test(raw)) err(r, 'JSON-LD contains ratings or reviews');
  }

  // Images
  for (const img of p.images) {
    if (!/\salt(=|\s|>|\/)/.test(img)) err(r, `<img> without alt: ${img.slice(0, 80)}`);
  }

  // Internal links
  for (const href of p.links) {
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    if (!href.startsWith('/')) continue;
    const path = href.split('#')[0].split('?')[0];
    if (!path || path === '/') continue;
    if (!exists(path)) err(r, `broken internal link: ${href}`);
  }

  // Thin content (landing pages and guides should have real text)
  if (!p._alias && r !== '' && !['create', 'templates', 'pricing'].includes(r) && !r.startsWith('templates/') && p.words < 250) {
    warn(r, `only ${p.words} words of text on the page`);
  }
}

// Titles and descriptions must be unique among the pages that are meant to be indexed.
const indexable = pages.filter((p) => !p._alias && !/noindex/i.test(p.robots ?? ''));
for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const p of indexable) {
    const v = p[key];
    if (!v) continue;
    if (seen.has(v)) err(p.route, `${key} duplicates /${seen.get(v)}`);
    else seen.set(v, p.route);
  }
}

// Sitemap
const sitemapPath = join(dist, 'sitemap.xml');
let sitemapUrls = [];
if (!existsSync(sitemapPath)) err('sitemap.xml', 'sitemap.xml is missing');
else {
  sitemapUrls = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
  if (new Set(sitemapUrls).size !== sitemapUrls.length) err('sitemap.xml', 'duplicate URLs in the sitemap');
  for (const url of sitemapUrls) {
    if (!url.startsWith(site)) {
      err('sitemap.xml', `URL outside the production origin: ${url}`);
      continue;
    }
    const route = url === site + '/' || url === site ? '' : url.slice(site.length + 1);
    const p = byRoute.get(route);
    if (!p) err('sitemap.xml', `lists a page that does not exist: ${url}`);
    else if (p.canonical !== url) err('sitemap.xml', `lists a non-canonical URL: ${url} (its canonical is ${p.canonical})`);
    else if (/noindex/i.test(p.robots ?? '')) err('sitemap.xml', `lists a noindex page: ${url}`);
  }
  for (const p of indexable) {
    if (p.canonical && !sitemapUrls.includes(p.canonical)) warn('sitemap.xml', `does not list ${p.canonical}`);
  }
}

// robots.txt
const robotsPath = join(dist, 'robots.txt');
if (!existsSync(robotsPath)) err('robots.txt', 'robots.txt is missing');
else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) err('robots.txt', 'blocks the whole site');
  if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) err('robots.txt', 'does not point at the sitemap');
}

// Icons and the 404 page
for (const f of ['404.html', 'favicon.ico', 'favicon.svg', 'favicon-48x48.png', 'apple-touch-icon.png', 'icon-512.png', 'og-image.png']) {
  if (!existsSync(join(dist, f))) err(f, 'file is missing from the build');
}

// Report
const aliases = pages.filter((p) => p._alias).map((p) => `/${p.route} -> ${p.canonical}`);
console.log(`SEO audit of ${pages.length} pages (${site})`);
console.log(`  indexable pages: ${indexable.length}   sitemap URLs: ${sitemapUrls.length}   alias pages (canonical elsewhere): ${aliases.length}`);
for (const a of aliases) console.log('    alias ' + a);
console.log(`  words per page: ${pages.map((p) => `/${p.route}=${p.words}`).join(' ')}`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  - ` + warnings.join('\n  - '));
if (errors.length) {
  console.log(`\n${errors.length} ERROR(S):\n  - ` + errors.join('\n  - '));
  process.exit(1);
}
console.log('\nNo errors.');
