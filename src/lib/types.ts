// Shared data model — the Client Dashboard (Website 2) reuses these shapes.
export type PlanId = "basic" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // INR
  regularPrice?: number;
  tagline: string;
  badge?: string;
  included: string[];
  excluded: string[];
  note?: string;
  cta: string;
  reviewType: "Light review" | "Detailed personal review";
  whatsapp: boolean;
  doubtSessions: boolean;
}

export interface Course { id: string; nameTa: string; nameEn: string; sessionCount: number }

export interface Session {
  id: number;
  title: string;
  description: string;
  kind: "Teaching" | "Assignment review";
  videoUrl: string;
  pdfs: { name: string; url: string }[];
}

export interface Student { id: string; name: string; email: string; phone: string; createdAt: string }

export interface Enrollment { id: string; studentId: string; courseId: string; planId: PlanId; createdAt: string; upgradedAt?: string }

export interface Payment {
  id: string;
  studentId: string;
  planId: PlanId;
  type: "purchase" | "upgrade";
  amount: number;
  status: "success" | "failed";
  providerPaymentId?: string | undefined;
  createdAt: string;
}

export interface WatchProgress { studentId: string; sessionId: number; watchedSeconds: number[]; duration: number; updatedAt: string }

export interface Assignment { id: string; title: string; afterSession: number; reviewedIn: number }

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  text?: string | undefined;
  fileName?: string | undefined;
  status: "Submitted" | "Reviewed";
  feedback?: string;
  createdAt: string;
}

export interface Certificate { id: string; studentId: string; planId: PlanId; issuedAt: string }

export type EventType =
  | "visit" | "plan_viewed" | "checkout_started" | "payment_success" | "payment_failed"
  | "upgrade" | "session_watched" | "assignment_submitted";

export interface AppEvent { id: string; type: EventType; studentId?: string | undefined; meta?: Record<string, unknown> | undefined; at: string }
