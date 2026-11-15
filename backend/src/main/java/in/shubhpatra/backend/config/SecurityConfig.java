package in.shubhpatra.backend.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * The API has no user accounts: it is stateless and exposes a small, explicit set of public
 * endpoints. Everything else is denied. Trust comes from Razorpay signatures and from our own
 * HMAC-signed tokens, not from sessions or cookies, so CSRF protection does not apply.
 */
@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(cors -> {
				})
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.httpBasic(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable)
				.logout(AbstractHttpConfigurer::disable)
				.headers(h -> h
						.contentTypeOptions(c -> {
						})
						.frameOptions(f -> f.deny())
						.referrerPolicy(r -> r.policy(ReferrerPolicy.NO_REFERRER))
						.cacheControl(c -> {
						}))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/config/pricing", "/actuator/health").permitAll()
						.requestMatchers(HttpMethod.POST,
								"/api/payments/orders",
								"/api/payments/verify",
								"/api/payments/webhook",
								"/api/payments/demo/complete",
								"/api/entitlements/verify",
								"/api/entitlements/restore")
						.permitAll()
						.anyRequest().denyAll());
		return http.build();
	}

	/** There are no user accounts. An empty store stops Spring from creating a default user. */
	@Bean
	UserDetailsService noUsers() {
		return new InMemoryUserDetailsManager();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(AppProperties props) {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(props.cors().allowedOrigins());
		config.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
		config.setAllowedHeaders(List.of("Content-Type", "Accept"));
		config.setAllowCredentials(false);
		config.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}
}
