# Phase 1 · Branding, Homepage Design, Architecture, Template Engine, Roadmap

## 1. Branding

- **Name:** ShubhPatra (शुभपत्र). Shubh = auspicious, Patra = document/letter. Short, pronounceable in all Indian languages.
- **Tagline:** Beautiful marriage biodata in minutes.
- **Logo:** Wordmark "Shubh**Patra**" with a small kalash/lotus mark in saffron-gold inside a rounded square.
- **Palette (UI, not templates):**
  - Primary `#B3261E` (deep kumkum red) · Primary-dark `#8C1D18`
  - Accent `#C9A227` (antique gold)
  - Ink `#1F1A17` · Muted `#6B625C`
  - Surfaces: `#FFFFFF`, `#FBF7F2` (warm ivory), border `#EADFD3`
- **Typography (UI):** Inter for UI text, Fraunces for display headings; Noto Sans/Serif Devanagari for Hindi/Marathi.
- **Voice:** warm, family-oriented, plain language, no jargon.

## 2. Homepage design

```
┌──────────────────────────────────────────────────────────────────┐
│ Header: Logo | Templates · Create · Pricing · FAQ | EN/हि/म | [Create Biodata] │
├──────────────────────────────────────────────────────────────────┤
│ HERO (ivory bg, two columns on desktop)                           │
│  H1  Create Your Perfect Marriage Biodata Online                  │
│  Sub Fill your details once, pick from 20+ designs, download an  │
│      A4 PDF in English, Hindi or Marathi. No sign-up. Private.    │
│  [Create Biodata]  [Explore Templates]                            │
│  ✓ No login  ✓ Stays on your device  ✓ Print-ready PDF            │
│                                   │  Fanned stack of 3 live       │
│                                   │  template cards (real render) │
├──────────────────────────────────────────────────────────────────┤
│ TRUST STRIP  20+ designs · 3 languages · ₹0 to start · Razorpay   │
├──────────────────────────────────────────────────────────────────┤
│ FEATURED TEMPLATES  horizontal grid of 8 cards (thumb, name,      │
│   Free/Premium chip, Preview / Use)  → "See all templates"        │
├──────────────────────────────────────────────────────────────────┤
│ HOW IT WORKS  3 steps: Choose design → Fill details → Download    │
├──────────────────────────────────────────────────────────────────┤
│ FEATURES  6 cards: live preview, switch anytime, Hindi/Marathi,   │
│   photo crop, custom fields, private by design                    │
├──────────────────────────────────────────────────────────────────┤
│ PRICING  3 cards: Free ₹0 · Premium ₹49 · Collection ₹99          │
├──────────────────────────────────────────────────────────────────┤
│ FAQ  accordion (8 questions)                                      │
├──────────────────────────────────────────────────────────────────┤
│ CTA band + FOOTER (Product · Formats by community · Languages ·   │
│   Legal: Privacy, Terms, Refund, Contact)                         │
└──────────────────────────────────────────────────────────────────┘
```

Mobile: single column, CTAs full width, template grid 2-up, sticky bottom "Create Biodata" bar on the homepage.

## 3. Application architecture

