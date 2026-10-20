import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Briefcase, Check, GraduationCap, Home, MapPin, PlayCircle, X, FileText, Award, Users, Languages, ClipboardCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Intro } from "@/components/site/Intro";
import { Reviews } from "@/components/site/Reviews";
import { PageShell, SectionHead } from "@/components/site/Layout";
import { Pencil } from "@/components/site/Brand";
import { comparisonRows, plans, reelMethod, sessions } from "@/data/course";
import { faqs, timeline } from "@/data/content";
import { siteConfig } from "@/config/site";
import { logEvent } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaiyeluthu's Crash Course · Learn content writing in Tamil" },
      { name: "description", content: "Learn 12 hrs. Write 24 hrs. Earn Forever. 10 recorded content writing sessions taught in Tamil by Aishwarya Lakshmi. Join 200+ students." },
      { property: "og:title", content: "கையெழுத்து · Kaiyeluthu's Crash Course" },
      { property: "og:description", content: "10 recorded content writing sessions, taught in Tamil. Assignments reviewed by Aishwarya. From ₹999." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => { logEvent("visit", { path: "/" }); }, []);
  return (
    <>
      <Intro />
      <PageShell enrollBar>
        <Hero />
        <div className="margin-divider" />
        <About />
        <WhoFor />
        <Curriculum />
        <Meet />
        <Pricing />
        <Reviews />
        <HonestNote />
        <Faq />
        <ClosingBanner />
      </PageShell>
    </>
  );
}

