package in.shubhpatra.backend.entitlement;

import static org.assertj.core.api.Assertions.assertThat;

import in.shubhpatra.backend.config.AppProperties;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;

class EntitlementTokenServiceTest {

	private static final Instant NOW = Instant.parse("2026-11-15T10:00:00Z");

	private static EntitlementTokenService service(String secret, Instant now) {
		AppProperties props = new AppProperties(
				new AppProperties.Cors(List.of("http://localhost:4200")),
				new AppProperties.Pricing("INR", 4900, 9900, 365, List.of("maharaja")),
				new AppProperties.Razorpay("", "", ""),
				new AppProperties.Entitlement(secret),
				new AppProperties.Payments(true),
				new AppProperties.RateLimit(40));
		return new EntitlementTokenService(props, Clock.fixed(now, ZoneOffset.UTC));
	}

	private final EntitlementTokenService tokens = service("test-secret-0123456789-0123456789-abcdef", NOW);

	@Test
	void templateTokenCoversOnlyItsTemplate() {
		String token = tokens.issue(EntitlementTokenService.templateScope("maharaja"), NOW.plusSeconds(3600), "pay_abc123");

		assertThat(tokens.covers(token, "maharaja")).isTrue();
		assertThat(tokens.covers(token, "rajwada")).isFalse();
		assertThat(tokens.parse(token)).get()
				.satisfies(c -> assertThat(c.paymentId()).isEqualTo("pay_abc123"));
	}

	@Test
	void collectionTokenCoversEveryTemplate() {
		String token = tokens.issue(EntitlementTokenService.COLLECTION_SCOPE, NOW.plusSeconds(3600), "pay_abc123");

		assertThat(tokens.covers(token, "maharaja")).isTrue();
		assertThat(tokens.covers(token, "ivory")).isTrue();
	}

	@Test
	void expiredTokenIsRejected() {
		String token = tokens.issue(EntitlementTokenService.COLLECTION_SCOPE, NOW.minusSeconds(1), "pay_abc123");

		assertThat(tokens.parse(token)).isEmpty();
	}

	@Test
	void tamperedPayloadIsRejected() {
		String token = tokens.issue(EntitlementTokenService.templateScope("maharaja"), NOW.plusSeconds(3600), "pay_abc123");
		String forgedPayload = java.util.Base64.getUrlEncoder().withoutPadding()
				.encodeToString(("v1|collection|" + NOW.plusSeconds(999999).getEpochSecond() + "|pay_abc123").getBytes());
		String forged = forgedPayload + token.substring(token.indexOf('.'));

		assertThat(tokens.covers(forged, "rajwada")).isFalse();
	}

	@Test
	void tokenSignedWithAnotherKeyIsRejected() {
		EntitlementTokenService other = service("another-secret-0123456789-0123456789-xyz", NOW);
		String token = other.issue(EntitlementTokenService.COLLECTION_SCOPE, NOW.plusSeconds(3600), "pay_abc123");

		assertThat(tokens.covers(token, "maharaja")).isFalse();
	}

	@Test
	void garbageIsRejected() {
		assertThat(tokens.parse(null)).isEmpty();
		assertThat(tokens.parse("")).isEmpty();
		assertThat(tokens.parse("not-a-token")).isEmpty();
		assertThat(tokens.parse("a.b.c")).isEmpty();
		assertThat(tokens.parse("!!!.???")).isEmpty();
	}
}
