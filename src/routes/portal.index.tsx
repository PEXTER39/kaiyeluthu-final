import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CalendarClock, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { useStudent } from "@/components/portal/useStudent";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sessions } from "@/data/course";
import { siteConfig } from "@/config/site";
import { isSessionComplete, watchRatio } from "@/lib/rules";

export const Route = createFileRoute("/portal/")({ component: Dashboard });

function nextSunday() {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

function Dashboard() {
  const { student, plan, progress, submissions, checklist } = useStudent();
  if (!student || !plan) return null;
  const done = sessions.filter((s) => isSessionComplete(progress.find((p) => p.sessionId === s.id), siteConfig.watchThreshold)).length;
  const next = sessions.find((s) => !isSessionComplete(progress.find((p) => p.sessionId === s.id), siteConfig.watchThreshold));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Vanakkam, {student.name.split(" ")[0]}!</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${plan.id === "pro" ? "bg-manjal text-ink" : "bg-secondary"}`}>{plan.name} plan</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Overall progress"><p className="text-3xl font-bold">{done}/10</p><Progress value={done * 10} className="mt-3" /></Card>
        <Card title="Assignments"><p className="text-3xl font-bold">{submissions.length}/{siteConfig.assignments.length}</p><Link to="/portal/assignments" className="mt-2 inline-block text-sm underline">Open assignments</Link></Card>
        <Card title="Certificate"><p className="flex items-center gap-2 font-semibold"><Award className="size-5 text-redpen" />{checklist.unlocked ? "Ready to download" : "Locked"}</p><Link to="/portal/certificate" className="mt-2 inline-block text-sm underline">View</Link></Card>
      </div>
      {next && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-primary-foreground">
          <div><p className="text-sm opacity-80">Next session</p><p className="text-xl font-semibold">{next.id}. {next.title}</p></div>
          <Button asChild variant="cta"><Link to="/portal/session/$id" params={{ id: String(next.id) }}><PlayCircle /> Continue</Link></Button>
        </div>
      )}
      {plan.doubtSessions && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-manjal bg-card p-6">
          <div className="flex items-center gap-3"><CalendarClock className="size-6 text-ink" /><div><p className="font-semibold">Doubt clearing session</p><p className="text-sm text-muted-foreground">{nextSunday()} · 11am to 12pm · Google Meet</p></div></div>
          <Button asChild variant="ink"><a href={siteConfig.googleMeetUrl} target="_blank" rel="noreferrer">Join Google Meet</a></Button>
        </div>
      )}
      <div className="rounded-2xl border border-border bg-card">
        {sessions.map((s) => {
          const p = progress.find((x) => x.sessionId === s.id);
          const complete = isSessionComplete(p, siteConfig.watchThreshold);
          return (
            <Link key={s.id} to="/portal/session/$id" params={{ id: String(s.id) }} className="flex items-center gap-4 border-b border-border p-4 last:border-0 hover:bg-muted">
              {complete ? <CheckCircle2 className="size-5 text-redpen" /> : <Circle className="size-5 text-lineblue" />}
              <span className="flex-1 font-medium">{s.id}. {s.title}</span>
              <span className="text-sm text-muted-foreground">{Math.round(watchRatio(p) * 100)}%</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><p className="mb-2 text-sm text-muted-foreground">{title}</p>{children}</div>;
}