function Hero() {
  const trust = [
    { icon: Users, t: `${siteConfig.studentCount} students learning` },
    { icon: Languages, t: "Taught in Tamil" },
    { icon: ClipboardCheck, t: "Assignments reviewed by Aishwarya" },
    { icon: Award, t: "Certificate on completion" },
  ];
  return (
    <section className="ruled-soft relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div className="rise">
          <p className="font-tamil text-lg font-semibold text-redpen">கையெழுத்து · Kaiyeluthu's Crash Course</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Learn 12 hrs.<br />Write 24 hrs.<br />
            <span className="relative inline-block">Earn Forever.<span className="absolute -bottom-1 left-0 h-3 w-full -z-10 bg-manjal/50 rounded" /></span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">10 recorded sessions, taught in Tamil. Content writing from scratch, with assignments Aishwarya reviews herself.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="cta" size="xl"><a href="#plans">Enroll Now</a></Button>
            <Button asChild variant="inkOutline" size="xl"><a href="#curriculum">See curriculum</a></Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm rise" style={{ animationDelay: ".15s" }}>
          <div className="ruled rounded-2xl p-3 pl-12 shadow-card">
            <img src="/images/writing.jpg" alt="Aishwarya writing in her notebook" className="aspect-[4/5] w-full rounded-xl object-cover" width={900} height={1500} />
          </div>
          <Pencil className="absolute -bottom-4 -left-6 w-36 rotate-[-18deg]" />
        </div>
      </div>
      <div className="border-y border-border bg-cream">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4">
          {trust.map(({ icon: I, t }) => (
            <li key={t} className="flex items-center gap-3 text-sm font-medium"><I className="size-5 shrink-0 text-redpen" />{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <SectionHead eyebrow="About the course" title="A real, practical skill. Step by step." />
      <div className="grid gap-6 text-lg leading-relaxed md:grid-cols-2">
        <p>Kaiyeluthu's Crash Course is a 10 session content writing course for people who want a real, practical skill. You start from the very basics and move step by step: how content marketing works, how to write for different platforms, how to write hooks and reel scripts, and how to find and approach clients on your own.</p>
        <div className="space-y-6">
          <p>Every session is recorded and taught in Tamil, so you can learn when you are free, whether you are a student, a homemaker or someone with a full time job. You practise through assignments as you go, and you finish with a clear method you can keep using.</p>
          <p>More than 200 students are already learning in this course, and many have shared their reviews on the Instagram page.</p>
        </div>
      </div>
    </section>
  );
}

function WhoFor() {
  const cards = [
    { icon: GraduationCap, t: "Beginners", d: "Never written for money? You start from zero." },
    { icon: MapPin, t: "Students from smaller cities", d: "Learn in Tamil, from anywhere, on your phone." },
    { icon: Home, t: "Homemakers", d: "Recorded sessions fit around your day." },
    { icon: Briefcase, t: "Working professionals", d: "Build a side skill without quitting your job." },
  ];
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead eyebrow="Who it is for" title="Made for people starting out" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <I className="size-8 text-ink" />
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Curriculum() {
  return (
    <section id="curriculum" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <SectionHead eyebrow="Curriculum" title="10 recorded sessions" sub="PDFs for the sessions are included." />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
          {sessions.map((s) => (
            <AccordionItem key={s.id} value={String(s.id)}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-primary-foreground">{s.id}</span>
                  <span className="font-semibold">{s.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.kind === "Teaching" ? "bg-secondary text-ink" : "bg-accent text-redpen"}`}>{s.kind}</span>
                <p className="text-muted-foreground">{s.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <aside className="ruled h-fit rounded-2xl p-6 pl-14 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-redpen">Highlight</p>
          <h3 className="mt-2 text-2xl font-bold">The reel script method</h3>
          <ol className="mt-4 space-y-[0.4rem] leading-[1.6rem]">
            {reelMethod.map((m, i) => <li key={m}><span className="font-semibold text-redpen">{i + 1}.</span> {m}</li>)}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium"><FileText className="size-4" /> PDFs for the sessions</p>
        </aside>
      </div>
    </section>
  );
}

function Meet() {
  return (
    <section className="bg-ink py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1.3fr] md:items-center">
        <img src="/images/aishwarya.jpg" alt="Aishwarya Lakshmi" className="mx-auto aspect-square w-full max-w-sm rounded-3xl object-cover ring-4 ring-manjal" width={900} height={900} loading="lazy" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-manjal">Meet your teacher</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Hi, this is Aishwarya!</h2>
          <p className="mt-5 text-lg leading-relaxed opacity-90">Content writing gave me independence, respect, and recognition at a very young age, and I'd love to help you build yours. I teach the exact process I use, step by step in Tamil, with assignments I review myself. I can't promise overnight success and I won't. What I can promise is a clear path to a better life through content writing.</p>
          <blockquote className="mt-6 border-l-4 border-manjal pl-4 text-xl font-medium italic">"Others aren't more talented than you. They just started earlier. You don't need a degree, a big laptop or perfect English."</blockquote>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {timeline.map((t) => (
              <li key={t.when} className="flex gap-3"><span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-manjal" /><span><span className="font-semibold">{t.when}</span> · <span className="opacity-85">{t.what}</span></span></li>
            ))}
          </ol>
          <Link to="/blog/$slug" params={{ slug: "how-i-started-with-nothing" }} className="mt-8 inline-block font-semibold text-manjal underline underline-offset-4">Read my full story →</Link>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  useEffect(() => {
    const el = document.getElementById("plans");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { logEvent("plan_viewed"); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="plans" className="ruled-soft scroll-mt-20 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHead eyebrow="Plans" title="Choose how you want to learn" />
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((p) => {
            const pro = p.id === "pro";
            return (
              <div key={p.id} className={`relative flex flex-col rounded-3xl border-2 p-7 shadow-card ${pro ? "border-manjal bg-ink text-primary-foreground" : "border-border bg-card"}`}>
                {p.badge && <span className="absolute -top-3 right-6 rounded-full bg-manjal px-3 py-1 text-xs font-bold text-ink">{p.badge}</span>}
                <p className="text-sm font-semibold uppercase tracking-widest opacity-80">{p.name}</p>
                <p className="mt-1 text-sm opacity-75">{p.tagline}</p>
                <p className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-bold">₹{p.price.toLocaleString("en-IN")}</span>
                  {siteConfig.showRegularPrice && p.regularPrice && <span className="mb-1.5 text-lg text-muted-foreground line-through decoration-redpen decoration-2">₹{p.regularPrice.toLocaleString("en-IN")}</span>}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.included.map((f) => <li key={f} className="flex gap-3"><Check className={`mt-0.5 size-5 shrink-0 ${pro ? "text-manjal" : "text-redpen"}`} />{f}</li>)}
                  {p.excluded.map((f) => <li key={f} className="flex gap-3 text-muted-foreground"><X className="mt-0.5 size-5 shrink-0" />{f}</li>)}
                </ul>
                {p.note && <p className="mt-5 rounded-lg bg-muted p-3 text-sm">{p.note}</p>}
                <Button asChild variant="cta" size="xl" className="mt-6 w-full">
                  <Link to="/checkout" search={{ plan: p.id }}>{p.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm font-medium">One time payment in INR via Razorpay. No refunds.</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">Recorded sessions stay available after purchase.</p>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted text-left"><th className="p-4">Compare</th><th className="p-4">Basic</th><th className="p-4">Pro</th></tr></thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{r.label}</td>
                  {[r.basic, r.pro].map((v, i) => (
                    <td key={i} className="p-4">{typeof v === "string" ? v : v ? <Check className="size-5 text-redpen" aria-label="Included" /> : <X className="size-5 text-muted-foreground" aria-label="Not included" />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function HonestNote() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-4">
      <div className="rounded-2xl border-2 border-dashed border-redpen/50 bg-cream p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-redpen">An honest note</p>
        <p className="mt-2 text-lg">This course teaches the skill and the method. It does not promise a job or a fixed income. Results depend on your practice and consistency.</p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
      <SectionHead eyebrow="FAQ" title="Questions, answered" />
      <Accordion type="single" collapsible>
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function ClosingBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-ink px-8 py-10 text-center text-primary-foreground sm:flex-row sm:text-left">
        <p className="text-2xl font-medium sm:text-3xl">Content writing <span className="font-tamil">கத்துக்கலாம் வாங்க!</span></p>
        <Button asChild variant="cta" size="xl"><a href="#plans"><PlayCircle /> Join now</a></Button>
      </div>
      <p className="sr-only"><BookOpen /></p>
    </section>
  );
}
