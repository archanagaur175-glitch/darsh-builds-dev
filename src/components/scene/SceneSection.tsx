import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import type { SceneProject } from "./WorkspaceScene";

const WorkspaceScene = lazy(() => import("./WorkspaceScene"));

const PREF_KEY = "darshbuilds:view";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function SceneSection({
  projects,
  label,
}: {
  projects: SceneProject[];
  label: string;
}) {
  const [mode, setMode] = useState<"3d" | "2d" | null>(null);
  const [capable, setCapable] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    const supports = webglAvailable();
    const stored = localStorage.getItem(PREF_KEY);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setAnimate(!reduced);
    setCapable(supports);
    setMode(
      !supports || reduced || stored === "2d" || crashed ? "2d" : "3d",
    );
  }, [crashed]);

  const choose = (next: "3d" | "2d") => {
    try {
      localStorage.setItem(PREF_KEY, next);
    } catch {
      // Preference persistence is optional.
    }
    setMode(next);
  };

  const show3d = mode === "3d" && projects.length > 0 && !crashed;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {capable && !crashed && (
          <div className="flex items-center gap-1 font-mono text-xs">
            {mode !== "2d" ? (
              <button
                type="button"
                onClick={() => choose("2d")}
                className="rounded-[2px] border border-border px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                Static layout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => choose("3d")}
                className="rounded-[2px] border border-accent/50 px-2 py-1 text-accent transition-colors hover:border-accent"
              >
                Spatial view
              </button>
            )}
          </div>
        )}
      </div>

      {show3d && (
        <SceneErrorBoundary onError={() => setCrashed(true)}>
          <Suspense
            fallback={
              <div className="flex h-[440px] items-center justify-center rounded-[3px] border border-border bg-blueprint">
                <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> mounting
                  workspace
                </span>
              </div>
            }
          >
            <WorkspaceScene projects={projects} animate={animate} />
          </Suspense>
        </SceneErrorBoundary>
      )}

      {crashed && (
        <p className="rounded-[3px] border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
          Spatial view is unavailable on this device. Showing the full project
          list below instead.
        </p>
      )}
    </div>
  );
}
