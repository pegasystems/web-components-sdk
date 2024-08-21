// Declare that PCore will be defined when this code is run
declare let PCore: any;

export function getLocale(locale) {
  if (locale) return locale;
  return document.documentElement.lang;
}

export function getCurrentTimezone(timezone) {
  if (timezone) return timezone;
  return PCore?.getLocaleUtils?.().getTimeZoneInUse?.();
}
