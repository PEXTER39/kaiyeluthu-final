import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestOtp, verifyOtp } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student login · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Log in to watch your sessions, submit assignments and get your certificate." },
      { property: "og:title", content: "Student login · Kaiyeluthu" },
      { property: "og:description", content: "Access your Kaiyeluthu student portal." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [wait, setWait] = useState(0);

  // Count down before the code can be sent again.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault(); setError(""); setBusy(true);
    const r = await requestOtp(email);
    setBusy(false);
    if (r.ok) { setDevOtp(r.devOtp ?? null); setOtp(""); setStep("otp"); setWait(30); return; }
    if (r.error === "not_found") return setError("We couldn't find a student with this email. Use the email you paid with.");
    if (r.error === "wait") { setWait(r.retryAfter ?? 30); if (step === "email") setStep("otp"); return setError(`Please wait ${r.retryAfter ?? 30} seconds before asking for another code.`); }
    if (r.error === "send_failed") return setError("We could not send the code right now. Please try again in a minute.");
    if (r.error === "offline") return setError("Could not reach the server. Please check your connection and try again.");
    setError(r.message ?? "Something went wrong. Please try again.");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    const s = await verifyOtp(email, otp);
    setBusy(false);
    if (s) navigate({ to: "/portal" });
    else setError("That code is not right, or it has expired. Try again or ask for a new code.");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="ruled rounded-2xl p-8 pl-14 shadow-card">
          <h1 className="text-2xl font-bold">Student login</h1>
          {step === "email" ? (
            <form onSubmit={send} className="mt-6 space-y-4">
              <div><Label htmlFor="em">Email</Label><Input id="em" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 bg-background" /></div>
              <p className="text-sm text-muted-foreground">Use the email you paid with. We will send a 6 digit code to it.</p>
              <Button variant="cta" size="xl" className="w-full" disabled={busy}>{busy ? "Sending…" : "Send login code"}</Button>
            </form>
          ) : (
            <form onSubmit={verify} className="mt-6 space-y-4">
              <p className="text-sm">Enter the 6 digit code sent to <b>{email}</b>. Check your spam folder if you don't see it.</p>
              {devOtp && <p className="rounded bg-accent p-2 text-xs">Test mode (email is not set up yet): your code is <b>{devOtp}</b></p>}
              <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="h-11 bg-background tracking-[0.5em]" aria-label="6 digit code" />
              <Button variant="cta" size="xl" className="w-full" disabled={busy || otp.length !== 6}>{busy ? "Checking…" : "Log in"}</Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="underline disabled:no-underline disabled:opacity-50" disabled={wait > 0 || busy} onClick={() => send()}>{wait > 0 ? `Resend code in ${wait}s` : "Resend code"}</button>
                <button type="button" className="underline" onClick={() => { setStep("email"); setError(""); setDevOtp(null); }}>Use a different email</button>
              </div>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </PageShell>
  );
}
