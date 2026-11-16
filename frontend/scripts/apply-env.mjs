// Applies deploy-time settings from environment variables before the build.
//
//   API_BASE_URL  Full address of the backend API, ending in /api.
//                 Example: https://marriage-biodata-api.onrender.com/api
//                 When unset, the site keeps calling /api on its own domain (used by Netlify
//                 rewrites and by the local dev server proxy).
//
// The value is written into src/environments/environment.production.ts in the build workspace
// only. Set it as a build variable on the hosting dashboard; it is not a secret.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const file = join(import.meta.dirname, '..', 'src', 'environments', 'environment.production.ts');
const raw = (process.env.API_BASE_URL ?? '').trim().replace(/\/+$/, '');

if (!raw) {
  console.log('API_BASE_URL is not set: the site will call /api on its own domain.');
  process.exit(0);
}

// Strict check: the value is written into source code, so only a plain https address is allowed.
if (!/^https:\/\/[a-z0-9.-]+(:\d{2,5})?\/[A-Za-z0-9._~/-]*api$/i.test(raw)) {
  console.error(`API_BASE_URL must be an https address ending in /api, for example https://example.onrender.com/api. Got: ${raw}`);
  process.exit(1);
}

const source = readFileSync(file, 'utf8');
const pattern = /apiBaseUrl:\s*(["'])[^"']*\1/;
if (!pattern.test(source)) {
  console.error('Could not find apiBaseUrl in ' + file);
  process.exit(1);
}
writeFileSync(file, source.replace(pattern, `apiBaseUrl: '${raw}'`));
console.log(`apiBaseUrl set to ${raw}`);
