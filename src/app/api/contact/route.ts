import { Resend } from 'resend';
import { NextResponse, type NextRequest } from 'next/server';
import { renderAdminNotificationEmail } from '@/lib/email-templates/admin-notification';

/** Where the notification lands. `info@` has no inbox — replies go to the visitor. */
// TEMPORARY — using Tim's own jedroplus.com addresses to preview the
// email template before the stari-mayr.si domain is verified in Resend.
// Revert both `from` and `to` back to the real values
// (info@stari-mayr.si / the confirmed business inbox) before shipping.
const FROM = 'Stari Mayr Test <info@jedroplus.com>';
const TO = 'tim.kogej@jedroplus.com';

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;

/** Deliberately loose — real validation is the reply bouncing, not a regex. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const message = asTrimmedString(body.message);

  // Mirrors the form's `required` attributes — never trust the client alone.
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE ||
    !EMAIL_PATTERN.test(email)
  ) {
    return NextResponse.json({ error: 'Invalid field values' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Contact form email failed: RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Novo povpraševanje od ${name}`,
      html: renderAdminNotificationEmail({ name, email, message }),
      text: `Novo povpraševanje\n\nIme: ${name}\nE-pošta: ${email}\n\nSporočilo:\n${message}\n\nPrejeto prek kontaktnega obrazca na stari-mayr.si`,
    });

    // The SDK reports API failures in `error` rather than throwing.
    if (error) {
      console.error('Contact form email failed:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form email failed:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
