export function getLocale(locale = '') {
  if (locale) return locale;
  return document.documentElement.lang;
}

export function getCurrentTimezone(timezone) {
  if (timezone) return timezone;
  return PCore?.getLocaleUtils?.().getTimeZoneInUse?.();
}
