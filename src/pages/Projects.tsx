import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProjectCard } from "@/components/project/ProjectCard";

export default function Projects() {
  const projects = useQuery(api.projects.list);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Projects"
        description="All 19 public repositories by Darsh Gaur with live GitHub statistics."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          {`~/projects`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Public repositories
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Every entry maps to a real repository on GitHub. Star, fork, language
          and last-push figures are fetched live from the GitHub API and shown
          from a cache when the API is unreachable. Entries are edited through
          the headless CMS, so this index stays current without redeploys.
        </p>

        <div className="mt-10">
          {projects === undefined ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-[3px] border border-border/70 bg-card"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="rounded-[3px] border border-dashed border-border px-4 py-10 text-center font-mono text-sm text-muted-foreground">
              No repositories published yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
