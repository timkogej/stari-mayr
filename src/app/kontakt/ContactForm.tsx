'use client';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const contact = messages.contact;

export function ContactForm() {
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-display text-2xl text-bronze tracking-wide text-center mb-8">
        Pišite nam
      </h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* TODO: hook up form submission */}
        <div>
          <label className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.name}
          </label>
          <input
            type="text"
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors"
          />
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.email}
          </label>
          <input
            type="email"
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors"
          />
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-widest text-walnut mb-2 block">
            {contact.form.message}
          </label>
          <textarea
            rows={5}
            className="w-full border border-sand bg-parchment px-4 py-3 font-body text-sm text-coffee focus:outline-none focus:border-bronze transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full font-body uppercase tracking-[0.15em] text-xs px-5 py-3 bg-bronze hover:bg-bronze/90 text-cream transition-colors"
        >
          {contact.form.submit}
        </button>
      </form>
    </div>
  );
}
