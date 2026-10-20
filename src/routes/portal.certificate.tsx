import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, Lock, X } from "lucide-react";
import { useStudent } from "@/components/portal/useStudent";
import { Button } from "@/components/ui/button";
import { sessions } from "@/data/course";
import { issueCertificate } from "@/lib/api";
import type { Plan, Student } from "@/lib/types";

export const Route = createFileRoute("/portal/certificate")({ component: CertificatePage });

async function downloadPdf(student: Student, plan: Plan, date: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = 842, H = 595;
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(143, 179, 224); doc.setLineWidth(0.8);
  for (let y = 90; y < H - 30; y += 34) doc.line(0, y, W, y);
  doc.setDrawColor(214, 69, 65); doc.line(80, 0, 80, H); doc.line(85, 0, 85, H);
  doc.setDrawColor(31, 58, 147); doc.setLineWidth(3); doc.rect(20, 20, W - 40, H - 40);
  doc.setTextColor(31, 58, 147);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text("K A I Y E L U T H U", W / 2, 80, { align: "center" });
  doc.setFontSize(34); doc.text("Certificate of Completion", W / 2, 150, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(14); doc.text("This certifies that", W / 2, 205, { align: "center" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(32); doc.text(student.name, W / 2, 255, { align: "center" });
  doc.setFillColor(232, 168, 23); doc.rect(W / 2 - 150, 268, 300, 4, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(14);
  doc.text("has completed Kaiyeluthu's Crash Course, a content writing course taught in Tamil,", W / 2, 315, { align: "center" });
  doc.text(`on the ${plan.name} plan.`, W / 2, 337, { align: "center" });
  doc.setFontSize(12); doc.text(`Date: ${date}`, 140, 470);
  doc.text("Aishwarya Lakshmi", W - 140, 470, { align: "right" });
  doc.text("Instructor", W - 140, 488, { align: "right" });
  doc.save(`Kaiyeluthu-certificate-${student.name.replace(/\s+/g, "-")}.pdf`);
}

function CertificatePage() {
  const { student, plan, checklist } = useStudent();
  if (!student || !plan) return null;
  if (!checklist.unlocked) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8">
        <Lock className="size-10 text-ink" />
        <h1 className="mt-3 text-2xl font-bold">Certificate locked</h1>
        <p className="text-muted-foreground">Finish these to unlock it:</p>
        <ul className="mt-5 space-y-2">
          {sessions.map((s) => {
            const left = checklist.pendingSessions.includes(s.id);
            return <li key={s.id} className="flex items-center gap-2 text-sm">{left ? <X className="size-4 text-muted-foreground" /> : <Check className="size-4 text-redpen" />}<Link to="/portal/session/$id" params={{ id: String(s.id) }} className={left ? "" : "line-through opacity-60"}>Watch session {s.id}</Link></li>;
          })}
          {checklist.pendingAssignments.map((a) => <li key={a.id} className="flex items-center gap-2 text-sm"><X className="size-4 text-muted-foreground" /><Link to="/portal/assignments">Submit {a.title.split("·")[0]}</Link></li>)}
        </ul>
      </div>
    );
  }
  const cert = issueCertificate(student.id, plan.id);
  const date = new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="space-y-6 text-center">
      <div className="ruled mx-auto max-w-2xl rounded-2xl border-4 border-ink p-10 pl-16 shadow-card">
        <p className="tracking-[0.5em] text-sm font-semibold">KAIYELUTHU</p>
        <h1 className="mt-3 text-3xl font-bold">Certificate of Completion</h1>
        <p className="mt-6 text-3xl font-bold text-redpen">{student.name}</p>
        <p className="mt-3">Kaiyeluthu's Crash Course · {plan.name} plan · {date}</p>
      </div>
      <Button variant="cta" size="xl" onClick={() => downloadPdf(student, plan, date)}><Download /> Download PDF</Button>
    </div>
  );
}
