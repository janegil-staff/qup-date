import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import no from "i18n-iso-countries/langs/no.json";

countries.registerLocale(en);
countries.registerLocale(no);

export default function normalizeCountry(name) {
  if (!name) return null;

  // If already ISO-2, return as-is
  if (typeof name === "string" && name.length === 2 && /^[A-Z]{2}$/.test(name)) {
    return name;
  }

  // Try English
  let code = countries.getAlpha2Code(name, "en");

  // Try Norwegian
  if (!code) code = countries.getAlpha2Code(name, "no");

  return code || null;
}
