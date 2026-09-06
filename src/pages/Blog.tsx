import { useQuery } from "convex/react";
import { Link } from "react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { formatFullDate } from "@/lib/format";

export default function Blog() {
  const posts = useQuery(api.blog.list);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Blog"
        description="Engineering notes and writing by Darsh Gaur."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          {`~/blog`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Notes and posts
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Build notes, post-mortems and longer writing about the repositories
          on this site.
        </p>

        <div className="mt-10">
          {posts === undefined ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-[3px] border border-border/70 bg-card"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-[3px] border border-dashed border-border px-6 py-14 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground/60" />
              <p className="mt-4 text-sm font-medium text-foreground/80">
                No posts published yet
              </p>
              <p className="mx-auto mt-1 max-w-sm font-mono text-xs leading-5 text-muted-foreground">
                Build notes from the repositories above will land here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <article
                  key={p._id}
                  className="group rounded-[3px] border border-border/70 bg-card p-5 transition-colors hover:border-accent/60"
                >
                  <Link to={`/blog/${p.slug}`} className="block">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {formatFullDate(p.date)}
                    </p>
                    <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold tracking-tight group-hover:text-accent">
                      {p.title}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {p.summary}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
