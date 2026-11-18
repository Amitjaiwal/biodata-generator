import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  noindex?: boolean;
  /** Language of the page content. Defaults to English. */
  lang?: 'en' | 'hi' | 'mr';
  /** Schema.org type of the page itself. Defaults to WebPage. */
  pageType?: 'WebPage' | 'CollectionPage' | 'AboutPage';
  /** Extra Schema.org objects to embed as JSON-LD (the WebPage entry is added automatically). */
  jsonLd?: object[];
}

export const SITE_NAME = 'ShubhPatra';

const LOCALES = { en: 'en_IN', hi: 'hi_IN', mr: 'mr_IN' } as const;
const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630, alt: 'ShubhPatra marriage biodata maker: sample marriage biodata templates' };

/** Sets title, description, canonical, Open Graph, Twitter and JSON-LD tags for a page. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(config: SeoConfig): void {
    const url = environment.siteUrl + (config.path === '/' ? '/' : config.path);
    const image = environment.siteUrl + OG_IMAGE.path;
    const lang = config.lang ?? 'en';

    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: config.noindex ? 'noindex, nofollow' : 'index, follow' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: String(OG_IMAGE.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(OG_IMAGE.height) });
    this.meta.updateTag({ property: 'og:image:alt', content: OG_IMAGE.alt });
    this.meta.updateTag({ property: 'og:locale', content: LOCALES[lang] });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: OG_IMAGE.alt });

    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;

    // Every indexable page describes itself with a WebPage entry that points at the site it belongs to.
    const page = {
      '@context': 'https://schema.org',
      '@type': config.pageType ?? 'WebPage',
      '@id': url + '#webpage',
      url,
      name: config.title,
      description: config.description,
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: environment.siteUrl + '/' },
    };

    this.document.head.querySelectorAll('script[data-sp-jsonld]').forEach((el) => el.remove());
    for (const data of [...(config.jsonLd ?? []), ...(config.noindex ? [] : [page])]) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-sp-jsonld', '');
      // "<" is escaped so the JSON can never close the script element.
      script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
      this.document.head.appendChild(script);
    }
  }
}
