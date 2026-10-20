import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isMockPayments, openRazorpay, type PayResult } from "@/lib/payments";

type Opts = Parameters<typeof openRazorpay>[0];

/** Real Razorpay when configured, otherwise a clearly marked mock checkout. */
export function usePayment() {
  const [mock, setMock] = useState<Opts | null>(null);
  const resolver = useRef<(r: PayResult) => void>(undefined);

  async function pay(opts: Opts): Promise<PayResult> {
    if (!isMockPayments()) return openRazorpay(opts);
    setMock(opts);
    return new Promise((res) => { resolver.current = res; });
  }
  function done(r: PayResult) { resolver.current?.(r); setMock(null); }

  const dialog = (
    <Dialog open={!!mock} onOpenChange={(o) => !o && done({ status: "failed", reason: "Payment window closed." })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test payment (mock mode)</DialogTitle>
          <DialogDescription>Razorpay keys are not set yet, so no real money moves. Choose an outcome.</DialogDescription>
        </DialogHeader>
        <p className="text-2xl font-bold">₹{mock?.amount.toLocaleString("en-IN")}</p>
        <p className="text-sm text-muted-foreground">{mock?.description}</p>
        <div className="flex gap-2">
          <Button variant="cta" className="flex-1" onClick={() => done({ status: "success", paymentId: "mock_" + Date.now() })}>Simulate success</Button>
          <Button variant="outline" className="flex-1" onClick={() => done({ status: "failed", reason: "Simulated failure." })}>Simulate failure</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  return { pay, dialog };
}
