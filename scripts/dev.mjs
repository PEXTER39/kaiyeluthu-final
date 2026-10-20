// Starts the API server and the website together with one command:  npm run dev
import { spawn } from "node:child_process";

const children = [];
function run(label, command) {
  const child = spawn(command, { stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    console.log(`[${label}] stopped (code ${code ?? "?"})`);
    shutdown(code ?? 0);
  });
  children.push(child);
}
let closing = false;
function shutdown(code) {
  if (closing) return;
  closing = true;
  for (const c of children) { try { c.kill(); } catch { /* already stopped */ } }
  setTimeout(() => process.exit(code), 300);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("api", `"${process.execPath}" server/index.mjs`);
run("web", "npx vite dev");
