import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { PageShell } from "@/components/site/Layout";
import { usePayment } from "@/components/site/usePayment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getPlan, plans } from "@/data/course";
import { siteConfig } from "@/config/site";
import { isMockPayments } from "@/lib/payments";
import { isValidIndianPhone } from "@/lib/rules";
import { logEvent, recordFailedPayment, recordPurchase } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: (s["plan"] === "basic" ? "basic" : "pro") as "basic" | "pro" }),
  head: () => ({
    meta: [
      { title: "Checkout · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Enroll in Kaiyeluthu's Crash Course. Secure one time payment in INR via Razorpay." },
      { property: "og:title", content: "Enroll · Kaiyeluthu's Crash Course" },
      { property: "og:description", content: "Pick Basic or Pro and start learning content writing in Tamil." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { plan: planId } = Route.useSearch();
  const plan = getPlan(planId)!;
  const navigate = useNavigate();
  const { pay, dialog } = usePayment();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; paymentId: string } | null>(null);

  useEffect(() => { logEvent("checkout_started", { planId }); }, [planId]);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e["name"] = "Please enter your full name.";
    if (!isValidIndianPhone(form.phone)) e["phone"] = "Enter a valid 10 digit Indian mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e["email"] = "Enter a valid email address.";
    if (!agree) e["agree"] = "Please agree to the terms and the no refund policy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true); setFailed(null); setSaveError(null);
    const r = await pay({ amount: plan.price, description: `${plan.name} plan`, ...form });
    setBusy(false);
    if (r.status === "success") {
      const saved = await recordPurchase({ ...form, planId: plan.id, providerPaymentId: r.paymentId });
      if (saved.ok) navigate({ to: "/success", search: { plan: plan.id } });
      else setSaveError({ message: saved.error, paymentId: r.paymentId });
    } else {
      recordFailedPayment({ planId: plan.id, reason: r.reason });
      setFailed(r.reason);
    }
  }

  const field = (k: keyof typeof form, label: string, type = "text", ph = "") => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5 h-11" aria-invalid={!!errors[k]} />
      {errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <PageShell>
      {dialog}
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="ruled rounded-2xl p-6 pl-14 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-redpen">Your plan</p>
              <h1 className="text-2xl font-bold">{plan.name} · {plan.tagline}</h1>
            </div>
            <p className="text-3xl font-bold">₹{plan.price.toLocaleString("en-IN")}</p>
          </div>
          <div className="mt-3 flex gap-2 text-sm">
            {plans.map((p) => (
              <Link key={p.id} to="/checkout" search={{ plan: p.id }} className={`rounded-full border px-3 py-1 ${p.id === plan.id ? "border-ink bg-ink text-primary-foreground" : "border-border bg-background"}`}>{p.name} ₹{p.price}</Link>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 font-semibold text-redpen"><AlertTriangle className="size-4" /> No refunds. Please read before paying.</p>
        </div>

        {saveError && (
          <div role="alert" className="mt-6 rounded-xl border border-destructive bg-destructive/5 p-4">
            <p className="font-semibold text-destructive">Your payment went through, but we could not finish your enrollment</p>
            <p className="text-sm">{saveError.message} Please do not pay again. Send this payment ID to {siteConfig.contactEmail} and we will activate your account: <b>{saveError.paymentId}</b></p>
          </div>
        )}

        {failed && (
          <div role="alert" className="mt-6 rounded-xl border border-destructive bg-destructive/5 p-4">
            <p className="font-semibold text-destructive">Payment failed</p>
            <p className="text-sm">{failed} No money was taken for this attempt. You can try again.</p>
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          {field("name", "Full name", "text", "Your name")}
          {field("phone", "Phone (India)", "tel", "98765 43210")}
          {field("email", "Email", "email", "you@example.com")}
          <label className="flex items-start gap-3 text-sm">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
            <span>I agree to the <Link to="/terms" className="underline">terms</Link> and the <Link to="/refund-policy" className="underline">refund policy</Link>, and understand there are no refunds.</span>
          </label>
          {errors["agree"] && <p className="text-sm text-destructive">{errors["agree"]}</p>}
          <Button type="submit" variant="cta" size="xl" className="w-full" disabled={busy}>
            <Lock /> {failed ? "Retry payment" : `Pay ₹${plan.price.toLocaleString("en-IN")}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">One time payment in INR via Razorpay.{isMockPayments() && " (Test mode: no real payment.)"} Questions? {siteConfig.contactEmail}</p>
        </form>
      </div>
    </PageShell>
  );
}
