'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  COOKIE_CONSENT_OPEN_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from '@/lib/cookie-consent';

export function CookieConsent() {
  const t = useTranslations('cookie_consent');
  const [mounted, setMounted] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const existing = readCookieConsent();
      setHasDecision(existing !== null);
      setAnalyticsChoice(existing?.analytics ?? false);
      setMounted(true);
    });

    const handleOpenSettings = () => {
      const current = readCookieConsent();
      setAnalyticsChoice(current?.analytics ?? false);
      setSettingsOpen(true);
    };
    window.addEventListener(COOKIE_CONSENT_OPEN_SETTINGS_EVENT, handleOpenSettings);
    return () => {
      active = false;
      window.removeEventListener(COOKIE_CONSENT_OPEN_SETTINGS_EVENT, handleOpenSettings);
    };
  }, []);

  if (!mounted) return null;

  const acceptAll = () => {
    writeCookieConsent(true);
    setHasDecision(true);
    setSettingsOpen(false);
  };

  const rejectNonEssential = () => {
    writeCookieConsent(false);
    setHasDecision(true);
    setSettingsOpen(false);
  };

  const saveSettings = () => {
    writeCookieConsent(analyticsChoice);
    setHasDecision(true);
    setSettingsOpen(false);
  };

  const buttonBaseClass =
    'font-body uppercase tracking-[0.15em] text-xs px-5 py-3 transition-colors duration-300';

  return (
    <>
      {!hasDecision && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-coffee text-cream">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
            <p className="font-body text-sm text-cream/80 flex-1">
              {t('message')}{' '}
              <Link href="/politika-zasebnosti" className="underline hover:text-cream">
                {t('learnMore')}
              </Link>
            </p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={acceptAll}
                className={`${buttonBaseClass} bg-terracotta hover:bg-terracotta/90 text-cream`}
              >
                {t('acceptAll')}
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className={`${buttonBaseClass} bg-walnut hover:bg-walnut/90 text-cream`}
              >
                {t('rejectNonEssential')}
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className={`${buttonBaseClass} border border-cream/50 hover:border-cream text-cream`}
              >
                {t('settings')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settingsTitle')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 opacity-70">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{t('necessaryLabel')}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t('necessaryDescription')}</p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="h-4 w-4 mt-1 accent-bronze shrink-0"
                aria-label={t('necessaryLabel')}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{t('analyticsLabel')}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t('analyticsDescription')}</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsChoice}
                onChange={(e) => setAnalyticsChoice(e.target.checked)}
                className="h-4 w-4 mt-1 accent-bronze shrink-0"
                aria-label={t('analyticsLabel')}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={saveSettings}
              className={`${buttonBaseClass} bg-terracotta hover:bg-terracotta/90 text-cream`}
            >
              {t('saveSettings')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
