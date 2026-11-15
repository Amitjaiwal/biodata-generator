package in.shubhpatra.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Backend for the ShubhPatra biodata maker. It handles only what cannot be trusted to a
 * browser: prices, Razorpay orders, payment verification and premium access tokens.
 * Biodata content and photos never reach this service.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
