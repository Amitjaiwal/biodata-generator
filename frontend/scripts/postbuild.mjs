// Writes sitemap.xml and robots.txt into the build output.
// The sitemap is derived from the prerendered pages, so it only ever lists URLs that exist.
// Usage: SITE_URL=https://www.example.com node scripts/postbuild.mjs
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const outDir = join(import.meta.dirname, '..', 'dist', 'frontend', 'browser');
const siteUrl = (process.env.SITE_URL || 'https://www.shubhpatra.in').replace(/\/+$/, '');
const EXCLUDE = [/^404$/];

if (!existsSync(outDir)) {
  console.error('Build output not found: ' + outDir);
  process.exit(1);
}

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (name === 'index.html') found.push(relative(outDir, dir).split(sep).join('/'));
  }
  return found;
}

const routes = walk(outDir)
  .filter((r) => !EXCLUDE.some((re) => re.test(r)))
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

const priority = (r) => (r === '' ? '1.0' : r === 'templates' || r === 'create' ? '0.9' : r.includes('/') ? '0.7' : '0.8');
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((r) => `  <url><loc>${siteUrl}/${r}</loc><lastmod>${today}</lastmod><priority>${priority(r)}</priority></url>`)
  .join('\n');

writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(
  join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
console.log(`sitemap.xml: ${routes.length} URLs for ${siteUrl}`);
