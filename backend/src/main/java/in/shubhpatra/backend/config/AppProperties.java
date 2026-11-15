package in.shubhpatra.backend.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** Typed view of the {@code app.*} settings. Invalid configuration stops the application at startup. */
@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
		@Valid @NotNull Cors cors,
		@Valid @NotNull Pricing pricing,
		@Valid @NotNull Razorpay razorpay,
		@Valid @NotNull Entitlement entitlement,
		@Valid @NotNull Payments payments,
		@Valid @NotNull RateLimit rateLimit) {

	public record Cors(@NotEmpty List<String> allowedOrigins) {
	}

	public record Pricing(
			@NotBlank @Size(min = 3, max = 3) String currency,
			@Min(100) int premiumSingleAmount,
			@Min(100) int premiumCollectionAmount,
			@Min(1) @Max(3650) int validityDays,
			@NotEmpty List<String> premiumTemplates) {
	}

	public record Razorpay(String keyId, String keySecret, String webhookSecret) {

		public boolean configured() {
			return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
		}
	}

	public record Entitlement(@NotBlank @Size(min = 32, message = "must be at least 32 characters") String secret) {
	}

	public record Payments(boolean demoMode) {
	}

	public record RateLimit(@Min(1) int requestsPerMinute) {
	}

	/** True when payments are simulated: demo mode is on and no Razorpay keys were supplied. */
	public boolean demoPayments() {
		return payments.demoMode() && !razorpay.configured();
	}
}
