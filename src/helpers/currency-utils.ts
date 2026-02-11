import CurrencyMap from './formatters/CurrencyMap';

/**
 * Helper to get formatting options for a specific Currency ISO Code.
 * It finds a country that uses the currency and constructs a locale
 * to force the formatter to use that currency's symbol.
 *
 * @param {string} currencyISOCode - The currency code (e.g., "USD", "EUR")
 * @returns {object} - Options object containing the locale (e.g., { locale: "en-US" })
 */
export const getCurrencyOptions = currencyISOCode => {
  if (!currencyISOCode) {
    return {};
  }

  // Iterate over the CurrencyMap to find a country code that matches the currency ISO code
  const countryCode = Object.keys(CurrencyMap).find(key => {
    const entry = CurrencyMap[key];
    // Check if the entry exists and the currency code matches
    // entry.currencyCode is typically formatted like "USD {#}"
    return entry && entry.currencyCode && entry.currencyCode.startsWith(currencyISOCode);
  });

  if (countryCode) {
    // Return a locale constructed from the found country code.
    // The prefix 'en' is used as a generic language; the formatter primarily uses the country code suffix.
    return {
      locale: `en-${countryCode}`
    };
  }

  return {};
};
