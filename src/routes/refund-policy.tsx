import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [
    { title: "Refund policy · Kaiyeluthu's Crash Course" },
    { name: "description", content: "All sales are final. Kaiyeluthu's Crash Course does not offer refunds." },
    { property: "og:title", content: "Refund policy · Kaiyeluthu" },
    { property: "og:description", content: "All sales are final. No refunds." },
  ] }),
  component: () => (
    <LegalPage title="Refund policy">
      <p className="text-xl font-semibold text-redpen">No refunds.</p>
      <p>Because you get instant access to recorded sessions and course material, all purchases and upgrades are final and are not refundable.</p>
      <p>Please read the plan details carefully before paying. If you have a question before buying, write to us first.</p>
    </LegalPage>
  ),
});
