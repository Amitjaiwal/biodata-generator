package in.shubhpatra.backend.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import java.io.IOException;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Runs the migration, the schema validation and the purchase flow against a real PostgreSQL
 * server, the database used in production. The other tests use an in-memory H2 database.
 */
// Blank Razorpay keys keep this test independent of any local backend/.env file.
@SpringBootTest(properties = { "app.rate-limit.requests-per-minute=1000", "app.razorpay.key-id=", "app.razorpay.key-secret=", "app.razorpay.webhook-secret=" })
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class PostgresPaymentFlowTest {

	private static EmbeddedPostgres postgres;

	@BeforeAll
	static void startDatabase() throws IOException {
		postgres = EmbeddedPostgres.start();
	}

	@AfterAll
	static void stopDatabase() throws IOException {
		postgres.close();
	}

	@DynamicPropertySource
	static void database(DynamicPropertyRegistry registry) throws IOException {
		if (postgres == null) {
			postgres = EmbeddedPostgres.start();
		}
		registry.add("spring.datasource.url", () -> postgres.getJdbcUrl("postgres", "postgres"));
		registry.add("spring.datasource.username", () -> "postgres");
		registry.add("spring.datasource.password", () -> "postgres");
	}

	@Autowired
	MockMvc mvc;

	@Autowired
	PaymentOrderRepository orders;

	@Test
	void ordersAreStoredAndRestoredOnPostgres() throws Exception {
		String order = mvc.perform(post("/api/payments/orders").contentType(MediaType.APPLICATION_JSON)
				.content("{\"productCode\":\"PREMIUM_COLLECTION\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.amount").value(9900))
				.andReturn().getResponse().getContentAsString();
		String orderId = order.replaceAll(".*\"orderId\":\"([^\"]+)\".*", "$1");

		String grant = mvc.perform(post("/api/payments/demo/complete").contentType(MediaType.APPLICATION_JSON)
				.content("{\"orderId\":\"" + orderId + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.scope").value("collection"))
				.andReturn().getResponse().getContentAsString();
		String paymentId = grant.replaceAll(".*\"paymentId\":\"([^\"]+)\".*", "$1");

		assertThat(orders.findByRazorpayOrderId(orderId)).get().matches(PaymentOrder::isPaid);

		mvc.perform(post("/api/entitlements/restore").contentType(MediaType.APPLICATION_JSON)
				.content("{\"paymentId\":\"" + paymentId + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.scope").value("collection"));
	}
}
