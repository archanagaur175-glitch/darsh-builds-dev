export type RepoStats = {
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string | null;
};

type CacheEntry = { at: number; stats: RepoStats };
type Result =
  | { status: "live" | "cached"; cachedAt: number | null; stats: RepoStats }
  | { status: "offline"; cachedAt: null; stats: null };

const TTL_MS = 60 * 60 * 1000; // refresh live numbers at most once an hour
const key = (owner: string, name: string) =>
  `darshbuilds:stats:${owner}/${name}`;

const inflight = new Map<string, Promise<Result>>();

function readCache(k: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (typeof parsed.at !== "number" || !parsed.stats) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(k: string, entry: CacheEntry) {
  try {
    localStorage.setItem(k, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable (private mode); stats still render for the
    // session through the in-memory fallback below.
  }
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * Live repo stats from the GitHub REST API with a 1 hour cache. When the API
 * is unreachable or rate limited, the last known good numbers are returned
 * with status "cached" so pages degrade gracefully instead of failing.
 */
export function fetchRepoStats(
  owner: string,
  name: string,
): Promise<Result> {
  const k = key(owner, name);
  const pending = inflight.get(k);
  if (pending) return pending;

  const run = async (): Promise<Result> => {
    const fresh = readCache(k) ?? memoryCache.get(k) ?? null;
    const nowMs = Date.now();
    if (fresh && nowMs - fresh.at < TTL_MS) {
      return { status: "live", cachedAt: fresh.at, stats: fresh.stats };
    }
    try {
      const res = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
        { headers: { Accept: "application/vnd.github+json" } },
      );
      if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
      const data = (await res.json()) as {
        stargazers_count?: number;
        forks_count?: number;
        open_issues_count?: number;
        language?: string | null;
        pushed_at?: string | null;
      };
      const stats: RepoStats = {
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        openIssues: data.open_issues_count ?? 0,
        language: data.language ?? null,
        pushedAt: data.pushed_at ?? null,
      };
      const entry: CacheEntry = { at: Date.now(), stats };
      writeCache(k, entry);
      memoryCache.set(k, entry);
      return { status: "live", cachedAt: null, stats };
    } catch {
      if (fresh) {
        return { status: "cached", cachedAt: fresh.at, stats: fresh.stats };
      }
      return { status: "offline", cachedAt: null, stats: null };
    }
  };

  const promise = run().finally(() => inflight.delete(k));
  inflight.set(k, promise);
  return promise;
}
