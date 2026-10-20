import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/site/Brand";
import { useStudent } from "@/components/portal/useStudent";
import { logout } from "@/lib/api";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Student portal · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Your sessions, assignments and certificate." },
      { property: "og:title", content: "Student portal · Kaiyeluthu" },
      { property: "og:description", content: "Your Kaiyeluthu learning space." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalLayout,
});

const tabs = [
  { to: "/portal", label: "Dashboard" },
  { to: "/portal/assignments", label: "Assignments" },
  { to: "/portal/certificate", label: "Certificate" },
  { to: "/portal/profile", label: "Profile" },
] as const;

function PortalLayout() {
  const { ready, student } = useStudent();
  const navigate = useNavigate();
  useEffect(() => { if (ready && !student) navigate({ to: "/login" }); }, [ready, student, navigate]);
  if (!ready || !student) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo className="h-9" />
          <button className="flex items-center gap-1 text-sm text-muted-foreground" onClick={() => { void logout().finally(() => navigate({ to: "/" })); }}><LogOut className="size-4" /> Log out</button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }} className="whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium" activeProps={{ className: "border-manjal text-ink" }}>{t.label}</Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8"><Outlet /></main>
    </div>
  );
}
