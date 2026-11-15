package in.shubhpatra.backend.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import in.shubhpatra.backend.common.Hmac;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Real-payment path with Razorpay keys configured (no network calls are made: orders are
 * inserted directly, and signatures are computed with the test secret as Razorpay would).
 */
@SpringBootTest(properties = {
		"app.razorpay.key-id=rzp_test_unitTestKey01",
		"app.razorpay.key-secret=unit-test-key-secret",
		"app.razorpay.webhook-secret=unit-test-webhook-secret",
		"app.rate-limit.requests-per-minute=1000" })
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class RazorpayVerificationTest {

	private static final String KEY_SECRET = "unit-test-key-secret";
	private static final String WEBHOOK_SECRET = "unit-test-webhook-secret";

	@Autowired
	MockMvc mvc;

	@Autowired
	PaymentOrderRepository orders;

	private String newOrder(String orderId) {
		orders.save(new PaymentOrder(orderId, ProductCode.PREMIUM_SINGLE, "rajwada", 4900, "INR", false, Instant.now()));
		return orderId;
	}

	@Test
	void validSignatureMarksOrderPaidAndIssuesToken() throws Exception {
		String orderId = newOrder("order_TestValid00001");
		String paymentId = "pay_TestValid00001";
		String signature = Hmac.sha256Hex(orderId + "|" + paymentId, KEY_SECRET);

		mvc.perform(post("/api/payments/verify").contentType(MediaType.APPLICATION_JSON)
				.content("{\"orderId\":\"" + orderId + "\",\"paymentId\":\"" + paymentId + "\",\"signature\":\"" + signature + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.scope").value("template:rajwada"))
				.andExpect(jsonPath("$.token").isNotEmpty());

		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(PaymentOrder::isPaid);
	}

	@Test
	void signatureForAnotherOrderIsRejected() throws Exception {
		String orderId = newOrder("order_TestWrong00001");
		String paymentId = "pay_TestWrong00001";
		String signature = Hmac.sha256Hex("order_SomeOtherOrder1|" + paymentId, KEY_SECRET);

		mvc.perform(post("/api/payments/verify").contentType(MediaType.APPLICATION_JSON)
				.content("{\"orderId\":\"" + orderId + "\",\"paymentId\":\"" + paymentId + "\",\"signature\":\"" + signature + "\"}"))
				.andExpect(status().isBadRequest());

		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(o -> !o.isPaid());
	}

	@Test
	void demoEndpointIsClosedWhenRazorpayIsConfigured() throws Exception {
		mvc.perform(post("/api/payments/demo/complete").contentType(MediaType.APPLICATION_JSON)
				.content("{\"orderId\":\"order_demo_000000000000000000000000\"}"))
				.andExpect(status().isNotFound());
	}

	@Test
	void signedWebhookRecordsThePayment() throws Exception {
		String orderId = newOrder("order_TestHook000001");
		String body = "{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":"
				+ "{\"id\":\"pay_TestHook000001\",\"order_id\":\"" + orderId + "\",\"status\":\"captured\"}}}}";

		mvc.perform(post("/api/payments/webhook").contentType(MediaType.APPLICATION_JSON).content(body)
				.header("X-Razorpay-Signature", Hmac.sha256Hex(body, WEBHOOK_SECRET)))
				.andExpect(status().isOk());

		assertThat(orders.findByRazorpayOrderId(orderId)).get()
				.matches(PaymentOrder::isPaid)
				.matches(o -> "pay_TestHook000001".equals(o.getRazorpayPaymentId()));
	}
}
