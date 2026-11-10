/* Pure-logic tests for the localisation core. Run: node test/site.test.mjs */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const core = require("../i18n-core.js");

let pass = 0, fail = 0;
function eq(actual, expected, label) {
  if (String(actual) === String(expected)) { pass++; }
  else { fail++; console.log(`FAIL ${label}: got ${actual}, expected ${expected}`); }
}

// language resolution order
eq(core.resolveLang({ param: "ES" }), "es", "explicit param wins and is case-insensitive");
eq(core.resolveLang({ param: "zz", saved: "de" }), "de", "bad param falls through to saved choice");
eq(core.resolveLang({ navigatorLang: "pt-BR,pt;q=0.9" }), "pt", "navigator locale maps to base language");
eq(core.resolveLang({ country: "AE" }), "ar", "country map handles UAE");
eq(core.resolveLang({ country: "US" }), "en", "unknown market stays English");
eq(core.resolveLang({}), "en", "empty input is safe");

// market and money
eq(core.resolveMarket({ country: "IN" }), "INR", "India gets the rupee card");
eq(core.resolveMarket({ country: "US" }), "USD", "everything else gets dollars");
eq(core.resolveMarket({ param: "INR", country: "US" }), "INR", "market override wins");
eq(core.formatPrice("trial", "INR").replace(/\u00a0/g, " "), "₹9,000", "trial price in rupees");
eq(core.formatPrice("monthly", "INR").replace(/\u00a0/g, " "), "₹30,000", "monthly price in rupees");
eq(core.formatPrice("trial", "USD"), "$450", "trial price in dollars");
eq(core.formatPrice("monthly", "USD"), "$1,800", "monthly price in dollars");
eq(core.formatPrice("nope", "USD"), "", "unknown price kind returns empty, never NaN");

// direction and dictionary integrity
eq(core.dir("ar"), "rtl", "Arabic is right to left");
eq(core.dir("de"), "ltr", "German is left to right");
// English is the source language: it lives in the HTML, so the core must fall back cleanly.
const critical = ["h1", "h2.pricing", "cta.trial", "price.permonth"];
eq(core.t("en", "cta.trial", "BOOK THE TRIAL"), "BOOK THE TRIAL", "English falls back to markup text");
for (const lang of core.LANGS.filter(l => l !== "en")) {
  const missing = critical.filter(k => !core.t(lang, k, ""));
  eq(missing.length, 0, `${lang} translates every critical key`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
