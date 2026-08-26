export type CookieConsentValue = {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = 'stari-mayr-cookie-consent';
export const COOKIE_CONSENT_UPDATED_EVENT = 'stari-mayr-cookie-consent-updated';
export const COOKIE_CONSENT_OPEN_SETTINGS_EVENT = 'stari-mayr-open-cookie-settings';

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== 'boolean' || typeof parsed?.decidedAt !== 'string') return null;
    return { necessary: true, analytics: parsed.analytics, decidedAt: parsed.decidedAt };
  } catch {
    return null;
  }
}

export function writeCookieConsent(analytics: boolean): CookieConsentValue {
  const value: CookieConsentValue = { necessary: true, analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private browsing, disabled storage) — consent
    // decision won't persist across reloads, but the current session still
    // reflects the user's choice via the dispatched event below.
  }
  window.dispatchEvent(new CustomEvent<CookieConsentValue>(COOKIE_CONSENT_UPDATED_EVENT, { detail: value }));
  return value;
}
