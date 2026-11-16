package in.shubhpatra.backend.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;

/**
 * Guards a mistake that is easy to make: adding a premium design to the frontend catalogue and
 * forgetting to list it in {@code app.pricing.premium-templates}. The server refuses to sell a
 * single-design purchase for an id it does not know, so the buy button would fail for that design.
 *
 * <p>The test reads both files from the repository checkout. When the frontend folder is not
 * there (for example when only the backend is checked out), it is skipped.
 */
class PremiumTemplatesInSyncTest {

	private static final Path BACKEND_CONFIG = Path.of("src/main/resources/application.yml");
	private static final Path FRONTEND_REGISTRY = Path.of("../frontend/src/app/templates/registry.ts");

	@Test
	void everyPremiumDesignInTheCatalogueCanBeBought() throws IOException {
		assumeTrue(Files.exists(FRONTEND_REGISTRY), "frontend sources are not checked out next to the backend");

		Set<String> catalogue = premiumIdsInRegistry(Files.readString(FRONTEND_REGISTRY, StandardCharsets.UTF_8));
		Set<String> sellable = premiumIdsInConfig(Files.readString(BACKEND_CONFIG, StandardCharsets.UTF_8));

		assertThat(catalogue).as("premium designs found in registry.ts").isNotEmpty();
		assertThat(sellable)
				.as("app.pricing.premium-templates must list every premium design in registry.ts and nothing else")
				.containsExactlyInAnyOrderElementsOf(catalogue);
	}

	private static Set<String> premiumIdsInRegistry(String source) {
		Set<String> ids = new LinkedHashSet<>();
		// Each catalogue entry lists its id before its tier, so a lazy match pairs them correctly.
		Matcher m = Pattern.compile("id: '([a-z0-9]+)',[\\s\\S]*?tier: '(free|premium)'").matcher(source);
		while (m.find()) {
			if ("premium".equals(m.group(2))) {
				ids.add(m.group(1));
			}
		}
		return ids;
	}

	private static Set<String> premiumIdsInConfig(String yaml) {
		Matcher m = Pattern.compile("premium-templates:\\s*([a-z0-9,]+)").matcher(yaml);
		assertThat(m.find()).as("premium-templates entry in application.yml").isTrue();
		return new LinkedHashSet<>(Arrays.asList(m.group(1).split(",")));
	}
}
