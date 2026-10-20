import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStudent } from "@/components/portal/useStudent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/api";
import { isValidIndianPhone } from "@/lib/rules";

export const Route = createFileRoute("/portal/profile")({ component: Profile });

function Profile() {
  const { student, plan, refresh } = useStudent();
  const [name, setName] = useState(student?.name ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  if (!student || !plan) return null;
  return (
    <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-border bg-card p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
      <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" /></div>
      <div><Label>Email</Label><Input value={student.email} disabled className="mt-1.5" /></div>
      <p>Plan: <b>{plan.name}</b></p>
      <Button variant="ink" onClick={() => { if (!isValidIndianPhone(phone)) { toast.error("Enter a valid Indian mobile number."); return; } updateProfile(student.id, { name, phone }); refresh(); toast.success("Saved"); }}>Save</Button>
      {plan.id === "basic" && (
        <div className="rounded-xl border-2 border-manjal p-4">
          <p className="font-semibold">Upgrade to Pro for ₹200</p>
          <p className="text-sm text-muted-foreground">Get detailed reviews, Sunday doubt sessions and the WhatsApp group.</p>
          <Button asChild variant="cta" className="mt-3"><Link to="/upgrade">Upgrade now</Link></Button>
        </div>
      )}
    </div>
  );
}
