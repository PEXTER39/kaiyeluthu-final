import { useState } from "react";
import { Instagram, Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SectionHead } from "@/components/site/Layout";
import { chatReviews, reviewQuotes, videoReviews, type ChatReview } from "@/data/content";
import { siteConfig } from "@/config/site";

/** Reviews section: pull quotes, short video reviews, then a wall of student chat screenshots. */
export function Reviews() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [open, setOpen] = useState<ChatReview | null>(null);

  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <SectionHead eyebrow="Reviews" title="What students say" sub="Real messages and recordings from students in the course." />

      {/* Pull quotes */}
      <div className="grid gap-4 md:grid-cols-3">
        {reviewQuotes.map((q) => (
          <figure key={q.text} className="ruled rounded-2xl p-6 pl-14 shadow-card">
            <Quote className="size-6 text-redpen" aria-hidden />
            <blockquote className="mt-2 text-lg font-medium leading-8">{q.text}</blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-redpen">Student feedback on WhatsApp</figcaption>
          </figure>
        ))}
      </div>

      {/* Video reviews */}
      <h3 className="mt-16 text-2xl font-bold">Hear it from them</h3>
      <div className="mt-6 grid justify-center gap-6 sm:grid-cols-3">
        {videoReviews.map((v, i) => (
          <div key={v.src} className="mx-auto w-full max-w-[19rem]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border-4 border-ink bg-ink shadow-card">
              {playing === i ? (
                <video
                  src={v.src}
                  poster={v.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  className="size-full object-cover"
                  onEnded={() => setPlaying(null)}
                />
              ) : (
                <button type="button" onClick={() => setPlaying(i)} className="group absolute inset-0 size-full" aria-label={`Play video review: ${v.title}`}>
                  <img src={v.poster} alt="" className="size-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
                  <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-manjal text-ink shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-1 size-7 fill-current" />
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">{v.length}</span>
                </button>
              )}
            </div>
            <p className="mt-3 text-center text-sm font-semibold">{v.title}</p>
          </div>
        ))}
      </div>

      {/* Chat screenshots */}
      <h3 className="mt-16 text-2xl font-bold">Messages from students</h3>
      <p className="mt-1 text-sm text-muted-foreground">Tap a message to read it full size.</p>
      <div className="mt-6 columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
        {chatReviews.map((c) => (
          <button key={c.src} type="button" onClick={() => setOpen(c)} className="block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-0.5">
            <img src={c.src} alt={c.alt} width={c.width} height={c.height} loading="lazy" className="h-auto w-full" />
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild variant="inkOutline" size="lg">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram /> See more reviews on Instagram</a>
        </Button>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto p-2">
          <DialogTitle className="sr-only">Student message</DialogTitle>
          <DialogDescription className="sr-only">{open?.alt}</DialogDescription>
          {open && <img src={open.src} alt={open.alt} className="h-auto w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
