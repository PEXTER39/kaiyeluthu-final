/**
 * Kaiyeluthu API server
 * ---------------------------------------------------------------
 * Small Node server with no extra dependencies. It stores paid
 * students, sends and checks email OTP codes, verifies payments and
 * keeps each student's progress, so login works on any device.
 *
 * Run it together with the website:   npm run dev
 * Run only the API:                   npm run dev:api
 * Settings live in the .env file (see .env.example).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try { process.loadEnvFile(path.join(ROOT, ".env")); } catch { /* no .env file: defaults apply */ }

const env = process.env;
const PROD = env.NODE_ENV === "production";
const PORT = Number(env.API_PORT || 8787);
const DB_FILE = path.resolve(ROOT, env.DB_FILE || "server/data/db.json");

/** Keep these in step with src/data/course.ts */
const PLANS = { basic: { price: 999 }, pro: { price: 1199 } };
const SESSION_COUNT = 10;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 30 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const emailProvider = (env.EMAIL_PROVIDER || "console").toLowerCase();
const showOtpInResponse = !PROD && emailProvider === "console";

/* ------------------------------ storage ------------------------------ */
const emptyDb = () => ({ students: [], enrollments: [], payments: [], watch: [], submissions: [], certificates: [], sessions: [] });
let db = emptyDb();
try { db = { ...emptyDb(), ...JSON.parse(fs.readFileSync(DB_FILE, "utf8")) }; } catch { /* first run */ }
function save() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
const uid = () => crypto.randomBytes(6).toString("hex") + Date.now().toString(36);
const now = () => new Date().toISOString();
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

/* ------------------------------ helpers ------------------------------ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+?91|0)?[6-9]\d{9}$/;
const normEmail = (e) => String(e || "").trim().toLowerCase();
const isPhone = (v) => PHONE_RE.test(String(v || "").replace(/[\s-]/g, ""));

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

const hits = new Map();
function rateLimit(key, max, windowMs) {
  const t = Date.now();
  const list = (hits.get(key) || []).filter((x) => t - x < windowMs);
  if (list.length >= max) throw new HttpError(429, "rate_limited", "Too many attempts. Please wait a few minutes and try again.");
  list.push(t); hits.set(key, list);
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > 1_000_000) { reject(new HttpError(413, "too_large", "Request too large.")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch { reject(new HttpError(400, "bad_json", "Invalid JSON.")); }
    });
    req.on("error", reject);
  });
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("="); if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  res.end(JSON.stringify(body));
}

function sessionCookie(req, token, maxAgeSec) {
  const secure = PROD || req.headers["x-forwarded-proto"] === "https";
  return `kc_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSec}${secure ? "; Secure" : ""}`;
}

/** Block cross-site POSTs: JSON content type is required and Origin must be this site. */
function checkOrigin(req) {
  if (req.method === "GET" || req.method === "HEAD") return;
  if (!String(req.headers["content-type"] || "").includes("application/json")) throw new HttpError(415, "bad_type", "JSON required.");
  const origin = req.headers.origin; if (!origin) return;
  let host; try { host = new URL(origin).host; } catch { throw new HttpError(403, "bad_origin", "Blocked."); }
  const hostname = host.split(":")[0];
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = hostname === "localhost" || hostname === "127.0.0.1" || host === req.headers.host || host === req.headers["x-forwarded-host"] || allowed.includes(origin);
  if (!ok) throw new HttpError(403, "bad_origin", "Blocked.");
}

/* ------------------------------ email ------------------------------ */
async function sendEmail({ to, subject, text, html }) {
  const from = env.EMAIL_FROM;
  const fromName = env.EMAIL_FROM_NAME || "Kaiyeluthu";
  if (emailProvider === "brevo") {
    if (!env.BREVO_API_KEY || !from) throw new Error("BREVO_API_KEY and EMAIL_FROM are required");
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ sender: { name: fromName, email: from }, to: [{ email: to }], subject, htmlContent: html, textContent: text }),
    });
    if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
    return;
  }
  if (emailProvider === "resend") {
    if (!env.RESEND_API_KEY || !from) throw new Error("RESEND_API_KEY and EMAIL_FROM are required");
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: `${fromName} <${from}>`, to: [to], subject, html, text }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
    return;
  }
  if (PROD) throw new Error("No email provider configured. Set EMAIL_PROVIDER in .env");
  console.log(`\n[email to ${to}] ${subject}\n${text}\n`);
}

/* ------------------------------ OTP ------------------------------ */
const otps = new Map(); // email -> { hash, salt, expiresAt, attempts, sentAt }

