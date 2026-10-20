# Kaiyeluthu's Crash Course website

React + TanStack Start site with a small API server (`/server`) for student login, payments and progress.

## Run it on your computer (VS Code)

1. Install Node.js 20.12 or newer (https://nodejs.org). Check with `node -v`.
2. Open this folder in VS Code, then in the terminal:
   ```
   npm install
   npm run dev
   ```
3. Open the address shown in the terminal (the line that says `Local: http://localhost:....`).
   `npm run dev` starts the website and the API server together. Stop with Ctrl+C.

Test the whole flow: pick a plan, pay with the test checkout ("Simulate success"), then log out and log in again.
The login code is printed in the terminal and shown on the login page while email is not set up.

## Things you must add

| What | Where |
| --- | --- |
| Your photos (replace the grey placeholders, keep the file names) | `public/images/aishwarya.jpg`, `writing.jpg`, `story2.jpg` |
| Session recordings, named `session-1.mp4` ... `session-10.mp4` | `public/videos/` (or paste links in `src/data/course.ts`) |
| Session PDFs | `src/data/course.ts` (the `pdf` helper) |
| WhatsApp group link, Google Meet link, contact email | `src/config/site.ts` |

## Real login codes by email

Copy `.env.example` to `.env`, set `EMAIL_PROVIDER=brevo`, add `BREVO_API_KEY` and `EMAIL_FROM` (a sender email verified in Brevo), then restart `npm run dev`.
Students then receive the 6 digit code by email, and the code no longer appears on the login page.

## Real payments

1. In `src/config/site.ts` set `razorpayKeyId` and `mockPayments: false`.
2. In `.env` set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. The server then checks every payment with Razorpay (amount and status) before creating the student.

## Reviews, blog, FAQ

Edit `src/data/content.ts`. Review videos and screenshots are in `public/reviews/`. The full blog story is already in `posts`.

## Where student data lives

`server/data/db.json` (created on first purchase, never commit it). Back it up regularly.

## Demo mode (Vercel preview for the client)

While `mockPayments` is `true` in `src/config/site.ts` and no API server is running (for example the site is deployed only on Vercel), the site runs fully inside the browser: the test payment works, the student is created and logged in, and logging out then in again with the same email works with the code `123456`.
The data is stored only in that browser, so use the same browser for the whole demo. Nothing is shared between devices, and no real money or email is involved.
Real payments (`mockPayments: false`) never use this fallback and always need the API server.

## Before going live

The API server must run next to the website on the same domain (set `NODE_ENV=production`, use `npm run start:api`, and route `/api` to it). Ask for help with hosting when you are ready.
