package in.shubhpatra.backend.payment;

import in.shubhpatra.backend.common.ApiException;
import in.shubhpatra.backend.common.Hmac;
import in.shubhpatra.backend.config.AppProperties;
import in.shubhpatra.backend.entitlement.EntitlementTokenService;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The purchase rules. The amount always comes from server configuration, an order becomes
 * PAID only after Razorpay's signature has been verified here (or through the signed webhook),
 * and a premium token is issued only for a PAID order.
 */
@Service
public class PaymentService {

	private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
	private static final String DEMO_ORDER_PREFIX = "order_demo_";
	private static final String DEMO_PAYMENT_PREFIX = "pay_demo";
	private static final SecureRandom RANDOM = new SecureRandom();

	private final AppProperties props;
	private final PaymentOrderRepository orders;
	private final RazorpayClient razorpay;
	private final EntitlementTokenService tokens;
	private final Clock clock;

	public PaymentService(AppProperties props, PaymentOrderRepository orders, RazorpayClient razorpay,
			EntitlementTokenService tokens, Clock clock) {
		this.props = props;
		this.orders = orders;
		this.razorpay = razorpay;
		this.tokens = tokens;
		this.clock = clock;
	}

	public int amountOf(ProductCode product) {
		return switch (product) {
			case PREMIUM_SINGLE -> props.pricing().premiumSingleAmount();
			case PREMIUM_COLLECTION -> props.pricing().premiumCollectionAmount();
		};
	}

	@Transactional
	public PaymentDtos.OrderResponse createOrder(ProductCode product, String templateId) {
		String template = null;
		if (product == ProductCode.PREMIUM_SINGLE) {
			if (templateId == null || !props.pricing().premiumTemplates().contains(templateId)) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "unknown_template");
			}
			template = templateId;
		}
		int amount = amountOf(product);
		String currency = props.pricing().currency();
		boolean demo = props.demoPayments();

		String receipt = "sp_" + randomHex(10);
		String orderId = demo
				? DEMO_ORDER_PREFIX + randomHex(12)
				: razorpay.createOrder(amount, currency, receipt,
						Map.of("product", product.name(), "template", template == null ? "all" : template));

		orders.save(new PaymentOrder(orderId, product, template, amount, currency, demo, clock.instant()));
		return new PaymentDtos.OrderResponse(orderId, amount, currency, demo ? "" : props.razorpay().keyId(), demo);
	}

	/** Called by the browser after checkout. The signature proves Razorpay accepted the payment. */
	@Transactional
	public PaymentDtos.GrantResponse verify(String orderId, String paymentId, String signature) {
		PaymentOrder order = orders.findByRazorpayOrderId(orderId)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "order_not_found"));
		if (order.isDemo()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "invalid_signature");
		}
		if (!Hmac.matchesHex(orderId + "|" + paymentId, props.razorpay().keySecret(), signature)) {
			log.warn("Rejected payment verification with a bad signature for {}", orderId);
			throw new ApiException(HttpStatus.BAD_REQUEST, "invalid_signature");
		}
		return grant(markPaid(order, paymentId));
	}

	/** Simulated payment for local testing. Refused unless the server runs in demo mode. */
	@Transactional
	public PaymentDtos.GrantResponse completeDemo(String orderId) {
		if (!props.demoPayments()) {
			throw new ApiException(HttpStatus.NOT_FOUND, "not_found");
		}
		PaymentOrder order = orders.findByRazorpayOrderId(orderId)
				.filter(PaymentOrder::isDemo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "order_not_found"));
		String paymentId = order.isPaid() ? order.getRazorpayPaymentId() : DEMO_PAYMENT_PREFIX + randomHex(14);
		return grant(markPaid(order, paymentId));
	}

	/** Called from the verified webhook so a payment is recorded even if the browser closed early. */
	@Transactional
	public void recordWebhookPayment(String orderId, String paymentId) {
		orders.findByRazorpayOrderId(orderId)
				.filter(o -> !o.isDemo())
				.ifPresent(o -> markPaid(o, paymentId));
	}

	/** Re-issues the token for a paid order, for example on a new device. */
	@Transactional(readOnly = true)
	public PaymentDtos.GrantResponse restore(String paymentId) {
		PaymentOrder order = orders.findByRazorpayPaymentId(paymentId)
				.filter(PaymentOrder::isPaid)
				.filter(o -> o.getExpiresAt() != null && o.getExpiresAt().isAfter(clock.instant()))
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "purchase_not_found"));
		return grant(order);
	}

	private PaymentOrder markPaid(PaymentOrder order, String paymentId) {
		if (order.isPaid()) {
			if (!order.getRazorpayPaymentId().equals(paymentId)) {
				log.warn("Order {} is already paid by a different payment", order.getRazorpayOrderId());
			}
			return order;
		}
		Instant now = clock.instant();
		order.markPaid(paymentId, now, now.plus(Duration.ofDays(props.pricing().validityDays())));
		return orders.save(order);
	}

	private PaymentDtos.GrantResponse grant(PaymentOrder order) {
		String scope = order.getProductCode() == ProductCode.PREMIUM_COLLECTION
				? EntitlementTokenService.COLLECTION_SCOPE
				: EntitlementTokenService.templateScope(order.getTemplateId());
		String token = tokens.issue(scope, order.getExpiresAt(), order.getRazorpayPaymentId());
		return new PaymentDtos.GrantResponse(token, scope, order.getExpiresAt().toString(), order.getRazorpayPaymentId());
	}

	private static String randomHex(int bytes) {
		byte[] buffer = new byte[bytes];
		RANDOM.nextBytes(buffer);
		return HexFormat.of().formatHex(buffer);
	}
}
