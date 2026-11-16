# ShubhPatra: Indian Marriage Biodata Maker

Create a marriage biodata online, preview it live in 28 original designs, and download an A4 PDF in English, Hindi or Marathi. Free templates need no payment; premium templates are unlocked with a one-time Razorpay payment.

| Part | Stack | Folder |
|---|---|---|
| Website | Angular 21, Angular Material, SCSS, prerendered static pages | [frontend/](frontend/) |
| API | Java 21, Spring Boot 4, Spring Security, JPA, Flyway | [backend/](backend/) |
| Database | PostgreSQL in production, in-memory H2 for local runs | |
| Planning | Competitor analysis, architecture, template engine design | [docs/](docs/) |

## Run it locally

Requirements: Node 22+, Java 21+.

```bash
# 1. API on http://localhost:8080 (dev profile: H2 database, simulated payments)
cd backend
./mvnw spring-boot:run

# 2. Website on http://localhost:4200 (proxies /api to the backend)
cd frontend
npm install
npm start
```

If `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`, that is a bug in npm 10.9. Use `npx npm@11 install` instead.

The website works without the backend too: free templates, the builder and PDF download are fully client-side. Only premium purchases need the API.

### Testing payments

- **No Razorpay keys (default):** the backend runs in demo mode. Checkout is replaced by a clearly labelled test dialog where you simulate success or failure. No money moves.
- **Razorpay test keys:** set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` before starting the backend. The real Razorpay Checkout opens in test mode.

## Tests

```bash
cd frontend && npm test -- --watch=false   # pagination, render model, formatting, validation
cd backend && ./mvnw test                  # token signing, payment verification, webhook, access rules
```

## How it is built

**One data model, one form, one preview engine, many designs.**

- `frontend/src/app/core/models/biodata.model.ts` is the single biodata model. `core/data/fields.ts` defines every built-in field once.
- `biodata/form/` is the only form. It renders sections and fields from the model and knows nothing about templates.
- `biodata/render/render-model.ts` turns the biodata into a template-agnostic render model: hidden sections and empty fields removed, labels localized, values formatted. User-typed text is never translated.
- `biodata/preview/preview-engine.ts` measures the content, splits it into A4 pages and renders them. The same DOM is used for the on-screen preview and for the PDF.
- `templates/designs/` holds the 28 designs. Each is one small component plus one stylesheet. `templates/registry.ts` is the catalogue.

**To add a design:** copy a file pair in `templates/designs/`, change the markup and styles, and add one entry to `templates/registry.ts`. If it is premium, also add its id to `app.pricing.premium-templates` in `backend/src/main/resources/application.yml`. A backend test (`PremiumTemplatesInSyncTest`) fails if the two lists drift apart.

**PDF-safe styling.** The PDF is drawn by html2canvas, which cannot paint `box-shadow`, `clip-path`, conic gradients, filters or masks, and a global class such as `.card` leaks into designs. Build frames, ribbons and shaped photos from borders, plain backgrounds and SVG images (see `templates/base/ornaments-extra.ts`), and check a new design in the PDF output with a real JPEG photo before shipping it.

**Privacy.** Biodata details and photos stay in the browser (localStorage). The PDF is generated on the device. The backend stores only payment references.

**Payments.** Prices are read from the backend (`/api/config/pricing`). The server creates the Razorpay order with its own amount, verifies the payment signature, and only then issues an HMAC-signed access token. The site asks the server to confirm that token before every premium download. A signed webhook records payments even if the buyer closes the tab early.

## Change prices

Set these on the backend and restart. No frontend build is needed.

```
APP_PRICE_PREMIUM_SINGLE=4900       # paise (₹49)
APP_PRICE_PREMIUM_COLLECTION=9900   # paise (₹99)
APP_VALIDITY_DAYS=365
```

## Deploy

A step-by-step guide with a troubleshooting table is in [docs/03-deployment.md](docs/03-deployment.md). The short version follows.

### 1. Database
Create a managed PostgreSQL database (Neon, Supabase and Railway all have free or low-cost tiers). Flyway creates the table on first start.

### 2. Backend
Deploy `backend/` to any Java or Docker host (Render, Railway, Fly.io). A `Dockerfile` is included. Set the variables listed in [backend/.env.example](backend/.env.example). The backend refuses to start in production without Razorpay keys.

In the Razorpay dashboard add a webhook pointing to `https://YOUR-BACKEND-HOST/api/payments/webhook` for the events `payment.captured` and `order.paid`, and use the same secret as `RAZORPAY_WEBHOOK_SECRET`.

### 3. Frontend
Deploy `frontend/` to Netlify (`netlify.toml`), Cloudflare (`wrangler.jsonc`) or Vercel (`vercel.json`). All three files are included. Every page is a prerendered file and unknown addresses get `404.html`, so no rewrite rules are needed for pages.

- **Netlify:** set the base directory to `frontend`.
- **Cloudflare Workers:** root directory `frontend`, build command `npm run build`, deploy command `npx wrangler deploy`, variable `NODE_VERSION=22`.

1. Set the backend address in the `/api` rule of the config file (commented out in `netlify.toml` until the backend exists). Cloudflare Workers has no equivalent rule, so a small proxy is needed there. The site calls `/api/...` on its own domain and the host forwards it to the backend, so no CORS setup is needed.
2. Set your domain in `frontend/src/environments/environment.production.ts` (`siteUrl`) and pass the same value as the `SITE_URL` build variable so the sitemap uses it.
3. Build command: `npm run build`. Output: `dist/frontend/browser`.

### Before going live

- The site address is set to `https://marriagesbiodatamaker.com` in `frontend/src/environments/environment.production.ts`, `frontend/scripts/postbuild.mjs` and `backend/.env.example`. The support email is in `frontend/src/app/core/data/site.ts`. Change them there if either ever changes.
- Have the privacy, terms and refund pages reviewed for your business. Razorpay requires these pages during onboarding.
- Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.

## SEO

Marketing pages are prerendered to static HTML: the homepage, the gallery, ten category pages, the pricing page, legal pages and six landing pages (Hindu, Muslim, Jain, Marathi, Hindi, and the format guide). Each sets its own title, description, canonical URL, Open Graph tags and JSON-LD. `sitemap.xml` and `robots.txt` are generated from the built pages by `frontend/scripts/postbuild.mjs`.
