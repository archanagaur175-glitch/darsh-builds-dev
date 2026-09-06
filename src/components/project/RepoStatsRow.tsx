import { CircleDot, Clock, GitFork, Star } from "lucide-react";
import { useRepoStats } from "@/hooks/use-repo-stats";
import { formatCompact, formatMonthYear } from "@/lib/format";
import { cn } from "@/lib/utils";

const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Rust: "#dea584",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export function RepoStatsRow({
  owner,
  name,
  className,
}: {
  owner: string;
  name: string;
  className?: string;
}) {
  const { stats, stale, loading } = useRepoStats(owner, name);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1 animate-pulse rounded-full bg-muted-foreground" />
          <span className="size-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]" />
          <span className="size-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]" />
          fetching
        </span>
      ) : stats ? (
        <>
          {stats.language && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2 rounded-[2px]"
                style={{
                  background: langColor[stats.language] ?? "#8b95a5",
                }}
              />
              {stats.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5" title="Stars">
            <Star className="size-3" />
            {formatCompact(stats.stars)}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Forks">
            <GitFork className="size-3" />
            {formatCompact(stats.forks)}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Open issues">
            <CircleDot className="size-3" />
            {stats.openIssues}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Last push">
            <Clock className="size-3" />
            {formatMonthYear(stats.pushedAt)}
          </span>
          {stale && (
            <span
              className="uppercase text-muted-foreground/60"
              title="GitHub API unreachable; showing last known values"
            >
              cached
            </span>
          )}
        </>
      ) : (
        <span className="text-muted-foreground/70">
          stats unavailable right now
        </span>
      )}
    </div>
  );
}
