import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, PlayCircle } from "lucide-react";
import { PageShell } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/data/course";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: (s["plan"] === "basic" ? "basic" : "pro") as "basic" | "pro" }),
  head: () => ({
    meta: [
      { title: "You're enrolled · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Payment successful. Welcome to Kaiyeluthu's Crash Course." },
      { property: "og:title", content: "Welcome to Kaiyeluthu's Crash Course" },
      { property: "og:description", content: "Your enrollment is confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { plan: id } = Route.useSearch();
  const plan = getPlan(id)!;
  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto size-16 text-redpen" />
        <h1 className="mt-4 text-3xl font-bold">Payment successful!</h1>
        <p className="mt-2 text-muted-foreground">You're enrolled in the <b className="text-ink">{plan.name}</b> plan. A welcome email is on its way.</p>
        <div className="mt-8 flex flex-col gap-3">
          {plan.whatsapp && (
            <Button asChild variant="cta" size="xl"><a href={siteConfig.whatsappGroupUrl} target="_blank" rel="noreferrer"><MessageCircle /> Join WhatsApp Group</a></Button>
          )}
          <Button asChild variant={plan.whatsapp ? "inkOutline" : "cta"} size="xl"><Link to="/portal"><PlayCircle /> Start learning</Link></Button>
        </div>
      </div>
    </PageShell>
  );
}
