import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDot,
  Clock,
  ExternalLink,
  Github,
  GitFork,
  Star,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarkdownBody } from "@/components/Markdown";
import { useRepoStats } from "@/hooks/use-repo-stats";
import { formatCompact, formatMonthYear } from "@/lib/format";
import { GITHUB_URL } from "@/lib/site";

function StatCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = useQuery(api.projects.get, { slug });
  const { stats, stale } = useRepoStats(
    project?.repoOwner ?? "",
    project?.repoName ?? "",
  );

  if (project === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="h-40 animate-pulse rounded-[3px] border border-border/70 bg-card" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6">
          <Seo title="Project not found" />
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            It may be unpublished or the link is wrong.
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-[2px] border border-border px-4 py-2 font-mono text-sm hover:border-foreground/60"
          >
            <ArrowLeft className="size-4" /> All projects
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const repoUrl = `${GITHUB_URL}/${project.repoName}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={project.title}
        description={project.summary}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {`../projects`}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <article>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[2px] border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-accent">
                project {String(project.order).padStart(2, "0")}
              </span>
              {project.featured && (
                <span className="rounded-[2px] border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  featured
                </span>
              )}
              {project.scaffold && (
                <span className="rounded-[2px] border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  no code committed yet
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                github.com/{project.repoOwner}/{project.repoName}
              </a>
            </p>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {project.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[2px] border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10">
              {project.architecture.trim() ? (
                <MarkdownBody>{project.architecture}</MarkdownBody>
              ) : (
                <p className="rounded-[3px] border border-dashed border-border px-4 py-8 font-mono text-sm text-muted-foreground">
                  No architecture writeup is published for this project yet.
                </p>
              )}
            </div>
          </article>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-[3px] border border-border bg-card">
              <div className="border-b border-border/70 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  live repo data
                </p>
              </div>
              <div className="px-4 pb-1">
                <StatCell
                  icon={<Star className="size-3.5" />}
                  label="Stars"
                  value={stats ? formatCompact(stats.stars) : "…"}
                />
                <StatCell
                  icon={<GitFork className="size-3.5" />}
                  label="Forks"
                  value={stats ? formatCompact(stats.forks) : "…"}
                />
                <StatCell
                  icon={<CircleDot className="size-3.5" />}
                  label="Open issues"
                  value={stats ? String(stats.openIssues) : "…"}
                />
                <StatCell
                  icon={<Github className="size-3.5" />}
                  label="Language"
                  value={stats?.language ?? "…"}
                />
                <StatCell
                  icon={<Clock className="size-3.5" />}
                  label="Last push"
                  value={stats ? formatMonthYear(stats.pushedAt) : "…"}
                />
              </div>
              {stale && (
                <p className="px-4 pb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  cached: GitHub API unavailable
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-foreground px-4 py-2.5 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                <Github className="size-4" /> View source
              </a>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-border px-4 py-2.5 font-mono text-sm transition-colors hover:border-foreground/60"
                >
                  <ExternalLink className="size-4" /> Live demo
                </a>
              )}
            </div>

            <p className="mt-3 flex items-center gap-1.5 px-1 font-mono text-[10px] text-muted-foreground/60">
              <ArrowUpRight className="size-3" />
              numbers load from api.github.com on page view
            </p>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
