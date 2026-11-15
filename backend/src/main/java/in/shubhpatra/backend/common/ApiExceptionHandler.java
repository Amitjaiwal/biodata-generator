package in.shubhpatra.backend.common;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Turns failures into small JSON bodies of the form {"error": "code"} without leaking details. */
@RestControllerAdvice
public class ApiExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	ResponseEntity<Map<String, String>> handleApi(ApiException e) {
		return ResponseEntity.status(e.status()).body(Map.of("error", e.code()));
	}

	@ExceptionHandler({ MethodArgumentNotValidException.class, HttpMessageNotReadableException.class })
	ResponseEntity<Map<String, String>> handleBadRequest(Exception e) {
		return ResponseEntity.badRequest().body(Map.of("error", "invalid_request"));
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<Map<String, String>> handleUnexpected(Exception e) throws Exception {
		// Let Spring answer its own HTTP errors (404, 405, 415 ...) with the right status.
		if (e instanceof org.springframework.web.ErrorResponse) {
			throw e;
		}
		log.error("Unhandled error", e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "server_error"));
	}
}
