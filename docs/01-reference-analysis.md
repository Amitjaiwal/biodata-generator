# Phase 1 · Reference Website Analysis

Date: 15 Nov 2026. All five reference sites were accessible and were reviewed for homepage, navigation, gallery, builder flow, preview, PDF, pricing, languages and mobile behaviour.

## Side-by-side summary

| Aspect | Jodinama | Marriage Profile Builder | BiodataPress | BiodataSetu | MarathiBiodataMake |
|---|---|---|---|---|---|
| Hero headline | "Free online marriage biodata maker" | "The beautiful way to make a marriage biodata" | "Create a beautiful Marriage Biodata in 2 minutes" | "Make a beautiful marriage biodata in 3 minutes" | "Free Marathi Biodata Maker for Marriage" |
| Primary CTAs | Create your biodata / Browse templates | Create Your Biodata / Browse Templates | Create My Biodata — Free / Browse 120 Templates | Make my biodata, free / See all designs | Create Biodata — Free / See all templates |
| Templates | 43 designs, 149 colourways | "305+" (mostly colour variants) | 120 (5 free, text-only) | 9 designs × colours | 35 (19 free, 16 premium) |
| Categories | Traditional, Royal, Folk art, Minimal, Floral | Traditional, Royal, Floral, Modern, Minimal | Traditional, Royal, Floral, Modern, Minimal, Elegant, Festive, Luxury | Free / Premium only | Toran, Jharokha, Paisley, Rangoli, Royal dark |
| Free tier | Watermarked, unlimited | Watermarked image | 5 text-only templates, no watermark | 3 designs with footer line + QR | 19 templates, no watermark |
| Premium price | ₹49 / ₹79 / ₹99 per template | ₹29 image, ₹39 PDF+image (7 days), ₹9,999 lifetime | from ₹49, luxury ₹99 | ₹49 unlocks all | ₹49 unlock per device |
| Payment | Razorpay | Razorpay | Razorpay (UPI, cards, netbanking) | Razorpay | Razorpay |
| Login | None | Optional | None (private return link) | None | None |
| Data storage | Browser only | Server when logged in | Browser + private link | Browser only | Browser only |
| Languages | 9 Indian + bilingual labels | 9 | EN, HI, MR, GU | 6 | EN, HI, MR with live transliteration |
| PDF | A4 300 DPI, generated on device; light "WhatsApp" variant | A4 PDF + PNG/JPG | A4 PDF, vector text, PNG | A4 PDF + WhatsApp image | PDF + JPG + DOCX |
| Live preview | Yes, A4 identical to PDF | Yes | Yes | Yes | Yes |
| Template switch keeps data | Yes (data separate from design) | Yes | Not described | Yes | Yes |
| Section control | Add/rename/reorder/hide, drag-drop | Rename/reorder/delete/add | Rename/add/remove/reorder | Omit any field | Rename/add/reorder/hide |
| Religious header | Sacred symbol + blessing | Ganesha icon | Sample uses Ganesha line | Ganesha / deity / Om / Ik Onkar / Cross / Jain / plain | Religion presets change symbol + fields |
| Horoscope | Optional, hidden until enabled | Full Kundli fields | Rashi, Nakshatra, Gotra, Manglik | Optional | Auto-fills gan/nadi/charan from nakshatra; kundali chart |
| Extras | Fit-to-one-page, advice guides | Samples, blog, dashboard | Partner program for cyber cafés, blank DOCX formats | Marriage Portfolio ₹199 (private page) | Free tools (kundali, muhurat, typing) |

## Patterns worth adopting

1. **No sign-up, browser-first privacy.** Every site stresses that details never leave the device. This is both a trust signal and a cost saver.
2. **Data is separate from design.** Fill once, switch templates instantly. This is the heart of the product.
3. **Live A4 preview identical to the PDF.** Users judge the product by the preview; it must be the same DOM that produces the PDF.
4. **Blank fields disappear.** No "N/A" rows; the layout tightens.
5. **Blessing line + sacred symbol** at the top, selectable per religion (Ganesha, Om, Bismillah/crescent, Jain symbol, Ik Onkar, Cross, none).
6. **Section controls:** hide, rename, reorder, add custom fields, add siblings.
7. **Low-friction pricing:** one-time ₹49–₹99, UPI first, price shown before you start, and a free path that is genuinely usable.
8. **Preview premium templates with your own data before paying** (watermark on preview, clean after payment).
9. **Language switch changes field labels, not user content.**
10. **Community and language landing pages** drive SEO (Hindu / Muslim / Jain / Marathi / Hindi biodata format).
11. **WhatsApp-friendly output** (lighter PDF or JPG).

## Gaps and weaknesses observed

- "300+ templates" that are really colour variants feels inflated; sample data with "Sample" placeholders undermines trust.
- Free tiers that disable photos or stamp a QR code frustrate users; a faint watermark on premium previews is the fairest approach.
- Builders are often one giant form; a stepper with section chips and sticky preview is easier on mobile.
- Several sites lack an explicit refund/terms page in the primary nav; Razorpay onboarding requires them.

## Product decisions for our build

- Brand: **ShubhPatra** (शुभपत्र), "The auspicious document". Tagline: *Beautiful marriage biodata in minutes.*
- 20 genuinely different templates across 10 categories; 8 free, 12 premium; all support photo.
- Free: unlimited clean downloads of free templates. Premium: ₹49 per template or ₹99 for the whole collection, one-time, configurable from the backend.
- No accounts. Biodata lives in localStorage; entitlements are signed tokens issued by the backend after Razorpay verification.
- Languages: English, Hindi, Marathi for UI and biodata labels, independently selectable.
- PDF: A4 portrait rendered on-device from the exact preview DOM at ~290 DPI, multipage.
