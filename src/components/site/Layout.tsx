import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Logo } from "./Brand";

const nav = [
  { label: "About", href: "/#about" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Plans", href: "/#plans" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo className="h-10 sm:h-11" />
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {nav.map((n) => <a key={n.label} href={n.href} className="hover:text-redpen">{n.label}</a>)}
          <Link to="/blog" className="hover:text-redpen">Blog</Link>
          <Link to="/login" className="text-muted-foreground hover:text-ink">Student login</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="cta" className="hidden sm:inline-flex"><a href="/#plans">Enroll Now</a></Button>
          <button className="md:hidden p-2" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden">
          {nav.map((n) => <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-2 font-medium">{n.label}</a>)}
          <Link to="/blog" className="py-2 font-medium" onClick={() => setOpen(false)}>Blog</Link>
          <Link to="/login" className="py-2 font-medium" onClick={() => setOpen(false)}>Student login</Link>
        </nav>
      )}
    </header>
  );
}

export function MobileEnrollBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <Button asChild variant="cta" size="xl" className="w-full"><a href="/#plans">Enroll Now · from ₹999</a></Button>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink pb-24 pt-12 text-primary-foreground md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        <div>
          <p className="font-tamil text-2xl font-semibold">கையெழுத்து</p>
          <p className="mt-1 text-sm opacity-80">Kaiyeluthu's Crash Course · a content writing course by {siteConfig.instructor}, taught in Tamil.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/#plans" className="hover:text-manjal">Plans</a>
          <Link to="/blog" className="hover:text-manjal">Blog</Link>
          <Link to="/login" className="hover:text-manjal">Student login</Link>
          <Link to="/terms" className="hover:text-manjal">Terms</Link>
          <Link to="/privacy" className="hover:text-manjal">Privacy</Link>
          <Link to="/refund-policy" className="hover:text-manjal">Refund policy (no refunds)</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-manjal"><Instagram className="size-4" /> Instagram</a>
          <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 hover:text-manjal"><Mail className="size-4" /> {siteConfig.contactEmail}</a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-xs opacity-60">© {new Date().getFullYear()} Kaiyeluthu's Crash Course. All sales final.</p>
    </footer>
  );
}

export function PageShell({ children, enrollBar = false }: { children: ReactNode; enrollBar?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      {enrollBar && <MobileEnrollBar />}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-redpen">{eyebrow}</p>
      <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}
