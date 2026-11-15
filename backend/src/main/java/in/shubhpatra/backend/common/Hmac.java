package in.shubhpatra.backend.common;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/** HMAC-SHA256 helpers with constant-time comparison. */
public final class Hmac {

	private static final String ALGORITHM = "HmacSHA256";

	private Hmac() {
	}

	public static byte[] sha256(String data, String secret) {
		try {
			Mac mac = Mac.getInstance(ALGORITHM);
			mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM));
			return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
		}
		catch (GeneralSecurityException e) {
			throw new IllegalStateException("HMAC-SHA256 is unavailable", e);
		}
	}

	public static String sha256Hex(String data, String secret) {
		return HexFormat.of().formatHex(sha256(data, secret));
	}

	/** Compares a hex signature without leaking, through timing, how much of it matched. */
	public static boolean matchesHex(String data, String secret, String candidateHex) {
		if (candidateHex == null || secret == null || secret.isEmpty()) {
			return false;
		}
		byte[] expected = sha256Hex(data, secret).getBytes(StandardCharsets.US_ASCII);
		byte[] actual = candidateHex.trim().toLowerCase().getBytes(StandardCharsets.US_ASCII);
		return MessageDigest.isEqual(expected, actual);
	}
}
