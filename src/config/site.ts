/**
 * ============================================================
 *  SITE CONFIG — edit these values, no code changes needed.
 * ============================================================
 */
export const siteConfig = {
  courseNameTa: "கையெழுத்து",
  courseNameEn: "Kaiyeluthu's Crash Course",
  instructor: "Aishwarya Lakshmi",
  instagramUrl: "https://www.instagram.com/aishwarya.mudhaliyar/",
  contactEmail: "hello@kaiyeluthu.in", // TODO: confirm real contact email
  whatsappGroupUrl: "https://chat.whatsapp.com/", // TODO: Pro WhatsApp group invite link
  googleMeetUrl: "https://meet.google.com/", // TODO: Sunday doubt session link
  studentCount: "200+",

  /** Show the struck-through regular price on Basic. */
  showRegularPrice: true,

  /** A session counts as complete when this share of it was actually watched. */
  watchThreshold: 0.9,

  /** Assignments: count and the review session each is linked to. */
  assignments: [
    { id: "a1", title: "Assignment 1 · Pick your niche & study creators", afterSession: 3, reviewedIn: 5 },
    { id: "a2", title: "Assignment 2 · Write a structured piece", afterSession: 4, reviewedIn: 8 },
    { id: "a3", title: "Assignment 3 · Reel script with the method", afterSession: 7, reviewedIn: 9 },
  ],
};

/**
 * ============================================================
 *  PAYMENTS — RAZORPAY CONFIG AREA
 * ============================================================
 *  1. Put your PUBLIC key id below (rzp_live_xxx / rzp_test_xxx).
 *  2. Set mockPayments to false.
 *  The key SECRET must never go in this file. Order creation and
 *  signature verification belong on a server (see README).
 */
export const paymentConfig = {
  razorpayKeyId: "", // TODO: "rzp_test_XXXXXXXX"
  mockPayments: true,
  currency: "INR",
};
