import { describe, expect, it } from "vitest";
import { getPlan, upgradeAmount } from "@/data/course";
import { certificateChecklist, isSessionComplete, isValidIndianPhone } from "@/lib/rules";

describe("pricing", () => {
  it("Basic is ₹999 and Pro is ₹1,199", () => {
    expect(getPlan("basic")!.price).toBe(999);
    expect(getPlan("pro")!.price).toBe(1199);
  });
  it("upgrade from Basic to Pro costs ₹200", () => {
    expect(upgradeAmount(getPlan("basic")!, getPlan("pro")!)).toBe(200);
  });
  it("only Pro gets the WhatsApp group", () => {
    expect(getPlan("basic")!.whatsapp).toBe(false);
    expect(getPlan("pro")!.whatsapp).toBe(true);
  });
});

describe("watch threshold", () => {
  const p = (n: number) => ({ studentId: "s", sessionId: 1, watchedSeconds: Array.from({ length: n }, (_, i) => i), duration: 100, updatedAt: "" });
  it("completes at 90% watched", () => expect(isSessionComplete(p(90), 0.9)).toBe(true));
  it("not complete at 89%", () => expect(isSessionComplete(p(89), 0.9)).toBe(false));
});

describe("certificate", () => {
  it("stays locked while an assignment is missing", () => {
    const full = { studentId: "s", watchedSeconds: Array.from({ length: 10 }, (_, i) => i), duration: 10, updatedAt: "" };
    const r = certificateChecklist({
      sessionIds: [1, 2], progress: [{ ...full, sessionId: 1 }, { ...full, sessionId: 2 }],
      assignments: [{ id: "a1", title: "", afterSession: 1, reviewedIn: 2 }], submissions: [], threshold: 0.9,
    });
    expect(r.unlocked).toBe(false);
    expect(r.pendingAssignments).toHaveLength(1);
  });
});

describe("phone validation", () => {
  it("accepts Indian mobiles", () => expect(isValidIndianPhone("+91 98765 43210")).toBe(true));
  it("rejects numbers starting with 5", () => expect(isValidIndianPhone("5876543210")).toBe(false));
});
