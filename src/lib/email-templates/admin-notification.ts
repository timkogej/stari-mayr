/**
 * Admin notification email for the contact form.
 *
 * Hand-written, table-based, fully inline-styled HTML: email clients (Outlook
 * in particular) do not support flexbox/grid and many strip <style> blocks.
 * Web fonts are deliberately not loaded — the stacks below approximate the
 * site's Cormorant Garamond / sans pairing with fonts clients actually have.
 */

export type AdminNotificationData = {
  name: string;
  email: string;
  message: string;
};

/** Site palette (see src/app/globals.css). */
const CREAM = '#F5EFE6';
const PARCHMENT = '#FAF6F0';
const SAND = '#E8DCC4';
const BRONZE = '#8B6F47';
const TERRACOTTA = '#B85C3C';
const COFFEE = '#2C1F17';
const WALNUT = '#5C4530';

const DISPLAY_FONT = "Georgia, 'Times New Roman', Times, serif";
const BODY_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const LOGO_URL = 'https://stari-mayr.si/images/stari-mayr-logo-black.png';

/** Escape visitor-supplied text before interpolating it into the email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape, then preserve the visitor's line breaks as <br />. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br />');
}

function field(label: string, valueHtml: string): string {
  return `
              <tr>
                <td style="padding: 0 0 20px 0;">
                  <p style="margin: 0 0 6px 0; font-family: ${BODY_FONT}; font-size: 11px; line-height: 16px; letter-spacing: 0.15em; text-transform: uppercase; color: ${BRONZE};">${label}</p>
                  <p style="margin: 0; font-family: ${BODY_FONT}; font-size: 15px; line-height: 24px; color: ${COFFEE};">${valueHtml}</p>
                </td>
              </tr>`;
}

export function renderAdminNotificationEmail({
  name,
  email,
  message,
}: AdminNotificationData): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeMultiline(message);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="sl">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Novo povpraševanje &mdash; Stari Mayr</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${CREAM};">
<div style="display: none; font-size: 1px; color: ${CREAM}; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Novo sporočilo prek kontaktnega obrazca &mdash; ${safeName}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${CREAM}; margin: 0; padding: 0;">
  <tr>
    <td align="center" style="padding: 32px 16px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: ${PARCHMENT}; border: 1px solid ${SAND};">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding: 40px 40px 32px 40px; border-bottom: 1px solid ${SAND};">
            <img src="${LOGO_URL}" alt="Stari Mayr" width="150" style="display: block; width: 150px; max-width: 150px; height: auto; border: 0;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 40px 40px 32px 40px;">
            <p style="margin: 0 0 8px 0; font-family: ${BODY_FONT}; font-size: 11px; line-height: 16px; letter-spacing: 0.25em; text-transform: uppercase; color: ${TERRACOTTA};">Kontaktni obrazec</p>
            <h1 style="margin: 0 0 32px 0; font-family: ${DISPLAY_FONT}; font-size: 30px; line-height: 38px; font-weight: normal; font-style: italic; letter-spacing: 0.01em; color: ${COFFEE};">Novo povpraševanje</h1>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${field('Ime', safeName)}
${field('E-pošta', `<a href="mailto:${safeEmail}" style="color: ${BRONZE}; text-decoration: underline;">${safeEmail}</a>`)}
              <tr>
                <td style="padding: 4px 0 0 0;">
                  <p style="margin: 0 0 10px 0; font-family: ${BODY_FONT}; font-size: 11px; line-height: 16px; letter-spacing: 0.15em; text-transform: uppercase; color: ${BRONZE};">Sporočilo</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${CREAM}; border-left: 3px solid ${SAND};">
                    <tr>
                      <td style="padding: 18px 20px;">
                        <p style="margin: 0; font-family: ${BODY_FONT}; font-size: 15px; line-height: 26px; color: ${COFFEE};">${safeMessage}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 24px 40px 32px 40px; border-top: 1px solid ${SAND};">
            <p style="margin: 0; font-family: ${BODY_FONT}; font-size: 12px; line-height: 20px; color: ${WALNUT};">
              Prejeto prek kontaktnega obrazca na
              <a href="https://stari-mayr.si" style="color: ${BRONZE}; text-decoration: none;">stari-mayr.si</a>
            </p>
            <p style="margin: 6px 0 0 0; font-family: ${BODY_FONT}; font-size: 12px; line-height: 20px; color: ${WALNUT};">
              Na to sporočilo lahko odgovorite neposredno &mdash; odgovor prejme pošiljatelj.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}
