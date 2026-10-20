import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} · Kaiyeluthu Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Post not found · Kaiyeluthu" }, { name: "robots", content: "noindex" }],
  }),
  component: Post,
});

function Post() {
  const { post } = Route.useLoaderData();
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16">
        <Link to="/blog" className="text-sm text-muted-foreground">← All posts</Link>
        <h1 className="mt-4 text-4xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-redpen">by Aishwarya Lakshmi</p>
        <img src="/images/story2.jpg" alt="Aishwarya" className="mt-8 aspect-[4/3] w-full rounded-2xl object-cover" width={900} height={675} />
        <div className="mt-8 space-y-5 text-lg leading-relaxed">{post.body.map((p, i) => p.startsWith("## ") ? <h2 key={i} className="pt-4 text-2xl font-bold">{p.slice(3)}</h2> : <p key={i}>{p}</p>)}</div>
        <div className="mt-12 rounded-2xl bg-ink p-8 text-center text-primary-foreground">
          <p className="text-xl">Content writing <span className="font-tamil">கத்துக்கலாம் வாங்க!</span></p>
          <Button asChild variant="cta" size="lg" className="mt-4"><a href="/#plans">Join now</a></Button>
        </div>
      </article>
    </PageShell>
  );
}
