export type ProductCode = 'PREMIUM_SINGLE' | 'PREMIUM_COLLECTION';

export interface Product {
  code: ProductCode;
  /** Price in paise. */
  amount: number;
  currency: string;
  validityDays: number;
}

export interface PricingConfig {
  currency: string;
  products: Product[];
  /** True when the backend runs without Razorpay keys (local testing only). */
  demoMode: boolean;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  demo: boolean;
}

export interface EntitlementGrant {
  token: string;
  scope: string;
  expiresAt: string;
  paymentId: string;
}
