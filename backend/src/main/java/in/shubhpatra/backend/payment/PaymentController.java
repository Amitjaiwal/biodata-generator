package in.shubhpatra.backend.payment;

import in.shubhpatra.backend.common.Hmac;
import in.shubhpatra.backend.config.AppProperties;
import in.shubhpatra.backend.payment.PaymentDtos.CreateOrderRequest;
import in.shubhpatra.backend.payment.PaymentDtos.DemoCompleteRequest;
import in.shubhpatra.backend.payment.PaymentDtos.GrantResponse;
import in.shubhpatra.backend.payment.PaymentDtos.OrderResponse;
import in.shubhpatra.backend.payment.PaymentDtos.PricingResponse;
import in.shubhpatra.backend.payment.PaymentDtos.ProductView;
import in.shubhpatra.backend.payment.PaymentDtos.VerifyRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.json.JsonMapper;

@RestController
@RequestMapping("/api")
public class PaymentController {

	private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

	private final PaymentService payments;
	private final AppProperties props;
	private final JsonMapper json;

	public PaymentController(PaymentService payments, AppProperties props, JsonMapper json) {
		this.payments = payments;
		this.props = props;
		this.json = json;
	}

	/** Public prices, so they can be changed on the server without rebuilding the site. */
	@GetMapping("/config/pricing")
	PricingResponse pricing() {
		String currency = props.pricing().currency();
		int days = props.pricing().validityDays();
		List<ProductView> products = List.of(
				new ProductView(ProductCode.PREMIUM_SINGLE, payments.amountOf(ProductCode.PREMIUM_SINGLE), currency, days),
				new ProductView(ProductCode.PREMIUM_COLLECTION, payments.amountOf(ProductCode.PREMIUM_COLLECTION), currency, days));
		return new PricingResponse(currency, products, props.demoPayments());
	}

	@PostMapping("/payments/orders")
	OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
		return payments.createOrder(request.productCode(), request.templateId());
	}

	@PostMapping("/payments/verify")
	GrantResponse verify(@Valid @RequestBody VerifyRequest request) {
		return payments.verify(request.orderId(), request.paymentId(), request.signature());
	}

	@PostMapping("/payments/demo/complete")
	GrantResponse completeDemo(@Valid @RequestBody DemoCompleteRequest request) {
		return payments.completeDemo(request.orderId());
	}

	/**
	 * Razorpay webhook. The raw body is authenticated with the webhook secret before anything
	 * in it is trusted. Subscribe it to the "payment.captured" and "order.paid" events.
	 */
	@PostMapping("/payments/webhook")
	ResponseEntity<Void> webhook(@RequestBody String body,
			@RequestHeader(name = "X-Razorpay-Signature", required = false) String signature) {
		if (!Hmac.matchesHex(body, props.razorpay().webhookSecret(), signature)) {
			log.warn("Rejected webhook with a missing or invalid signature");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		try {
			Map<?, ?> event = json.readValue(body, Map.class);
			Object type = event.get("event");
			if ("payment.captured".equals(type) || "order.paid".equals(type)) {
				Map<?, ?> payment = child(child(child(event, "payload"), "payment"), "entity");
				if (payment.get("order_id") instanceof String orderId && payment.get("id") instanceof String paymentId) {
					payments.recordWebhookPayment(orderId, paymentId);
				}
			}
		}
		catch (RuntimeException e) {
			// Acknowledge anyway: a malformed but authentic event should not be retried forever.
			log.error("Could not process webhook: {}", e.getMessage());
		}
		return ResponseEntity.ok().build();
	}

	private static Map<?, ?> child(Map<?, ?> map, String key) {
		return map.get(key) instanceof Map<?, ?> m ? m : Map.of();
	}
}
