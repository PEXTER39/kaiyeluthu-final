import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/Layout";
import { usePayment } from "@/components/site/usePayment";
import { useStudent } from "@/components/portal/useStudent";
import { Button } from "@/components/ui/button";
import { getPlan, upgradeAmount } from "@/data/course";
import { recordFailedPayment, recordUpgrade } from "@/lib/api";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Upgrade to Pro · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Basic students can move to Pro by paying the difference." },
      { property: "og:title", content: "Upgrade to Pro · Kaiyeluthu" },
      { property: "og:description", content: "Pay the difference and get Pro support." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Upgrade,
});

function Upgrade() {
  const { ready, student, plan } = useStudent();
  const { pay, dialog } = usePayment();
  const navigate = useNavigate();
  const [failed, setFailed] = useState<string | null>(null);
  const pro = getPlan("pro")!;
  if (!ready) return null;
  const amount = plan ? upgradeAmount(plan, pro) : 0;

  return (
    <PageShell>
      {dialog}
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        {!student ? (
          <><h1 className="text-2xl font-bold">Please log in first</h1><Button asChild variant="cta" className="mt-4"><Link to="/login">Log in</Link></Button></>
        ) : plan?.id === "pro" ? (
          <><h1 className="text-2xl font-bold">You're already on Pro</h1><Button asChild variant="cta" className="mt-4"><Link to="/portal">Go to portal</Link></Button></>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Upgrade to Pro</h1>
            <p className="mt-2 text-muted-foreground">Pay only the difference.</p>
            <p className="mt-6 text-5xl font-bold">₹{amount}</p>
            <p className="mt-2 text-sm font-semibold text-redpen">No refunds. Please read before paying.</p>
            {failed && <p role="alert" className="mt-4 text-sm text-destructive">{failed}</p>}
            <Button variant="cta" size="xl" className="mt-6 w-full" onClick={async () => {
              const r = await pay({ amount, description: "Upgrade Basic → Pro", name: student.name, email: student.email, phone: student.phone });
              if (r.status === "success") {
                const saved = await recordUpgrade(student.id, amount, r.paymentId);
                if (saved.ok) navigate({ to: "/success", search: { plan: "pro" } });
                else setFailed(`Your payment went through (payment ID ${r.paymentId}) but we could not save the upgrade: ${saved.error} Please contact us with this ID.`);
              } else { recordFailedPayment({ type: "upgrade", reason: r.reason }); setFailed(r.reason); }
            }}>{failed ? "Retry payment" : `Pay ₹${amount}`}</Button>
          </>
        )}
      </div>
    </PageShell>
  );
}
