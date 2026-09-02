'use client';
import { useState } from 'react';
import { useMessages } from 'next-intl';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const messages = useMessages();
  const contact = messages.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  const isSending = status === 'sending';

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-display text-2xl text-bronze tracking-wide text-center mb-8">
        {contact.form.heading}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contact-name" className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={200}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSending}
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSending}
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            maxLength={5000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="w-full font-body uppercase tracking-[0.15em] text-xs px-5 py-3 bg-bronze hover:bg-bronze/90 text-cream transition-colors disabled:opacity-60"
        >
          {isSending ? contact.form.sending : contact.form.submit}
        </button>

        <p aria-live="polite" className="font-body text-sm text-center min-h-[1.25rem]">
          {status === 'success' && <span className="text-forest">{contact.form.success}</span>}
          {status === 'error' && <span className="text-terracotta">{contact.form.error}</span>}
        </p>
      </form>
    </div>
  );
}
