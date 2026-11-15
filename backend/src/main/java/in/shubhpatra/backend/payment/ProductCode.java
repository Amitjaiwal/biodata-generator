package in.shubhpatra.backend.payment;

/** Things that can be bought. Prices live in configuration, never in the request. */
public enum ProductCode {
	/** One premium template of the buyer's choice. */
	PREMIUM_SINGLE,
	/** Every premium template. */
	PREMIUM_COLLECTION
}