async function requestOtp(email, ip) {
  rateLimit(`otp-ip:${ip}`, 20, 10 * 60 * 1000);
  rateLimit(`otp-mail:${email}`, 8, 60 * 60 * 1000);
  const student = db.students.find((s) => s.email.toLowerCase() === email);
  if (!student) return { ok: false, error: "not_found" };
  const prev = otps.get(email);
  if (prev && Date.now() - prev.sentAt < OTP_COOLDOWN_MS) {
    return { ok: false, error: "wait", retryAfter: Math.ceil((OTP_COOLDOWN_MS - (Date.now() - prev.sentAt)) / 1000) };
  }
  const code = String(crypto.randomInt(100000, 1000000));
  const salt = crypto.randomBytes(8).toString("hex");
  otps.set(email, { hash: sha(code + salt), salt, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0, sentAt: Date.now() });
  try {
    await sendEmail({
      to: email,
      subject: `${code} is your Kaiyeluthu login code`,
      text: `Your Kaiyeluthu login code is ${code}. It works for 10 minutes. If you did not ask for it, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #8FB3E0;border-radius:12px">
        <p style="color:#1F3A93;font-size:18px;font-weight:bold;margin:0 0 12px">Kaiyeluthu's Crash Course</p>
        <p style="margin:0 0 8px">Your login code is</p>
        <p style="font-size:34px;letter-spacing:8px;font-weight:bold;color:#1F3A93;margin:8px 0">${code}</p>
        <p style="color:#555;font-size:13px">It works for 10 minutes. If you did not ask for it, you can ignore this email.</p></div>`,
    });
  } catch (err) {
    otps.delete(email);
    console.error("OTP email failed:", err.message);
    return { ok: false, error: "send_failed" };
  }
  return { ok: true, ...(showOtpInResponse ? { devOtp: code } : {}) };
}

function checkOtp(email, code) {
  const rec = otps.get(email);
  if (!rec || Date.now() > rec.expiresAt) { otps.delete(email); return false; }
  rec.attempts += 1;
  if (rec.attempts > OTP_MAX_ATTEMPTS) { otps.delete(email); return false; }
  const a = Buffer.from(sha(String(code).trim() + rec.salt)); const b = Buffer.from(rec.hash);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  otps.delete(email);
  return true;
}

/* ------------------------------ sessions ------------------------------ */
function startSession(studentId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions = db.sessions.filter((s) => s.expiresAt > Date.now());
  db.sessions.push({ hash: sha(token), studentId, expiresAt: Date.now() + SESSION_TTL_MS });
  save();
  return token;
}
function currentStudent(req) {
  const token = parseCookies(req).kc_session; if (!token) return null;
  const h = sha(token);
  const s = db.sessions.find((x) => x.hash === h && x.expiresAt > Date.now());
  return s ? db.students.find((x) => x.id === s.studentId) ?? null : null;
}
function requireStudent(req) {
  const s = currentStudent(req);
  if (!s) throw new HttpError(401, "unauthorized", "Please log in.");
  return s;
}

/* ------------------------------ data helpers ------------------------------ */
function mergeRanges(ranges) {
  const sorted = ranges.map(([a, b]) => [a, b]).sort((x, y) => x[0] - y[0]);
  const out = [];
  for (const [a, b] of sorted) {
    const last = out[out.length - 1];
    if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b); else out.push([a, b]);
  }
  return out;
}
function cleanRanges(input) {
  if (!Array.isArray(input) || input.length > 3000) return [];
  const out = [];
  for (const r of input) {
    if (!Array.isArray(r) || r.length !== 2) continue;
    const a = Math.floor(Number(r[0])), b = Math.floor(Number(r[1]));
    if (Number.isFinite(a) && Number.isFinite(b) && a >= 0 && b >= a && b < 100000) out.push([a, b]);
  }
  return out;
}

function bundleFor(student) {
  return {
    student: { id: student.id, name: student.name, email: student.email, phone: student.phone, createdAt: student.createdAt },
    enrollment: db.enrollments.find((e) => e.studentId === student.id) ?? null,
    watch: db.watch.filter((w) => w.studentId === student.id),
    submissions: db.submissions.filter((s) => s.studentId === student.id),
    certificates: db.certificates.filter((c) => c.studentId === student.id),
  };
}