```
┌──────────────── Browser (Angular 21, SSR-prerendered marketing pages) ─────────────────┐
│ Pages: Home · Templates(+category) · Create(builder) · Pricing · Legal · SEO landings    │
│ State: BiodataStore (signals) ──> localStorage (autosave)                               │
│ Template registry (20 components) ──> PreviewEngine (A4 paginator) ──> PdfService       │
│ EntitlementService (signed tokens in localStorage) ──> PaymentService (Razorpay JS)     │
└──────────────┬──────────────────────────────────────────────────────────────┬──────────┘
               │ REST (JSON)                                                   │ Razorpay Checkout.js
┌──────────────▼──────────── Spring Boot 4 / Java 21 ─────────────────────────▼──────────┐
│ /api/config/pricing      GET  public pricing + Razorpay key id                           │
│ /api/payments/orders     POST create Razorpay order (server-side amount lookup)          │
│ /api/payments/verify     POST verify HMAC signature → persist → return entitlement token │
│ /api/payments/webhook    POST Razorpay webhook (signature verified) → mark paid          │
│ /api/entitlements/verify POST validate token (HMAC) → scope + expiry                     │
│ Spring Security: stateless, CORS allow-list, public endpoints, rate limit filter         │
│ Persistence: PostgreSQL (prod) / H2 PostgreSQL-mode (dev) via JPA + Flyway               │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

**Key principles**
- Biodata content and photos never reach the server. Only payment metadata (order id, amount, template scope, masked contact) is persisted.
- Razorpay secret and webhook secret are server-side env vars only.
- Entitlements are HMAC-signed tokens (`scope|expiry|nonce|signature`) issued only after signature verification. Frontend stores them, backend re-validates on demand; frontend never marks a purchase as paid from the checkout callback alone.
- Pricing comes from backend config (`application.yml` / env), so it is editable without a frontend build.

## 4. Folder structure

```
Biodata Maker/
├─ docs/                          planning + deployment docs
├─ frontend/                      Angular 21 (standalone, signals, zoneless, SSR prerender)
│  └─ src/app/
│     ├─ core/                    singletons: i18n, seo, storage, api, entitlement, payment, pdf
│     │  ├─ i18n/                 I18nService + en/hi/mr dictionaries (UI + biodata labels)
│     │  ├─ models/               Biodata, Template, Pricing, Entitlement interfaces
│     │  ├─ services/
│     │  └─ data/                 options (rashi, nakshatra, heights, blood groups, ...)
│     ├─ shared/                  ui: header, footer, language-switch, template-card, section-card
│     ├─ biodata/
│     │  ├─ store/                BiodataStore (signal store, autosave, sample data)
│     │  ├─ form/                 builder form sections (personal, birth, education, family...)
│     │  ├─ photo/                photo upload + cropper dialog
│     │  └─ preview/              PreviewEngine (A4 paginator), PreviewFrame, TemplateHost
│     ├─ templates/               template engine
│     │  ├─ registry.ts           TEMPLATES[]: id, name, category, tier, loader
│     │  ├─ base/                 ornaments (SVG), building blocks, shared SCSS mixins
│     │  └─ t01-*/ … t20-*/       one folder per template (component + scss)
│     ├─ pages/                   home, templates, create, pricing, legal, seo-landing
│     └─ app.routes.ts, app.config.ts
├─ backend/                       Spring Boot 4.1, Java 21, Maven wrapper
│  └─ src/main/java/in/shubhpatra/backend/
│     ├─ config/                  SecurityConfig, CorsConfig, PricingProperties, RazorpayProperties
│     ├─ payment/                 controller, service, Razorpay client, entity, repository
│     ├─ entitlement/             token service (HMAC), controller
│     └─ common/                  error handling, rate limiting
│  └─ src/main/resources/         application.yml, db/migration/V1__init.sql
└─ README.md
```

## 5. Template engine design

**One data model.** `Biodata` (see `core/models/biodata.model.ts`) holds: `meta` (language, blessing, symbol, title), `photo` (dataURL + crop), `sections: BiodataSection[]`. Each section has `id`, `key` (personal | birth | education | family | lifestyle | partner | contact | custom), `title` override, `visible`, `order`, and `fields: BiodataField[]` (`id`, `labelKey` or custom `label`, `value`, `visible`). Siblings are repeatable rows inside the family section.

**One form.** `BiodataFormComponent` renders section cards from the same model; it does not know about templates. Field definitions (type, options, label keys) come from `core/data/field-definitions.ts`.

**One preview engine.** `PreviewEngineComponent` receives `(biodata, templateId, language)` and:
1. Resolves the template component from the registry (lazy-loaded).
2. Produces a `RenderModel`: filtered visible sections, fields with non-empty values, labels localised by `I18nService` for the biodata language, formatted values (dates, height), photo URL, blessing text.
3. Passes `RenderModel` to the template, which renders the full content into an off-screen measuring A4 page. The engine measures `[data-bd-block]` elements and splits them into pages of fixed content height (A4 minus template padding). Blocks never split mid-field; a long section is split between field rows.
4. Renders the final pages, each a `.a4-page` (210mm × 297mm). The same DOM feeds the on-screen preview (scaled via CSS transform) and the PDF.

**Template contract.** Every template is a standalone component implementing `BiodataTemplate`:
```ts
interface BiodataTemplate {
  model: InputSignal<RenderModel>;   // data to render
  pages: InputSignal<PageBlocks[]>;   // paginated blocks, computed by engine
  mode: InputSignal<'measure' | 'render'>;
}
```
and declares a `TemplateDefinition` in the registry: `id`, `name`, `category[]`, `tier` (free | premium), `palette`, `fonts`, `supportsPhoto`, `thumbnail` (generated at build time from sample data), `load()`.

**Shared building blocks** (in `templates/base`): `OrnamentComponent` (mandala, paisley, floral corner, toran, jharokha arch, arabesque, geometric, lotus, peacock feather, kalash, swastik-free Jain symbol, crescent), `FieldRowsComponent` (label/value grid with configurable separator), `PhotoFrameComponent` (circle, arch, rounded, octagon, oval), `SacredHeaderComponent` (symbol + blessing). Each template composes these in a distinct layout with its own SCSS, type pairing and palette, so the 20 designs differ in structure, not just colour.

**Layout families (to ensure structural variety):**
1. Centered classic with ornate border frame (Traditional)
2. Left sidebar (photo + highlights) with content column (Modern)
3. Top banner with photo medallion overlapping (Royal)
4. Two-column grid of sections (Minimal)
5. Floral corners with asymmetric header (Floral)
6. Serif editorial with hairlines and small caps (Elegant)
7. Arch/jharokha frame with mandala watermark (Hindu/Royal)
8. Arabesque geometric border, crescent header, calligraphy-style title (Muslim)
9. Jain symbol header with lotus divider, soft saffron (Jain)
10. Paithani-stripe side band with Marathi typography (Marathi Special)

20 templates are derived by pairing these families with different decorative systems, type pairings and palettes.

**Fonts for Indic text:** Noto Sans Devanagari, Noto Serif Devanagari, Tiro Devanagari Marathi/Hindi, Baloo 2, Yatra One (display) via Google Fonts, preloaded on the builder route so html2canvas captures them.

**PDF.** `PdfService` waits for `document.fonts.ready`, renders each `.a4-page` with html2canvas at scale 3 (≈ 290 DPI), composites into jsPDF A4 portrait, one page per `.a4-page`, JPEG quality 0.95, and triggers a download. Premium templates without a valid entitlement render a diagonal watermark layer in both preview and PDF.

## 6. Development roadmap

| Phase | Deliverables | Status |
|---|---|---|
| 1 | Reference analysis, branding, homepage design, architecture, folder structure, template engine design | this document |
| 2 | Angular scaffold, design system, header/footer, homepage, template gallery with filters, 5 complete templates, thumbnails | next |
| 3 | Biodata model + store + autosave, multi-section form, photo crop, live preview, A4 paginator, template switching | |
| 4 | Remaining 15 templates, PDF generation, EN/HI/MR label dictionaries, Devanagari font testing | |
| 5 | Spring Boot backend: pricing config, Razorpay order/verify/webhook, entitlement tokens; pricing page; premium gating | |
| 6 | Responsive QA, bug fixes, SEO (meta, OG, JSON-LD, sitemap, robots, landing pages), deployment configs (Vercel, Render/Railway, Neon/Supabase Postgres) | |
