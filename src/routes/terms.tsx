import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Terms · Kaiyeluthu's Crash Course" },
    { name: "description", content: "Terms of use for Kaiyeluthu's Crash Course." },
    { property: "og:title", content: "Terms · Kaiyeluthu" },
    { property: "og:description", content: "Terms of use for Kaiyeluthu's Crash Course." },
  ] }),
  component: () => (
    <LegalPage title="Terms">
      <p>Kaiyeluthu's Crash Course is a recorded content writing course taught in Tamil. Your purchase gives you personal access to the sessions, PDFs and assignments for your plan.</p>
      <p>Course material is for your own learning. Please do not share your login or redistribute videos or PDFs.</p>
      <p>The course teaches a skill and a method. It does not promise a job or a fixed income. Results depend on your practice and consistency.</p>
      <p>All payments are one time, in INR, via Razorpay. There are no refunds.</p>
    </LegalPage>
  ),
});
