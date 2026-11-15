package in.shubhpatra.backend.entitlement;

import in.shubhpatra.backend.common.Hmac;
import in.shubhpatra.backend.config.AppProperties;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 * Issues and checks purchase tokens. A token is {@code base64url(payload).base64url(hmac)}
 * where the payload is {@code v1|scope|expiryEpochSeconds|paymentId}. Only this server knows
 * the HMAC key, so a browser cannot mint or alter a token. Tokens carry no personal data.
 */
@Service
public class EntitlementTokenService {

	public static final String COLLECTION_SCOPE = "collection";
	private static final String VERSION = "v1";
	private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
	private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

	private final String secret;
	private final Clock clock;

	public EntitlementTokenService(AppProperties props, Clock clock) {
		this.secret = props.entitlement().secret();
		this.clock = clock;
	}

	public static String templateScope(String templateId) {
		return "template:" + templateId;
	}

	public String issue(String scope, Instant expiresAt, String paymentId) {
		String payload = String.join("|", VERSION, scope, Long.toString(expiresAt.getEpochSecond()), paymentId);
		return ENCODER.encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + "."
				+ ENCODER.encodeToString(Hmac.sha256(payload, secret));
	}

	/** Returns the claims when the signature is genuine and the token has not expired. */
	public Optional<Claims> parse(String token) {
		if (token == null || token.length() > 600) {
			return Optional.empty();
		}
		int dot = token.indexOf('.');
		if (dot <= 0 || dot != token.lastIndexOf('.')) {
			return Optional.empty();
		}
		try {
			String payload = new String(DECODER.decode(token.substring(0, dot)), StandardCharsets.UTF_8);
			byte[] signature = DECODER.decode(token.substring(dot + 1));
			if (!MessageDigest.isEqual(Hmac.sha256(payload, secret), signature)) {
				return Optional.empty();
			}
			String[] parts = payload.split("\\|", -1);
			if (parts.length != 4 || !VERSION.equals(parts[0])) {
				return Optional.empty();
			}
			Instant expiresAt = Instant.ofEpochSecond(Long.parseLong(parts[2]));
			if (!expiresAt.isAfter(clock.instant())) {
				return Optional.empty();
			}
			return Optional.of(new Claims(parts[1], expiresAt, parts[3]));
		}
		catch (IllegalArgumentException e) {
			return Optional.empty();
		}
	}

	/** True when the token unlocks the given template, directly or through the collection. */
	public boolean covers(String token, String templateId) {
		return parse(token)
				.map(c -> COLLECTION_SCOPE.equals(c.scope()) || templateScope(templateId).equals(c.scope()))
				.orElse(false);
	}

	public record Claims(String scope, Instant expiresAt, String paymentId) {
	}
}
