import { paymentConfig } from "@/config/site";

export type PayResult = { status: "success"; paymentId: string } | { status: "failed"; reason: string };

export const isMockPayments = () => paymentConfig.mockPayments || !paymentConfig.razorpayKeyId;

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Opens Razorpay Checkout. TODO (production): create an order on a server
 * with the key secret, pass order_id here, and verify the signature server-side.
 */
export async function openRazorpay(opts: { amount: number; description: string; name: string; email: string; phone: string }): Promise<PayResult> {
  const ok = await loadScript();
  if (!ok) return { status: "failed", reason: "Could not load Razorpay. Check your connection." };
  return new Promise((resolve) => {
    const rzp = new (window as any).Razorpay({
      key: paymentConfig.razorpayKeyId,
      amount: opts.amount * 100,
      currency: paymentConfig.currency,
      name: "Kaiyeluthu's Crash Course",
      description: opts.description,
      prefill: { name: opts.name, email: opts.email, contact: opts.phone },
      theme: { color: "#1F3A93" },
      handler: (r: { razorpay_payment_id: string }) => resolve({ status: "success", paymentId: r.razorpay_payment_id }),
      modal: { ondismiss: () => resolve({ status: "failed", reason: "Payment window closed." }) },
    });
    rzp.on("payment.failed", (r: any) => resolve({ status: "failed", reason: r?.error?.description ?? "Payment failed." }));
    rzp.open();
  });
}
