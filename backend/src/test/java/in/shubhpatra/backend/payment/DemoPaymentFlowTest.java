package in.shubhpatra.backend.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

/** End-to-end API flow with simulated payments (dev profile, in-memory database). */
@SpringBootTest(properties = "app.rate-limit.requests-per-minute=1000")
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class DemoPaymentFlowTest {

	@Autowired
	MockMvc mvc;

	@Autowired
	JsonMapper json;

	@Autowired
	PaymentOrderRepository orders;

	@Test
	void pricingIsPublicAndConfigured() throws Exception {
		mvc.perform(get("/api/config/pricing"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currency").value("INR"))
				.andExpect(jsonPath("$.demoMode").value(true))
				.andExpect(jsonPath("$.products[0].code").value("PREMIUM_SINGLE"))
				.andExpect(jsonPath("$.products[0].amount").value(4900))
				.andExpect(jsonPath("$.products[1].amount").value(9900));
	}

	@Test
	void singleTemplatePurchaseUnlocksOnlyThatTemplate() throws Exception {
		Map<?, ?> order = postJson("/api/payments/orders", "{\"productCode\":\"PREMIUM_SINGLE\",\"templateId\":\"maharaja\"}", 200);
		assertThat(order.get("amount")).isEqualTo(4900);
		assertThat(order.get("demo")).isEqualTo(true);
		String orderId = (String) order.get("orderId");
		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(o -> !o.isPaid());

		Map<?, ?> grant = postJson("/api/payments/demo/complete", "{\"orderId\":\"" + orderId + "\"}", 200);
		assertThat(grant.get("scope")).isEqualTo("template:maharaja");
		String token = (String) grant.get("token");
		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(PaymentOrder::isPaid);

		assertThat(check(token, "maharaja")).isTrue();
		assertThat(check(token, "rajwada")).isFalse();
		assertThat(check(token + "x", "maharaja")).isFalse();

		// The same purchase can be restored from the payment id.
		Map<?, ?> restored = postJson("/api/entitlements/restore", "{\"paymentId\":\"" + grant.get("paymentId") + "\"}", 200);
		assertThat(check((String) restored.get("token"), "maharaja")).isTrue();
	}

	@Test
	void collectionPurchaseUnlocksEveryTemplate() throws Exception {
		Map<?, ?> order = postJson("/api/payments/orders", "{\"productCode\":\"PREMIUM_COLLECTION\"}", 200);
		assertThat(order.get("amount")).isEqualTo(9900);
		Map<?, ?> grant = postJson("/api/payments/demo/complete", "{\"orderId\":\"" + order.get("orderId") + "\"}", 200);

		assertThat(grant.get("scope")).isEqualTo("collection");
		assertThat(check((String) grant.get("token"), "ivory")).isTrue();
	}

	@Test
	void theClientCannotChooseThePrice() throws Exception {
		Map<?, ?> order = postJson("/api/payments/orders",
				"{\"productCode\":\"PREMIUM_COLLECTION\",\"amount\":100}", 200);
		assertThat(order.get("amount")).isEqualTo(9900);
	}

	@Test
	void unknownTemplateAndBadInputAreRejected() throws Exception {
		postJson("/api/payments/orders", "{\"productCode\":\"PREMIUM_SINGLE\",\"templateId\":\"mangal\"}", 400);
		postJson("/api/payments/orders", "{\"productCode\":\"PREMIUM_SINGLE\"}", 400);
		postJson("/api/payments/orders", "{\"productCode\":\"FREE_EVERYTHING\"}", 400);
		postJson("/api/payments/demo/complete", "{\"orderId\":\"order_demo_000000000000000000000000\"}", 404);
		postJson("/api/entitlements/restore", "{\"paymentId\":\"pay_doesNotExist1\"}", 404);
	}

	@Test
	void forgedSignatureNeverMarksAnOrderPaid() throws Exception {
		Map<?, ?> order = postJson("/api/payments/orders", "{\"productCode\":\"PREMIUM_COLLECTION\"}", 200);
		String orderId = (String) order.get("orderId");

		postJson("/api/payments/verify",
				"{\"orderId\":\"" + orderId + "\",\"paymentId\":\"pay_forged12345\",\"signature\":\"" + "a".repeat(64) + "\"}", 400);
		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(o -> !o.isPaid());
	}

	@Test
	void webhookWithoutValidSignatureIsRejected() throws Exception {
		mvc.perform(post("/api/payments/webhook").contentType(MediaType.APPLICATION_JSON)
				.content("{\"event\":\"payment.captured\"}").header("X-Razorpay-Signature", "b".repeat(64)))
				.andExpect(status().isUnauthorized());
		mvc.perform(post("/api/payments/webhook").contentType(MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void everythingElseIsDenied() throws Exception {
		mvc.perform(get("/api/payments/orders")).andExpect(status().isForbidden());
		mvc.perform(get("/api/admin")).andExpect(status().isForbidden());
		mvc.perform(get("/actuator/env")).andExpect(status().isForbidden());
		mvc.perform(get("/actuator/health")).andExpect(status().isOk());
	}

	private boolean check(String token, String templateId) throws Exception {
		Map<?, ?> res = postJson("/api/entitlements/verify",
				"{\"token\":\"" + token + "\",\"templateId\":\"" + templateId + "\"}", 200);
		return Boolean.TRUE.equals(res.get("valid"));
	}

	private Map<?, ?> postJson(String url, String body, int expectedStatus) throws Exception {
		String response = mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().is(expectedStatus))
				.andReturn().getResponse().getContentAsString();
		return response.isBlank() ? Map.of() : json.readValue(response, Map.class);
	}
}
