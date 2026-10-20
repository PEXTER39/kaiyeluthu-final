import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionHead } from "@/components/site/Layout";
import { posts } from "@/data/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Kaiyeluthu's Crash Course" },
      { name: "description", content: "Stories and lessons on content writing from Aishwarya Lakshmi." },
      { property: "og:title", content: "Kaiyeluthu Blog" },
      { property: "og:description", content: "Stories and lessons on content writing from Aishwarya Lakshmi." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <SectionHead eyebrow="Blog" title="Stories & lessons" />
        <div className="grid gap-5">
          {posts.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="ruled block rounded-2xl p-6 pl-14 shadow-card transition-transform hover:-translate-y-0.5">
              <p className="text-sm text-redpen">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              <h2 className="mt-1 text-2xl font-bold">{p.title}</h2>
              <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
