import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Github,
  Mail,
  Terminal,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProjectCard } from "@/components/project/ProjectCard";
import { SceneSection } from "@/components/scene/SceneSection";
import type { SceneProject } from "@/components/scene/WorkspaceScene";
import { ADMIN_EMAIL, GITHUB_URL, LOCATION, SITE_DESCRIPTION } from "@/lib/site";

function ProjectSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-[3px] border border-border/70 bg-card"
        />
      ))}
    </div>
  );
}

let autoSeeded = false;

export default function Landing() {
  const projects = useQuery(api.projects.list);
  const academic = useQuery(api.academic.list);
  const seedContent = useMutation(api.admin.seedContent);

  // First-run bootstrap: when the database is empty, publish the real
  // starter content set once. All later writes require the admin role.
  useEffect(() => {
    if (autoSeeded) return;
    if (projects === undefined || academic === undefined) return;
    if (projects.length > 0 || academic.length > 0) return;
    autoSeeded = true;
    seedContent().catch(() => {
      autoSeeded = false;
    });
  }, [projects, academic, seedContent]);
  const loadedProjects = projects ?? [];
  // The 3D map is deliberately capped to featured projects so the scene stays
  // readable and fast; the full list is always available in the 2D grid below.
  const sceneProjects: SceneProject[] = loadedProjects
    .filter((p) => p.featured && !p.scaffold)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      repoOwner: p.repoOwner,
      repoName: p.repoName,
      order: p.order,
    }));
  const coursework = (academic ?? []).filter((e) => e.kind === "coursework");
  const research = (academic ?? []).filter((e) => e.kind === "research");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Darsh Builds"
        description={SITE_DESCRIPTION}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="bg-radial-ember border-b border-border/70">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="font-mono text-[13px] text-muted-foreground">
              <span className="text-accent">darsh@gaur</span>:~$
              <span className="text-foreground"> whoami</span>
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Darsh Gaur builds free open-source tools for developers.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">
              Grade 11 software engineer in Bengaluru, India, preparing for
              undergraduate studies in engineering. Creator of ClarityCrew, an
              adaptive study companion for neurodivergent learners, and
              maintainer of{" "}
              <span className="text-foreground">
                {projects === undefined ? "19" : loadedProjects.length} public
                repositories
              </span>{" "}
              with live GitHub statistics below.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-[2px] bg-foreground px-4 py-2.5 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                Browse repositories <ArrowDown className="size-4" />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[2px] border border-border px-4 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground/60"
              >
                <Github className="size-4" /> GitHub profile
              </a>
              <a
                href={`mailto:${ADMIN_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-[2px] px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4" /> Contact
              </a>
            </div>
          </motion.div>

          {/* Terminal-style identity card; content mirrors the live data */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            className="w-full max-w-md lg:justify-self-end"
          >
            <div className="overflow-hidden rounded-[3px] border border-border bg-[#0c1016] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2">
                <span className="size-2 rounded-full bg-border" />
                <span className="size-2 rounded-full bg-border" />
                <span className="size-2 rounded-full bg-border" />
                <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  profile · live
                </span>
              </div>
              <div className="space-y-2 p-4 font-mono text-[13px] leading-6">
                <p className="text-muted-foreground">
                  <span className="text-accent">$</span> whoami
                </p>
                <p className="text-foreground">darsh gaur · software engineer</p>
                <p className="text-muted-foreground">
                  <span className="text-accent">$</span> ls ~/projects | wc -l
                </p>
                <p className="text-foreground">
                  {projects === undefined ? "..." : loadedProjects.length}
                </p>
                <p className="text-muted-foreground">
                  <span className="text-accent">$</span> ./claritycrew
                  --describe
                </p>
                <p className="text-muted-foreground">
                  adaptive study app for neurodivergent learners
                </p>
                <p className="text-muted-foreground">
                  <span className="text-accent">$</span> cat location.txt
                </p>
                <p className="text-foreground">{LOCATION}</p>
                <p className="flex items-center gap-1.5 text-muted-foreground/70">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-accent" />
                  ready for new commits
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects: spatial map when supported, full grid always */}
      <section id="projects" className="scroll-mt-16 border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              {`~/projects`}
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Public repositories
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                {projects === undefined
                  ? "counting..."
                  : `${loadedProjects.length} repos · stars, forks and push dates load from the GitHub API`}
              </p>
            </div>
          </div>

          <SceneSection projects={sceneProjects} label="workspace map" />

          <div className="mt-8">
            {projects === undefined ? (
              <ProjectSkeletons />
            ) : loadedProjects.length === 0 ? (
              <p className="rounded-[3px] border border-dashed border-border px-4 py-10 text-center font-mono text-sm text-muted-foreground">
                No repositories are published yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loadedProjects.map((p) => (
                  <ProjectCard key={p._id} project={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Academic record and engineering profile */}
      <section id="academic" className="border-b border-border/70">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              {`~/education`}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Academic record
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Coursework and self-directed research, kept as a structured,
              verifiable record. Read it on the full page.
            </p>
            <div className="mt-6 overflow-hidden rounded-[3px] border border-border">
              {coursework.length === 0 ? (
                <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
                  No coursework entries published yet.
                </p>
              ) : (
                coursework.map((e) => (
                  <div
                    key={e._id}
                    className="flex items-start justify-between gap-4 border-b border-border/70 px-4 py-3.5 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-semibold">{e.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {e.institution}
                        {e.context ? ` · ${e.context}` : ""}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {e.year}
                    </span>
                  </div>
                ))
              )}
              {research.length > 0 && (
                <p className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {research.length} self-directed research entr
                  {research.length === 1 ? "y" : "ies"} listed on the full page.
                </p>
              )}
            </div>
            <Link
              to="/academic"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
            >
              Read the full record <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {`~/engineering-profile`}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              How the work lines up
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The repositories below are not school assignments; they are
              shipped products with real code, real CI and, where possible,
              real users. What the coursework adds is structure.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Physics, chemistry, mathematics and computer science in the PCMC stream at The Amaatra Academy, Bengaluru (2026).",
                "Public code spans Rust, TypeScript, Kotlin, Dart, C# and Python across 19 repositories, all built out in the open.",
                "Focus areas visible in the code: local-first privacy tools, study software for students, and developer utilities.",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-6">
                  <Terminal className="mt-1 size-3.5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{line}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="size-4" /> Notes and blog posts
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            open source by default
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Every project above is public. Clone it, read it, file an issue.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Github className="size-4" /> archanagaur175-glitch
            </a>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-[2px] border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground/60"
            >
              Full project index <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
