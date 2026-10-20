import type { ReactNode } from "react";
import { PageShell } from "./Layout";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl space-y-4 px-4 py-16 leading-relaxed">
        <h1 className="text-3xl font-bold">{title}</h1>
        {children}
        <p className="text-sm text-muted-foreground">Draft text — please review with your own legal advisor.</p>
      </article>
    </PageShell>
  );
}
