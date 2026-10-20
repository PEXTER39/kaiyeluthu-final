// Build helper that wires TanStack Start, React, Tailwind and the "@" import alias.
// Do not add those plugins by hand or the app will break with duplicates.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The website talks to the small API server in /server (student login, OTP, payments, progress).
// In development, requests to /api are forwarded to it.
const apiPort = process.env["API_PORT"] ?? "8787";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        "/api": { target: `http://localhost:${apiPort}`, changeOrigin: false },
      },
    },
  },
});
