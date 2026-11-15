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
  /** Schema.org objects to embed as JSON-LD. */
  jsonLd?: object[];
}

export const SITE_NAME = 'ShubhPatra';

/** Sets title, description, canonical, Open Graph, Twitter and JSON-LD tags for a page. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(config: SeoConfig): void {
    const url = environment.siteUrl + (config.path === '/' ? '/' : config.path);
    const image = environment.siteUrl + '/og-image.png';

    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: config.noindex ? 'noindex, nofollow' : 'index, follow' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;

    this.document.head.querySelectorAll('script[data-sp-jsonld]').forEach((el) => el.remove());
    for (const data of config.jsonLd ?? []) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-sp-jsonld', '');
      // "<" is escaped so the JSON can never close the script element.
      script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
      this.document.head.appendChild(script);
    }
  }
}
