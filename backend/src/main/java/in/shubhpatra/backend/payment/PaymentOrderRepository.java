package in.shubhpatra.backend.payment;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, UUID> {

	Optional<PaymentOrder> findByRazorpayOrderId(String razorpayOrderId);

	Optional<PaymentOrder> findByRazorpayPaymentId(String razorpayPaymentId);
}
