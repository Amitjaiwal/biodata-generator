package in.shubhpatra.backend.common;

import in.shubhpatra.backend.config.AppProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Simple fixed-window limit per client address for the write endpoints, to slow down abuse
 * such as order spam or payment-id guessing. It is in-memory, which suits a single small
 * instance; put a shared limiter or a gateway in front when running several instances.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitFilter extends OncePerRequestFilter {

	private static final long WINDOW_MS = 60_000;
	private static final int MAX_TRACKED_CLIENTS = 50_000;

	private final int limit;
	private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

	public RateLimitFilter(AppProperties props) {
		this.limit = props.rateLimit().requestsPerMinute();
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
		boolean limited = path.startsWith("/api/payments/") || path.startsWith("/api/entitlements/");
		// Razorpay calls the webhook from its own servers; its signature is the protection there.
		return !"POST".equals(request.getMethod()) || !limited || path.equals("/api/payments/webhook");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		long now = System.currentTimeMillis();
		if (windows.size() > MAX_TRACKED_CLIENTS) {
			windows.entrySet().removeIf(e -> now - e.getValue().start > WINDOW_MS);
		}
		Window window = windows.compute(request.getRemoteAddr(),
				(key, w) -> w == null || now - w.start > WINDOW_MS ? new Window(now) : w);
		if (window.count.incrementAndGet() > limit) {
			response.setStatus(429);
			response.setHeader("Retry-After", "60");
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.getWriter().write("{\"error\":\"too_many_requests\"}");
			return;
		}
		chain.doFilter(request, response);
	}

	private static final class Window {
		final long start;
		final AtomicInteger count = new AtomicInteger();

		Window(long start) {
			this.start = start;
		}
	}
}
