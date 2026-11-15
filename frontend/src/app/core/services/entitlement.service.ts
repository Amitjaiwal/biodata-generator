import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntitlementGrant } from '../models/commerce.model';
import { StorageService } from './storage.service';

const KEY = 'sp.entitlements';
export const COLLECTION_SCOPE = 'collection';
export const templateScope = (templateId: string): string => `template:${templateId}`;

/**
 * Premium access. Grants are HMAC-signed tokens issued by the backend after it has verified
 * a Razorpay payment. The browser only stores them; `verify()` asks the server to confirm a
 * token before every premium download, so a forged local entry unlocks nothing.
 */
@Injectable({ providedIn: 'root' })
export class EntitlementService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  readonly grants = signal<EntitlementGrant[]>([]);
  private readonly verified = new Set<string>();

  restore(): void {
    const saved = this.storage.get<EntitlementGrant[]>(KEY);
    if (!Array.isArray(saved)) return;
    this.grants.set(
      saved.filter((g) => g && typeof g.token === 'string' && typeof g.scope === 'string' && typeof g.expiresAt === 'string'),
    );
  }

  add(grant: EntitlementGrant): void {
    this.grants.update((list) => [...list.filter((g) => g.token !== grant.token), grant]);
    this.verified.add(grant.token);
    this.storage.set(KEY, this.grants());
  }

  /** Local check used for UI state (badges, watermark). Not a security boundary. */
  has(templateId: string): boolean {
    return !!this.find(templateId);
  }

  hasCollection(): boolean {
    return this.grants().some((g) => g.scope === COLLECTION_SCOPE && !this.expired(g));
  }

  /** Server-side confirmation that a stored grant really covers this template. */
  async verify(templateId: string): Promise<boolean> {
    const grant = this.find(templateId);
    if (!grant) return false;
    if (this.verified.has(grant.token)) return true;
    const res = await firstValueFrom(
      this.http.post<{ valid: boolean }>(`${environment.apiBaseUrl}/entitlements/verify`, { token: grant.token, templateId }),
    );
    if (res.valid) {
      this.verified.add(grant.token);
      return true;
    }
    this.grants.update((list) => list.filter((g) => g.token !== grant.token));
    this.storage.set(KEY, this.grants());
    return false;
  }

  /** Re-issues a grant on a new device from a Razorpay payment id. */
  async restoreByPaymentId(paymentId: string): Promise<EntitlementGrant> {
    const grant = await firstValueFrom(
      this.http.post<EntitlementGrant>(`${environment.apiBaseUrl}/entitlements/restore`, { paymentId }),
    );
    this.add(grant);
    return grant;
  }

  private find(templateId: string): EntitlementGrant | undefined {
    const scope = templateScope(templateId);
    return this.grants().find((g) => (g.scope === COLLECTION_SCOPE || g.scope === scope) && !this.expired(g));
  }

  private expired(g: EntitlementGrant): boolean {
    const t = Date.parse(g.expiresAt);
    return Number.isNaN(t) || t < Date.now();
  }
}
