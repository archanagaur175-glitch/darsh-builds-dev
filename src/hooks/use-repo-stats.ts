import { useEffect, useState } from "react";
import { fetchRepoStats, type RepoStats } from "@/lib/github";

export function useRepoStats(owner: string, name: string) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [stale, setStale] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !name) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchRepoStats(owner, name).then((result) => {
      if (cancelled) return;
      if (result.status === "offline") {
        setStats(null);
      } else {
        setStats(result.stats);
        setStale(result.status === "cached");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [owner, name]);

  return { stats, stale, loading };
}
