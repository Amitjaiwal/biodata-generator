package in.shubhpatra.backend.payment;

import in.shubhpatra.backend.common.ApiException;
import in.shubhpatra.backend.config.AppProperties;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Thin wrapper over the Razorpay Orders API. The key secret never leaves this class. */
@Component
public class RazorpayClient {

	private static final Logger log = LoggerFactory.getLogger(RazorpayClient.class);
	private static final String BASE_URL = "https://api.razorpay.com/v1";

	private final AppProperties.Razorpay config;
	private final RestClient http;

	public RazorpayClient(AppProperties props) {
		this.config = props.razorpay();
		SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(Duration.ofSeconds(5));
		factory.setReadTimeout(Duration.ofSeconds(15));
		RestClient.Builder builder = RestClient.builder().baseUrl(BASE_URL).requestFactory(factory);
		if (config.configured()) {
			builder.defaultHeaders(h -> h.setBasicAuth(config.keyId(), config.keySecret()));
		}
		this.http = builder.build();
	}

	/** Creates an order and returns its Razorpay id (order_...). */
	public String createOrder(int amount, String currency, String receipt, Map<String, String> notes) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("amount", amount);
		body.put("currency", currency);
		body.put("receipt", receipt);
		body.put("notes", notes);
		try {
			Map<?, ?> response = http.post()
					.uri("/orders")
					.contentType(MediaType.APPLICATION_JSON)
					.body(body)
					.retrieve()
					.body(Map.class);
			Object id = response == null ? null : response.get("id");
			if (!(id instanceof String orderId) || orderId.isBlank()) {
				throw new ApiException(HttpStatus.BAD_GATEWAY, "payment_gateway_error");
			}
			return orderId;
		}
		catch (RestClientException e) {
			log.error("Razorpay order creation failed: {}", e.getMessage());
			throw new ApiException(HttpStatus.BAD_GATEWAY, "payment_gateway_error");
		}
	}
}
