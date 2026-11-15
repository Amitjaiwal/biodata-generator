package in.shubhpatra.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/** Refuses to start without Razorpay keys unless demo payments were explicitly enabled. */
@Component
public class StartupChecks implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(StartupChecks.class);

	private final AppProperties props;

	public StartupChecks(AppProperties props) {
		this.props = props;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (props.razorpay().configured()) {
			if (props.razorpay().webhookSecret() == null || props.razorpay().webhookSecret().isBlank()) {
				log.warn("RAZORPAY_WEBHOOK_SECRET is not set: the payment webhook will reject every call.");
			}
			log.info("Payments: Razorpay (key {}...)", props.razorpay().keyId().substring(0, Math.min(12, props.razorpay().keyId().length())));
			return;
		}
		if (props.payments().demoMode()) {
			log.warn("Payments: DEMO MODE. No money is collected. Never use this configuration in production.");
			return;
		}
		throw new IllegalStateException(
				"Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, "
						+ "or run with the dev profile for simulated payments.");
	}
}
