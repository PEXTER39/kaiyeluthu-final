import type { Course, Plan, Session } from "@/lib/types";

export const course: Course = { id: "kaiyeluthu-crash-course", nameTa: "கையெழுத்து", nameEn: "Kaiyeluthu's Crash Course", sessionCount: 10 };

// Plans are data: add a new object here to add a plan.
export const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 999,
    regularPrice: 1999,
    tagline: "Self study",
    included: ["10 recorded sessions", "Session PDFs", "Assignments", "Light assignment review by Aishwarya", "Certificate after completion"],
    excluded: ["Weekly doubt session", "Hands on support", "WhatsApp group"],
    note: "Basic has no support and is completely self study.",
    cta: "Get Started",
    reviewType: "Light review",
    whatsapp: false,
    doubtSessions: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 1199,
    tagline: "Learn with support",
    badge: "Most Popular",
    included: [
      "Everything in Basic",
      "Personal and detailed assignment review",
      "Weekly doubt clearing session (Sundays, 11am to 12pm, on Google Meet)",
      "Full hands on support",
      "Automatic WhatsApp group invite after payment",
    ],
    excluded: [],
    cta: "Choose Pro",
    reviewType: "Detailed personal review",
    whatsapp: true,
    doubtSessions: true,
  },
];

export const getPlan = (id: string) => plans.find((p) => p.id === id);
export const upgradeAmount = (from: Plan, to: Plan) => Math.max(0, to.price - from.price);

export const comparisonRows: { label: string; basic: boolean | string; pro: boolean | string }[] = [
  { label: "10 recorded sessions", basic: true, pro: true },
  { label: "PDFs", basic: true, pro: true },
  { label: "Assignments", basic: true, pro: true },
  { label: "Assignment review", basic: "Light", pro: "Personal & detailed" },
  { label: "Weekly doubt session", basic: false, pro: true },
  { label: "Hands on support", basic: false, pro: true },
  { label: "WhatsApp group", basic: false, pro: true },
  { label: "Certificate", basic: true, pro: true },
];

/**
 * SESSION RECORDINGS
 * Put each recording in /public/videos named session-1.mp4 ... session-10.mp4 and it plays automatically.
 * To host a video somewhere else (Bunny, Cloudflare R2, S3...), paste its direct .mp4 link into
 * videoOverrides below, e.g.  3: "https://cdn.example.com/session-3.mp4"
 */
const videoOverrides: Record<number, string> = {};
const videoFor = (id: number) => videoOverrides[id] ?? `/videos/session-${id}.mp4`;
const pdf = (n: number) => [{ name: `Session ${n} notes.pdf`, url: "#" }]; // TODO: real PDF links

export const sessions: Session[] = [
  { id: 1, kind: "Teaching", title: "Introduction", description: "Why you joined, your goals, and Aishwarya's own journey." },
  { id: 2, kind: "Teaching", title: "Content marketing & content writing", description: "What content marketing and content writing are, where they are used, their value and the market ahead." },
  { id: 3, kind: "Teaching", title: "Basics of content writing", description: "How to approach before you write, types of audiences, techniques and writing styles. Homework: pick a niche and study creators in it." },
  { id: 4, kind: "Teaching", title: "Types of writing & structure", description: "Types of writing and how to structure each one." },
  { id: 5, kind: "Assignment review", title: "Assignment review", description: "Review of submitted assignments." },
  { id: 6, kind: "Teaching", title: "Clients", description: "Types of clients, how to land and convince beginner clients, and what clients expect." },
  { id: 7, kind: "Teaching", title: "Pain points & script revision", description: "Client pain points and script revision." },
  { id: 8, kind: "Assignment review", title: "Assignment review & observations", description: "Assignment review and observations." },
  { id: 9, kind: "Assignment review", title: "Assignment review & observations", description: "Assignment review and observations." },
  { id: 10, kind: "Teaching", title: "Six figure freelancing", description: "Turning freelancing into a six figure income." },
].map((s) => ({ ...s, videoUrl: videoFor(s.id), pdfs: pdf(s.id) })) as Session[];

export const reelMethod = ["Goal", "Competitor check", "Fresh twist", "Hook", "Problem", "Main content", "Call to action", "Read aloud five times", "Under 50 seconds"];
