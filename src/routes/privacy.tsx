import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy · Kaiyeluthu's Crash Course" },
    { name: "description", content: "How Kaiyeluthu's Crash Course uses your information." },
    { property: "og:title", content: "Privacy · Kaiyeluthu" },
    { property: "og:description", content: "How we use your information." },
  ] }),
  component: () => (
    <LegalPage title="Privacy">
      <p>We collect your name, phone and email when you enroll, to give you course access, send course emails and, for Pro, add you to the WhatsApp group.</p>
      <p>Payments are processed by Razorpay. We never see or store your card or UPI details.</p>
      <p>We record your session watch time and assignment submissions to show your progress and issue your certificate.</p>
    </LegalPage>
  ),
});
