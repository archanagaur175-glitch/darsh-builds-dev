import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Link } from "react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github } from "lucide-react";
import { GITHUB_URL } from "@/lib/site";

export type SceneProject = {
  slug: string;
  title: string;
  summary: string;
  repoOwner: string;
  repoName: string;
  order: number;
};

const NODE_EMBER = "#ff7a45";
const NODE_HOT = "#ffffff";

function layout(count: number): THREE.Vector3[] {
  const radius = Math.max(4.6, Math.min(7.6, Math.sqrt(count) * 2.4));
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const wobble = Math.sin(i * 2.7) * 1.05;
    out.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        wobble,
        Math.sin(angle) * radius,
      ),
    );
  }
  return out;
}

function Nodes({
  count,
  positions,
  selected,
  onSelect,
}: {
  count: number;
  positions: THREE.Vector3[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    positions.forEach((_, i) => {
      mesh.setColorAt(i, new THREE.Color(NODE_EMBER));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [positions, count, dummy]);

  const paint = (hotIndex: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((_, i) => {
      mesh.setColorAt(i, new THREE.Color(i === hotIndex ? NODE_HOT : NODE_EMBER));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined!, undefined!, Math.max(count, 1)]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId != null) onSelect(e.instanceId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (e.instanceId != null) paint(e.instanceId);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        paint(selected);
        document.body.style.cursor = "auto";
      }}
    >
      <octahedronGeometry args={[0.34, 0]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </instancedMesh>
  );
}

function Edges({ positions }: { positions: THREE.Vector3[] }) {
  const geometry = useMemo(() => {
    const verts: number[] = [];
    const origin = new THREE.Vector3(0, 0, 0);
    positions.forEach((p) => {
      verts.push(origin.x, origin.y, origin.z, p.x, p.y, p.z);
    });
    positions.forEach((p, i) => {
      const next = positions[(i + 1) % positions.length];
      verts.push(p.x, p.y, p.z, next.x, next.y, next.z);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    return g;
  }, [positions]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#2d3745" transparent opacity={0.65} />
    </lineSegments>
  );
}

function Center() {
  return (
    <mesh>
      <sphereGeometry args={[0.14, 24, 24]} />
      <meshBasicMaterial color="#e9edf1" toneMapped={false} />
    </mesh>
  );
}

export default function WorkspaceScene({
  projects,
  animate,
}: {
  projects: SceneProject[];
  animate: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const positions = useMemo(() => layout(projects.length), [projects.length]);
  const current =
    projects.length > 0 ? projects[Math.min(selected, projects.length - 1)] : null;

  const cycle = (delta: number) => {
    if (projects.length === 0) return;
    setSelected((s) => (s + delta + projects.length) % projects.length);
  };

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-[3px] border border-border bg-blueprint">
      {/* frameloop intentionally stays at the default "always" while this scene
          is mounted so the slow idle rotation renders continuously; a demand
          loop would freeze it between interaction frames. The scene is tiny
          (one instanced mesh, one line buffer) so the cost is negligible. */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 5.2, 14.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Edges positions={positions} />
        <Center />
        <Nodes
          count={projects.length}
          positions={positions}
          selected={selected}
          onSelect={setSelected}
        />
        <OrbitControls
          makeDefault
          enableDamping
          enableZoom={false}
          enablePan={false}
          autoRotate={animate}
          autoRotateSpeed={0.7}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      <p className="pointer-events-none absolute left-3 top-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
        drag to orbit · click a node to inspect
      </p>

      {/* Inspector panel for the selected node */}
      {current && (
        <div className="absolute bottom-3 left-3 w-[min(340px,calc(100%-1.5rem))] border border-border/80 bg-[#0d1117]/95 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                {String(current.order).padStart(2, "0")} / node selected
              </p>
              <h3 className="mt-1 truncate font-mono text-sm font-semibold">
                {current.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => cycle(1)}
              className="rounded-[2px] border border-border p-1 text-muted-foreground hover:text-foreground"
              aria-label="Next project"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {current.summary}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              to={`/projects/${current.slug}`}
              className="inline-flex items-center gap-1 rounded-[2px] bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Open project <ArrowUpRight className="size-3" />
            </Link>
            <a
              href={`${GITHUB_URL}/${current.repoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-[2px] border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-3" /> repo
            </a>
          </div>
        </div>
      )}

      {projects.length > 1 && (
        <button
          type="button"
          onClick={() => cycle(-1)}
          className="absolute right-3 top-2.5 rounded-[2px] border border-border bg-background/70 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Previous project"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}
    </div>
  );
}
