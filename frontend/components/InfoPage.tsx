import type { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className="info-page mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <header className="info-page-intro mb-10 sm:mb-12">
        <p className="info-page-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.24em]">{eyebrow}</p>
        <h1 className="font-heading text-4xl leading-tight text-dark sm:text-5xl">{title}</h1>
        <p className="info-page-lede mt-5 max-w-2xl text-base leading-7 text-muted">{intro}</p>
      </header>
      <div className="info-page-content space-y-8 text-sm leading-7 text-charcoal [&_h2]:mb-2 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-dark [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
