import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/** Safe JSON wrapper around localStorage. Works (as a no-op) during prerendering. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string): T | null {
    if (!this.browser) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  /** Returns false when the value could not be saved, for example when storage is full. */
  set(key: string, value: unknown): boolean {
    if (!this.browser) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key: string): void {
    if (!this.browser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable (private mode); nothing to remove.
    }
  }
}
