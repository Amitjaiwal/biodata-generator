import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderResponse, EntitlementGrant, ProductCode } from '../models/commerce.model';
import { EntitlementService } from './entitlement.service';
import { SITE_NAME } from './seo.service';

export type PaymentFailure = 'cancelled' | 'failed' | 'unavailable' | 'verify';

export class PaymentError extends Error {
  constructor(readonly reason: PaymentFailure) {
    super(reason);
  }
}

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', handler: () => void): void;
}

type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Google Ads "Purchase" conversion: tag ID and conversion label. Not secret; both appear in page source. */
const GOOGLE_ADS_PURCHASE = 'AW-18584561813/-VYJCPq4ybsdEJXR551F';

/** After this long without the payment window, show the "not opening?" hint. */
const SLOW_AFTER_MS = 15_000;

/**
 * Runs a purchase end to end. The amount is decided by the server from the product code, and
 * access is granted only by the token the server returns after verifying Razorpay's signature.
 * Nothing in this class can mark an order as paid on its own.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly dialog = inject(MatDialog);
  private readonly entitlements = inject(EntitlementService);
  private scriptPromise: Promise<void> | null = null;
  private abortPreparing: (() => void) | null = null;

  /**
   * 'preparing' lasts from the click until Razorpay's window (or the demo dialog) opens. On the free
   * backend this is where the wait happens, because the first request can hit a sleeping server.
   */
  readonly phase = signal<'idle' | 'preparing' | 'open'>('idle');
  /** True once preparing has taken longer than SLOW_AFTER_MS, so the screen can offer a way out. */
  readonly slow = signal(false);

  async purchase(productCode: ProductCode, templateId: string | null, description: string): Promise<EntitlementGrant> {
    this.phase.set('preparing');
    this.slow.set(false);
    const slowTimer = setTimeout(() => this.slow.set(true), SLOW_AFTER_MS);
    // Rejects when the buyer gives up while we are still preparing. Raced against each wait below.
    const aborted = new Promise<never>((_, reject) => {
      this.abortPreparing = () => reject(new PaymentError('cancelled'));
    });
    aborted.catch(() => undefined);

    try {
      let order: CreateOrderResponse;
      try {
        order = await Promise.race([
          firstValueFrom(
            this.http.post<CreateOrderResponse>(`${environment.apiBaseUrl}/payments/orders`, { productCode, templateId }),
          ),
          aborted,
        ]);
      } catch (e) {
        throw e instanceof PaymentError ? e : new PaymentError('unavailable');
      }

      const grant = order.demo
        ? await this.demoCheckout(order)
        : await this.razorpayCheckout(order, description, aborted);
      this.entitlements.add(grant);
      // Only a server-verified, real payment counts as an ad conversion. Demo payments never do.
      if (!order.demo) this.trackPurchase(order.amount, grant.paymentId);
      return grant;
    } finally {
      clearTimeout(slowTimer);
      this.abortPreparing = null;
      this.slow.set(false);
      this.phase.set('idle');
    }
  }

  /**
   * Tells Google Ads about a completed purchase. `amount` is in paise. The payment ID doubles as the
   * transaction ID, so Google drops a duplicate if the same payment is ever reported twice.
   * Never throws: tracking must not break a purchase.
   */
  private trackPurchase(amountPaise: number, paymentId: string): void {
    try {
      const gtag = (this.document.defaultView as unknown as { gtag?: (...args: unknown[]) => void } | null)?.gtag;
      gtag?.('event', 'conversion', {
        send_to: GOOGLE_ADS_PURCHASE,
        value: amountPaise / 100,
        currency: 'INR',
        transaction_id: paymentId,
      });
    } catch {
      // Ignore: an ad blocker or a missing tag must not affect the buyer.
    }
  }

  /** Lets the buyer stop waiting for the window to open. Does nothing once Razorpay is showing. */
  cancelPreparing(): void {
    this.abortPreparing?.();
  }

  private async razorpayCheckout(
    order: CreateOrderResponse,
    description: string,
    aborted: Promise<never>,
  ): Promise<EntitlementGrant> {
    try {
      await Promise.race([this.loadScript(), aborted]);
    } catch (e) {
      throw e instanceof PaymentError ? e : new PaymentError('unavailable');
    }
    const Razorpay = (this.document.defaultView as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
    if (!Razorpay) throw new PaymentError('unavailable');

    // Our own dialogs would otherwise cover Razorpay's window (see .sp-checkout-open in styles.scss).
    const body = this.document.body;
    body.classList.add('sp-checkout-open');
    let success: RazorpaySuccess;
    try {
      success = await new Promise<RazorpaySuccess>((resolve, reject) => {
        let failedOnce = false;
        const checkout = new Razorpay({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: SITE_NAME,
          description,
          theme: { color: '#B3261E' },
          handler: (response: RazorpaySuccess) => resolve(response),
          // Closing Razorpay's window ends the attempt. If a payment failed before that, report
          // the failure instead of a plain cancel.
          modal: { ondismiss: () => reject(new PaymentError(failedOnce ? 'failed' : 'cancelled')) },
        });
        // A failed payment leaves Razorpay's window open so the buyer can retry another method.
        // The attempt is only over once the payment succeeds or the window is closed.
        checkout.on('payment.failed', () => (failedOnce = true));
        checkout.open();
        this.abortPreparing = null;
        this.phase.set('open');
      });
    } finally {
      body.classList.remove('sp-checkout-open');
    }

    try {
      return await firstValueFrom(
        this.http.post<EntitlementGrant>(`${environment.apiBaseUrl}/payments/verify`, {
          orderId: success.razorpay_order_id,
          paymentId: success.razorpay_payment_id,
          signature: success.razorpay_signature,
        }),
      );
    } catch {
      throw new PaymentError('verify');
    }
  }

  /** Local testing only: the server offers this path when it has no Razorpay keys. */
  private async demoCheckout(order: CreateOrderResponse): Promise<EntitlementGrant> {
    this.abortPreparing = null;
    this.phase.set('open');
    const { DemoCheckoutDialog } = await import('../../shared/demo-checkout-dialog');
    const ok = await firstValueFrom(
      this.dialog.open<unknown, { amount: number }, boolean>(DemoCheckoutDialog, {
        data: { amount: order.amount },
        width: '420px',
        maxWidth: '94vw',
        autoFocus: 'dialog',
      }).afterClosed(),
    );
    if (ok === undefined) throw new PaymentError('cancelled');
    if (!ok) throw new PaymentError('failed');
    try {
      return await firstValueFrom(
        this.http.post<EntitlementGrant>(`${environment.apiBaseUrl}/payments/demo/complete`, { orderId: order.orderId }),
      );
    } catch (e) {
      throw new PaymentError(e instanceof HttpErrorResponse && e.status === 0 ? 'unavailable' : 'verify');
    }
  }

  private loadScript(): Promise<void> {
    this.scriptPromise ??= new Promise<void>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = CHECKOUT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.scriptPromise = null;
        script.remove();
        reject(new Error('Razorpay checkout failed to load'));
      };
      this.document.head.appendChild(script);
    });
    return this.scriptPromise;
  }
}
