import { Link } from "react-router";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { RepoStatsRow } from "./RepoStatsRow";
import { GITHUB_URL } from "@/lib/site";

const PLANNED_LABEL = "planned / not started";
const UNDOCUMENTED_LABEL = "no readme yet";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  repoOwner: string;
  repoName: string;
  demoUrl?: string;
  featured: boolean;
  scaffold: boolean;
  documented: boolean;
  order: number;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const repoUrl = `${GITHUB_URL}/${project.repoName}`;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[3px] border bg-card p-5 transition-colors",
        project.featured && !project.scaffold ? "border-border" : "border-border/70",
        project.scaffold ? "border-dashed" : "",
        "hover:border-accent/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="font-mono text-xs text-muted-foreground/50">
            {String(project.order).padStart(2, "0")}
          </span>
          <Link
            to={`/projects/${project.slug}`}
            className="truncate font-mono text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent"
          >
            {project.title}
          </Link>
        </div>
        <span className="flex shrink-0 gap-1">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.repoName} on GitHub`}
            className="rounded-[3px] border border-transparent p-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <Github className="size-3.5" />
          </a>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} demo`}
              className="rounded-[3px] border border-transparent p-1 text-muted-foreground transition-colors hover:border-border hover:text-accent"
            >
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </span>
      </div>

      <p
        className={cn(
          "mt-3 line-clamp-3 text-sm leading-6",
          project.scaffold
            ? "font-mono text-xs text-muted-foreground/80"
            : "text-muted-foreground",
        )}
      >
        {project.summary}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {project.stack.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-[2px] border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {project.scaffold ? (
          <span className="rounded-[2px] border border-dashed border-border px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground/70">
            {PLANNED_LABEL}
          </span>
        ) : !project.documented ? (
          <span
            className="rounded-[2px] border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground/70"
            title="This repository has no README; the entry sticks to repository facts"
          >
            {UNDOCUMENTED_LABEL}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex-1" />

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <RepoStatsRow owner={project.repoOwner} name={project.repoName} />
        <Link
          to={`/projects/${project.slug}`}
          className="shrink-0 rounded-[2px] border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          detail <ArrowUpRight className="ml-0.5 inline size-3" />
        </Link>
      </div>
    </article>
  );
}
