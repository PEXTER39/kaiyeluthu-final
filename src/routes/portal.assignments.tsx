import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStudent } from "@/components/portal/useStudent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { submitAssignment } from "@/lib/api";

export const Route = createFileRoute("/portal/assignments")({ component: Assignments });

function Assignments() {
  const { student, plan, submissions, refresh } = useStudent();
  if (!student || !plan) return null;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Review type: <b className="text-ink">{plan.reviewType}</b></p>
      </div>
      {siteConfig.assignments.map((a) => {
        const sub = submissions.find((s) => s.assignmentId === a.id);
        return <AssignmentCard key={a.id} a={a} sub={sub} onSubmit={(d) => { submitAssignment(student, a.id, d); toast.success("Submitted! Aishwarya has been notified."); refresh(); }} />;
      })}
    </div>
  );
}

function AssignmentCard({ a, sub, onSubmit }: { a: (typeof siteConfig.assignments)[number]; sub?: { status: string; feedback?: string | undefined; text?: string | undefined; fileName?: string | undefined } | undefined; onSubmit: (d: { text?: string | undefined; fileName?: string | undefined }) => void }) {
  const [text, setText] = useState(sub?.text ?? "");
  const [file, setFile] = useState<File | null>(null);
  const status = sub?.status ?? "Not submitted";
  const color = status === "Reviewed" ? "bg-redpen text-primary-foreground" : status === "Submitted" ? "bg-manjal text-ink" : "bg-muted";
  return (
    <div className="ruled rounded-2xl p-6 pl-14 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h2 className="font-semibold">{a.title}</h2><p className="text-sm text-muted-foreground">After session {a.afterSession} · reviewed in session {a.reviewedIn}</p></div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{status}</span>
      </div>
      {sub?.feedback && <div className="mt-4 rounded-lg bg-accent p-3 text-sm"><b>Feedback:</b> {sub.feedback}</div>}
      {sub?.fileName && <p className="mt-2 text-sm">File: {sub.fileName}</p>}
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!text.trim() && !file) { toast.error("Add text or a file first."); return; } onSubmit({ text: text.trim() || undefined, fileName: file?.name }); }}>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write or paste your assignment here" className="min-h-28 bg-background" />
        {/* TODO: upload file to storage once backend is connected; currently only the name is saved. */}
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block text-sm" />
        <Button variant="cta">{sub ? "Resubmit" : "Submit"}</Button>
      </form>
    </div>
  );
}
