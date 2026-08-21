type LegalSection = {
  number: string;
  heading: string;
  body: (string | React.ReactNode)[];
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections?: LegalSection[];
  children?: React.ReactNode;
};

export function LegalDocument({ eyebrow, title, subtitle, sections, children }: Props) {
  return (
    <>
      <section className="relative bg-parchment flex items-center justify-center min-h-[35vh] overflow-hidden border-b border-sand">
        <div className="relative z-10 text-center py-16 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display italic text-coffee text-4xl md:text-6xl tracking-wide mb-3">
            {title}
          </h1>
          <p className="font-body text-walnut/60 text-sm">{subtitle}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {sections ? (
          <div>
            {sections.map((section, i) => (
              <div
                key={section.number}
                id={`section-${section.number}`}
                className={`py-8 ${i > 0 ? 'border-t border-sand' : ''}`}
              >
                <h2 className="font-display text-xl text-bronze tracking-wide mb-4">
                  {section.number}. {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className={`font-body text-sm md:text-base text-walnut leading-relaxed ${
                        typeof paragraph === 'string' ? 'whitespace-pre-line' : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}
