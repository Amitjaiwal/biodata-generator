package in.shubhpatra.backend.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** One purchase attempt. Holds payment references only; no biodata and no payer details. */
@Entity
@Table(name = "payment_order")
public class PaymentOrder {

	public enum Status {
		CREATED, PAID
	}

	@Id
	private UUID id;

	@Column(name = "razorpay_order_id", nullable = false, unique = true, length = 64)
	private String razorpayOrderId;

	@Column(name = "razorpay_payment_id", unique = true, length = 64)
	private String razorpayPaymentId;

	@Enumerated(EnumType.STRING)
	@Column(name = "product_code", nullable = false, length = 32)
	private ProductCode productCode;

	@Column(name = "template_id", length = 40)
	private String templateId;

	@Column(nullable = false)
	private int amount;

	@Column(nullable = false, length = 3)
	private String currency;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 16)
	private Status status;

	@Column(nullable = false)
	private boolean demo;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "paid_at")
	private Instant paidAt;

	@Column(name = "expires_at")
	private Instant expiresAt;

	protected PaymentOrder() {
		// for JPA
	}

	public PaymentOrder(String razorpayOrderId, ProductCode productCode, String templateId, int amount,
			String currency, boolean demo, Instant createdAt) {
		this.id = UUID.randomUUID();
		this.razorpayOrderId = razorpayOrderId;
		this.productCode = productCode;
		this.templateId = templateId;
		this.amount = amount;
		this.currency = currency;
		this.demo = demo;
		this.createdAt = createdAt;
		this.status = Status.CREATED;
	}

	public void markPaid(String paymentId, Instant paidAt, Instant expiresAt) {
		this.razorpayPaymentId = paymentId;
		this.paidAt = paidAt;
		this.expiresAt = expiresAt;
		this.status = Status.PAID;
	}

	public boolean isPaid() {
		return status == Status.PAID;
	}

	public UUID getId() {
		return id;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public String getRazorpayPaymentId() {
		return razorpayPaymentId;
	}

	public ProductCode getProductCode() {
		return productCode;
	}

	public String getTemplateId() {
		return templateId;
	}

	public int getAmount() {
		return amount;
	}

	public String getCurrency() {
		return currency;
	}

	public Status getStatus() {
		return status;
	}

	public boolean isDemo() {
		return demo;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getPaidAt() {
		return paidAt;
	}

	public Instant getExpiresAt() {
		return expiresAt;
	}
}
