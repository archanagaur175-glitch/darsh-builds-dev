import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarkdownBody } from "@/components/Markdown";
import { formatFullDate } from "@/lib/format";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = useQuery(api.blog.get, { slug });

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <div className="h-64 animate-pulse rounded-[3px] border border-border/70 bg-card" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Seo title="Post not found" />
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-semibold">Post not found</h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            It may be unpublished or the link is wrong.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-[2px] border border-border px-4 py-2 font-mono text-sm hover:border-foreground/60"
          >
            <ArrowLeft className="size-4" /> All posts
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={post.title} description={post.summary} />
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {`../blog`}
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {formatFullDate(post.date)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
          {post.summary}
        </p>
        <div className="mt-10 border-t border-border/70 pt-8">
          <MarkdownBody>{post.body}</MarkdownBody>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
