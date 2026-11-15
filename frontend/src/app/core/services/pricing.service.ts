import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PricingConfig, Product, ProductCode } from '../models/commerce.model';

/** Shown until the backend answers, and when it cannot be reached. The server stays authoritative. */
const FALLBACK: PricingConfig = {
  currency: 'INR',
  demoMode: false,
  products: [
    { code: 'PREMIUM_SINGLE', amount: 4900, currency: 'INR', validityDays: 365 },
    { code: 'PREMIUM_COLLECTION', amount: 9900, currency: 'INR', validityDays: 365 },
  ],
};

/** Prices come from the backend so they can be changed without rebuilding the site. */
@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private requested = false;

  readonly config = signal<PricingConfig>(FALLBACK);

  /** Fetches live prices once. Safe to call from any component. */
  load(): void {
    if (!this.browser || this.requested) return;
    this.requested = true;
    firstValueFrom(this.http.get<PricingConfig>(`${environment.apiBaseUrl}/config/pricing`))
      .then((cfg) => {
        if (cfg && Array.isArray(cfg.products) && cfg.products.length) this.config.set(cfg);
      })
      .catch(() => {
        // Backend unreachable: keep the fallback prices and allow a retry later.
        this.requested = false;
      });
  }

  product(code: ProductCode): Product {
    return this.config().products.find((p) => p.code === code) ?? FALLBACK.products.find((p) => p.code === code)!;
  }

  /** Formats paise as rupees: 4900 becomes "₹49". */
  format(amount: number): string {
    const rupees = amount / 100;
    return '₹' + (Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2));
  }

  price(code: ProductCode): string {
    return this.format(this.product(code).amount);
  }
}