/* ------------------------------ payments ------------------------------ */
async function verifyPayment(paymentId, expectedRupees) {
  const id = String(paymentId || "");
  if (!id || id.length > 100) throw new HttpError(400, "bad_payment", "Missing payment id.");
  if (db.payments.some((p) => p.providerPaymentId === id)) throw new HttpError(409, "already_recorded", "This payment is already recorded. Please log in with your email.");

  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    if (id.startsWith("mock_")) throw new HttpError(400, "bad_payment", "Test payments are not accepted.");
    const auth = "Basic " + Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");
    let r = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: auth } });
    if (!r.ok) throw new HttpError(402, "payment_not_found", "We could not confirm this payment with Razorpay.");
    let p = await r.json();
    if (p.status === "authorized") {
      const cap = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(id)}/capture`, {
        method: "POST", headers: { Authorization: auth, "content-type": "application/json" },
        body: JSON.stringify({ amount: p.amount, currency: p.currency }),
      });
      if (cap.ok) p = await cap.json();
    }
    if (p.status !== "captured") throw new HttpError(402, "payment_not_captured", "This payment is not completed.");
    if (p.currency !== "INR" || p.amount !== expectedRupees * 100) throw new HttpError(402, "amount_mismatch", "Payment amount does not match the plan.");
    return;
  }
  // No Razorpay secret on the server: only allow the clearly marked test payments, and never in production.
  if (PROD || env.ALLOW_MOCK_PAYMENTS === "false" || !id.startsWith("mock_")) {
    throw new HttpError(402, "payments_not_configured", "Payments are not configured on the server yet.");
  }
}

/* ------------------------------ routes ------------------------------ */
async function route(req, res) {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  checkOrigin(req);

  if (req.method === "GET" && p === "/api/health") return sendJson(res, 200, { ok: true });

  if (req.method === "GET" && p === "/api/me") {
    const s = currentStudent(req);
    if (!s) return sendJson(res, 401, { ok: false, error: "unauthorized" });
    return sendJson(res, 200, { ok: true, bundle: bundleFor(s) });
  }

  if (req.method !== "POST") throw new HttpError(404, "not_found", "Not found.");
  const body = await readBody(req);

  if (p === "/api/auth/request-otp") {
    const email = normEmail(body.email);
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "bad_email", "Enter a valid email.");
    const r = await requestOtp(email, clientIp(req));
    return sendJson(res, 200, r);
  }

  if (p === "/api/auth/verify-otp") {
    const email = normEmail(body.email);
    rateLimit(`verify-ip:${clientIp(req)}`, 40, 10 * 60 * 1000);
    if (!checkOtp(email, body.otp)) return sendJson(res, 200, { ok: false, error: "bad_code" });
    const student = db.students.find((s) => s.email.toLowerCase() === email);
    if (!student) return sendJson(res, 200, { ok: false, error: "not_found" });
    const token = startSession(student.id);
    return sendJson(res, 200, { ok: true, bundle: bundleFor(student) }, { "Set-Cookie": sessionCookie(req, token, SESSION_TTL_MS / 1000) });
  }

  if (p === "/api/auth/logout") {
    const token = parseCookies(req).kc_session;
    if (token) { const h = sha(token); db.sessions = db.sessions.filter((s) => s.hash !== h); save(); }
    return sendJson(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(req, "", 0) });
  }

  if (p === "/api/purchase") {
    rateLimit(`purchase-ip:${clientIp(req)}`, 20, 10 * 60 * 1000);
    const name = String(body.name || "").trim();
    const email = normEmail(body.email);
    const phone = String(body.phone || "").trim();
    const plan = PLANS[body.planId];
    if (name.length < 2 || name.length > 100) throw new HttpError(400, "bad_name", "Enter your full name.");
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "bad_email", "Enter a valid email.");
    if (!isPhone(phone)) throw new HttpError(400, "bad_phone", "Enter a valid Indian mobile number.");
    if (!plan) throw new HttpError(400, "bad_plan", "Unknown plan.");
    await verifyPayment(body.paymentId, plan.price);

    let student = db.students.find((s) => s.email.toLowerCase() === email);
    const isNew = !student;
    if (!student) {
      student = { id: uid(), name, email, phone, createdAt: now() };
      db.students.push(student);
    }
    db.payments.push({ id: uid(), studentId: student.id, planId: body.planId, type: "purchase", amount: plan.price, status: "success", providerPaymentId: String(body.paymentId), createdAt: now() });
    const enr = db.enrollments.find((e) => e.studentId === student.id);
    if (!enr) db.enrollments.push({ id: uid(), studentId: student.id, courseId: "kaiyeluthu-crash-course", planId: body.planId, createdAt: now() });
    else if (body.planId === "pro") enr.planId = "pro";
    save();
    console.log(`[purchase] ${student.email} bought ${body.planId} (₹${plan.price})`);
    // Only brand new students are logged in straight after paying. An existing email must log in with an OTP,
    // so nobody can take over an account by paying with someone else's email.
    if (isNew) {
      const token = startSession(student.id);
      return sendJson(res, 200, { ok: true, loggedIn: true, bundle: bundleFor(student) }, { "Set-Cookie": sessionCookie(req, token, SESSION_TTL_MS / 1000) });
    }
    return sendJson(res, 200, { ok: true, loggedIn: false });
  }

  if (p === "/api/upgrade") {
    const student = requireStudent(req);
    const enr = db.enrollments.find((e) => e.studentId === student.id);
    if (!enr) throw new HttpError(400, "no_enrollment", "No enrollment found.");
    if (enr.planId === "pro") throw new HttpError(400, "already_pro", "You are already on Pro.");
    const amount = PLANS.pro.price - PLANS[enr.planId].price;
    await verifyPayment(body.paymentId, amount);
    enr.planId = "pro"; enr.upgradedAt = now();
    db.payments.push({ id: uid(), studentId: student.id, planId: "pro", type: "upgrade", amount, status: "success", providerPaymentId: String(body.paymentId), createdAt: now() });
    save();
    console.log(`[upgrade] ${student.email} -> pro (₹${amount})`);
    return sendJson(res, 200, { ok: true, bundle: bundleFor(student) });
  }

  if (p === "/api/sync") {
    const student = requireStudent(req);

    for (const w of Array.isArray(body.watch) ? body.watch.slice(0, 100) : []) {
      const sessionId = Math.floor(Number(w.sessionId));
      if (!(sessionId >= 1 && sessionId <= SESSION_COUNT)) continue;
      const incoming = cleanRanges(w.ranges);
      const duration = Math.max(0, Math.min(100000, Number(w.duration) || 0));
      let rec = db.watch.find((x) => x.studentId === student.id && x.sessionId === sessionId);
      if (!rec) { rec = { studentId: student.id, sessionId, ranges: [], duration, updatedAt: now() }; db.watch.push(rec); }
      rec.ranges = mergeRanges([...rec.ranges, ...incoming]);
      if (duration) rec.duration = duration;
      rec.updatedAt = now();
    }

    for (const s of Array.isArray(body.submissions) ? body.submissions.slice(0, 50) : []) {
      const assignmentId = String(s.assignmentId || "");
      if (!/^[A-Za-z0-9_-]{1,20}$/.test(assignmentId)) continue;
      const existing = db.submissions.find((x) => x.studentId === student.id && x.assignmentId === assignmentId);
      if (existing && existing.id === s.id) continue; // the server copy (status, feedback) is the master copy
      const next = {
        id: String(s.id || uid()).slice(0, 40), studentId: student.id, assignmentId,
        text: typeof s.text === "string" ? s.text.slice(0, 20000) : undefined,
        fileName: typeof s.fileName === "string" ? s.fileName.slice(0, 200) : undefined,
        status: "Submitted", createdAt: now(),
      };
      db.submissions = db.submissions.filter((x) => !(x.studentId === student.id && x.assignmentId === assignmentId));
      db.submissions.push(next);
      console.log(`[submission] ${student.email} submitted ${assignmentId}`);
    }

    for (const c of Array.isArray(body.certificates) ? body.certificates.slice(0, 5) : []) {
      if (db.certificates.some((x) => x.studentId === student.id)) break;
      const enr = db.enrollments.find((e) => e.studentId === student.id);
      db.certificates.push({ id: String(c.id || uid()).slice(0, 40), studentId: student.id, planId: enr?.planId ?? "basic", issuedAt: now() });
    }

    if (body.profile && typeof body.profile === "object") {
      const n = String(body.profile.name || "").trim(); const ph = String(body.profile.phone || "").trim();
      if (n.length >= 2 && n.length <= 100) student.name = n;
      if (isPhone(ph)) student.phone = ph;
    }
    save();
    return sendJson(res, 200, { ok: true });
  }

  throw new HttpError(404, "not_found", "Not found.");
}

const server = http.createServer(async (req, res) => {
  try { await route(req, res); }
  catch (err) {
    if (err instanceof HttpError) return sendJson(res, err.status, { ok: false, error: err.code, message: err.message });
    console.error(err);
    sendJson(res, 500, { ok: false, error: "server_error", message: "Something went wrong. Please try again." });
  }
});

server.listen(PORT, () => {
  console.log(`Kaiyeluthu API running on http://localhost:${PORT}`);
  console.log(`  email: ${emailProvider}${emailProvider === "console" ? " (codes print in this window)" : ""}`);
  console.log(`  payments: ${env.RAZORPAY_KEY_SECRET ? "real Razorpay verification" : "test mode (mock payments only)"}`);
});
