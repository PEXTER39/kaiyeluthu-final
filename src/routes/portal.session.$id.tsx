import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useStudent } from "@/components/portal/useStudent";
import { Progress } from "@/components/ui/progress";
import { sessions } from "@/data/course";
import { siteConfig } from "@/config/site";
import { markSessionWatched, saveWatchProgress } from "@/lib/api";
import { isSessionComplete, watchRatio } from "@/lib/rules";

export const Route = createFileRoute("/portal/session/$id")({ component: SessionPage });

function SessionPage() {
  const { id } = Route.useParams();
  const session = sessions.find((s) => s.id === Number(id));
  const { student, progress, refresh } = useStudent();
  const video = useRef<HTMLVideoElement>(null);
  const last = useRef(0);
  const pending = useRef(new Set<number>());
  const [ratio, setRatio] = useState(0);
  const [missing, setMissing] = useState(false);
  const saved = progress.find((p) => p.sessionId === Number(id));

  useEffect(() => { setRatio(watchRatio(saved)); }, [saved]);
  useEffect(() => { setMissing(false); }, [id]);

  useEffect(() => {
    const v = video.current;
    if (!v || !student || !session) return;
    const wasComplete = isSessionComplete(saved, siteConfig.watchThreshold);
    const onTime = () => {
      const t = v.currentTime;
      const d = t - last.current;
      // Count only continuous playback; seeking jumps are ignored.
      if (d > 0 && d < 1.5 && !v.seeking) pending.current.add(Math.floor(t));
      last.current = t;
    };
    const flush = () => {
      if (!v.duration || pending.current.size === 0) return;
      const w = saveWatchProgress(student.id, session.id, [...pending.current], v.duration);
      pending.current.clear();
      setRatio(watchRatio(w));
      if (!wasComplete && isSessionComplete(w, siteConfig.watchThreshold)) { markSessionWatched(student.id, session.id); refresh(); }
    };
    const onSeek = () => { last.current = v.currentTime; };
    const iv = setInterval(flush, 3000);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("seeked", onSeek);
    v.addEventListener("pause", flush);
    v.addEventListener("ended", flush);
    return () => { clearInterval(iv); flush(); v.removeEventListener("timeupdate", onTime); v.removeEventListener("seeked", onSeek); v.removeEventListener("pause", flush); v.removeEventListener("ended", flush); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id, session?.id]);

  if (!session) return <p>Session not found.</p>;
  const complete = ratio >= siteConfig.watchThreshold;
  return (
    <div className="space-y-6">
      <Link to="/portal" className="text-sm text-muted-foreground">← Dashboard</Link>
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-redpen">Session {session.id} · {session.kind}</span>
        <h1 className="text-2xl font-bold">{session.title}</h1>
      </div>
      <div className="relative">
        <video ref={video} src={session.videoUrl} controls playsInline onError={() => setMissing(true)} className="aspect-video w-full rounded-2xl bg-ink" />
        {missing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink p-6 text-center text-primary-foreground">
            <p>This recording is not uploaded yet. Please check back soon.</p>
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex justify-between text-sm"><span>Watched {Math.round(ratio * 100)}%</span><span className={complete ? "font-semibold text-redpen" : "text-muted-foreground"}>{complete ? "Completed" : `Complete at ${siteConfig.watchThreshold * 100}%`}</span></div>
        <Progress value={ratio * 100} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">Only the parts you actually watch count. Skipped parts are not counted.</p>
      </div>
      <p className="text-muted-foreground">{session.description}</p>
      <div className="flex flex-wrap gap-2">
        {session.pdfs.map((p) => <a key={p.name} href={p.url} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"><FileText className="size-4 text-redpen" />{p.name}</a>)}
      </div>
      <div className="flex justify-between">
        {session.id > 1 ? <Link to="/portal/session/$id" params={{ id: String(session.id - 1) }} className="flex items-center gap-1 text-sm font-medium"><ChevronLeft className="size-4" />Previous</Link> : <span />}
        {session.id < 10 && <Link to="/portal/session/$id" params={{ id: String(session.id + 1) }} className="flex items-center gap-1 text-sm font-medium">Next<ChevronRight className="size-4" /></Link>}
      </div>
    </div>
  );
}
