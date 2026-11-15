package in.shubhpatra.backend.entitlement;

import in.shubhpatra.backend.payment.PaymentDtos.EntitlementCheckRequest;
import in.shubhpatra.backend.payment.PaymentDtos.EntitlementCheckResponse;
import in.shubhpatra.backend.payment.PaymentDtos.GrantResponse;
import in.shubhpatra.backend.payment.PaymentDtos.RestoreRequest;
import in.shubhpatra.backend.payment.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entitlements")
public class EntitlementController {

	private final EntitlementTokenService tokens;
	private final PaymentService payments;

	public EntitlementController(EntitlementTokenService tokens, PaymentService payments) {
		this.tokens = tokens;
		this.payments = payments;
	}

	/** The site asks this before every premium download, so a forged local token unlocks nothing. */
	@PostMapping("/verify")
	EntitlementCheckResponse verify(@Valid @RequestBody EntitlementCheckRequest request) {
		return new EntitlementCheckResponse(tokens.covers(request.token(), request.templateId()));
	}

	/** Gives a paying customer their access back on another device, using the payment id. */
	@PostMapping("/restore")
	GrantResponse restore(@Valid @RequestBody RestoreRequest request) {
		return payments.restore(request.paymentId());
	}
}
