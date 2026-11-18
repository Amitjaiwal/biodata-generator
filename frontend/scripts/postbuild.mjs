// Writes sitemap.xml, robots.txt and 404.html into the build output.
// The sitemap is derived from the prerendered pages, so it only ever lists URLs that exist.
// 404.html is the client-rendered app shell: static hosts serve it, with a 404 status, for any
// unknown address, and the app then shows its own "Page not found" page.
// Usage: SITE_URL=https://www.example.com node scripts/postbuild.mjs
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const outDir = join(import.meta.dirname, '..', 'dist', 'frontend', 'browser');
const siteUrl = (process.env.SITE_URL || 'https://marriagesbiodatamaker.com').replace(/\/+$/, '');
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

const canonicalOf = (route) => {
  const html = readFileSync(join(outDir, route, 'index.html'), 'utf8');
  const tag = /<link\b[^>]*rel="canonical"[^>]*>/.exec(html.slice(0, html.indexOf('</head>')));
  return tag ? (/href="([^"]*)"/.exec(tag[0]) ?? [])[1] : undefined;
};

// Only pages that are their own canonical address go in the sitemap. A page whose canonical points
// elsewhere (an old address kept for visitors) must not be listed, or search engines get two answers
// for one page. lastmod and priority are left out: search engines ignore a priority and distrust a
// lastmod that is simply the build date of every page.
const routes = walk(outDir)
  .filter((r) => !EXCLUDE.some((re) => re.test(r)))
  .filter((r) => {
    const own = r === '' ? siteUrl + '/' : `${siteUrl}/${r}`;
    const canonical = canonicalOf(r);
    if (canonical && canonical !== own) console.log(`sitemap: skipping /${r} (canonical is ${canonical})`);
    return !canonical || canonical === own;
  })
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

const urls = routes.map((r) => `  <url><loc>${siteUrl}/${r}</loc></url>`).join('\n');

writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(
  join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
const shell = join(outDir, 'index.csr.html');
if (!existsSync(shell)) {
  console.error('index.csr.html not found: cannot create 404.html');
  process.exit(1);
}
copyFileSync(shell, join(outDir, '404.html'));

console.log(`sitemap.xml: ${routes.length} URLs for ${siteUrl}; 404.html written`);
