package in.shubhpatra.backend.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Request and response bodies of the public API. */
public final class PaymentDtos {

	private PaymentDtos() {
	}

	public record CreateOrderRequest(
			@NotNull ProductCode productCode,
			@Pattern(regexp = "^[a-z]{2,30}$") String templateId) {
	}

	public record OrderResponse(String orderId, int amount, String currency, String keyId, boolean demo) {
	}

	public record VerifyRequest(
			@NotBlank @Pattern(regexp = "^order_[A-Za-z0-9]{6,40}$") String orderId,
			@NotBlank @Pattern(regexp = "^pay_[A-Za-z0-9]{6,40}$") String paymentId,
			@NotBlank @Pattern(regexp = "^[A-Fa-f0-9]{64}$") String signature) {
	}

	public record DemoCompleteRequest(@NotBlank @Pattern(regexp = "^order_demo_[a-f0-9]{24}$") String orderId) {
	}

	public record GrantResponse(String token, String scope, String expiresAt, String paymentId) {
	}

	public record RestoreRequest(@NotBlank @Pattern(regexp = "^pay_[A-Za-z0-9]{6,40}$") String paymentId) {
	}

	public record EntitlementCheckRequest(
			@NotBlank @Size(max = 600) String token,
			@NotBlank @Pattern(regexp = "^[a-z]{2,30}$") String templateId) {
	}

	public record EntitlementCheckResponse(boolean valid) {
	}

	public record ProductView(ProductCode code, int amount, String currency, int validityDays) {
	}

	public record PricingResponse(String currency, List<ProductView> products, boolean demoMode) {
	}
}
