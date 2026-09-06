import { SITE_GITHUB_OWNER } from "./site";

// Starter content for the Darsh Builds portfolio. Every project row maps to a
// real public repository owned by SITE_GITHUB_OWNER. Copy describes only what
// is actually in each repository (verified from the repo tree, package
// manifests and README files at seed time), and repositories without any
// committed documentation are explicitly flagged with documented: false so the
// UI never styles them as finished, documented work.
export type StarterProject = {
  slug: string;
  title: string;
  summary: string;
  architecture: string;
  stack: string[];
  repoOwner: string;
  repoName: string;
  demoUrl?: string;
  docsUrl?: string;
  featured: boolean;
  scaffold: boolean;
  documented: boolean;
  published: boolean;
  order: number;
};

const markdownHead = (lines: string[]) => lines.join("\n\n");

export const starterProjects: StarterProject[] = [
  {
    slug: "claritycrew03",
    title: "ClarityCrew Web",
    summary:
      "Repository for claritycrew 3.0.0. package.json describes the project as an academic study app for neurodivergent learners. No README is committed, so the entry is limited to repository facts.",
    architecture: markdownHead([
      "## Documentation status\n\nNo README is committed to this repository. Everything below comes from the repository contents, starting with the package.json description of claritycrew 3.0.0 as an academic study app for neurodivergent learners.",
      "## Repository layout\n\n- `src/app`: Next.js App Router routes\n- `src/components`: React UI components\n- `src/data`: content and curriculum data\n- `src/hooks` and `src/lib`: shared logic\n\nTop-level config: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`.",
      "## Dependency set\n\nShips OpenDyslexic, Inter and Outfit fonts through `@fontsource`, `next-themes` for theming and `lucide-react` for icons.",
    ]),
    stack: ["TypeScript", "React", "Next.js"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "claritycrew03",
    featured: true,
    scaffold: false,
    documented: false,
    published: true,
    order: 1,
  },
  {
    slug: "claritycrew",
    title: "ClarityCrew Mobile",
    summary:
      "Repository for claritycrew 1.0.0. pubspec.yaml describes the project as an adaptive learning companion for neurodivergent learners. A SPEC.md at the root documents the product contract.",
    architecture: markdownHead([
      "## What this repository is\n\npubspec.yaml describes claritycrew as an adaptive learning companion for neurodivergent learners (version 1.0.0+1). This is the Flutter generation of ClarityCrew, documented by SPEC.md at the repository root.",
      "## Repository layout\n\n- `lib/`: split into `core`, `features`, `models`, `persistence`, `services` and `state`, with `main.dart` and `app.dart` entry points\n- `assets/content` and `assets/videos`: study content and video lesson assets\n- `tool/`: Python generators (`extract_lessons.py`, `generate_content_json.py`, `generate_videos.py`) that build content bundles",
      "## Stack notes\n\nProvider for state, shared_preferences for local persistence, video_player for lessons, and Firebase core plus Cloud Firestore for sync and storage.",
    ]),
    stack: ["Dart", "Flutter", "Firebase"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "ClarityCrew",
    featured: true,
    scaffold: false,
    documented: true,
    published: true,
    order: 2,
  },
  {
    slug: "testcraft",
    title: "TestCraft",
    summary:
      "Curriculum-aware practice test generator. README: pick a board, scope chapters and sub-topics, then sit an adaptive practice paper with instant review, a per-question tutor, analytics and PDF export.",
    architecture: markdownHead([
      "## What this repository is\n\nFrom the README: a curriculum-aware, compliance-safe practice-test generator covering 6 curricula (CBSE, ICSE, JEE, NEET, SAT, UNIVERSITY), each with subject, chapter and sub-topic trees and exam-structure metadata.",
      "## Repository layout\n\n- Next.js 16 app router project with `src/app`, `src/components` and `src/lib`\n- `.github/workflows` for CI\n- `.env.example` documents required environment",
      "## Stack notes\n\n- `jspdf` and `jspdf-autotable` for print and PDF export\n- `zustand` for client state\n- Deterministic local paper generation plus an optional server-side LLM lane at `/api/generate`",
    ]),
    stack: ["TypeScript", "Next.js", "React"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "TestCraft",
    demoUrl: "https://test-craft-sigma.vercel.app",
    featured: true,
    scaffold: false,
    documented: true,
    published: true,
    order: 3,
  },
  {
    slug: "accesspath",
    title: "AccessPath",
    summary:
      "Free, open-access college admissions and counseling platform. README: helps students match with colleges, track deadlines and write stronger essays, with an explainable Admission Strength Index.",
    architecture: markdownHead([
      "## What this repository is\n\nFrom the README: a free, open-access college admissions and counseling platform built for students and advisors. It runs in demo and mock mode with zero configuration.",
      "## Repository layout\n\n- Next.js 16 with route groups in `app/`: `(auth)`, `(marketing)`, `dashboard`, `advisor`, `essays`, `matcher`, `profile`, `resources`, `tracker` plus an `api` folder\n- Feature components under `components/advisor` and a shared `lib`\n- `.github/workflows` for CI",
      "## Stack notes\n\n- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) for auth and data\n- recharts for dashboard charts\n- Prettier enforced via `format` and `format:check` scripts",
    ]),
    stack: ["TypeScript", "Next.js", "Supabase", "React"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "AccessPath",
    demoUrl: "https://accesspath-jade.vercel.app",
    featured: true,
    scaffold: false,
    documented: true,
    published: true,
    order: 4,
  },
  {
    slug: "zerotrace",
    title: "ZeroTrace",
    summary:
      "Local, offline network and privacy monitor for Windows. README: watches connections, traffic and startup and telemetry bloat, 100% local, no accounts, no cloud, no telemetry.",
    architecture: markdownHead([
      "## What this repository is\n\nFrom the README: a local, offline network and privacy monitor for Windows with a React UI over a Rust core, connected through Tauri IPC.",
      "## Repository layout\n\n- `src-tauri/src`: Rust core that reads Windows socket tables, ETW, registry and services; includes an `elevated` module and capability manifests\n- `src/`: React + Vite frontend (`App.tsx`)\n- `scripts/`: `dep-audit.mjs`, `gen-icon.mjs`, `verify-offline.ps1`\n- `rust-toolchain.toml` pins the Rust toolchain",
      "## Design constraints stated in the README\n\nEverything runs on the machine, the app is low-privilege by default, and there is no outbound network path in the app code.",
    ]),
    stack: ["Rust", "Tauri", "React", "TypeScript"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "ZeroTrace",
    featured: true,
    scaffold: false,
    documented: true,
    published: true,
    order: 5,
  },
  {
    slug: "lumensuite",
    title: "Lumen Suite",
    summary:
      "Local-first, privacy-first office suite (Writer, Calc, Impress) on Tauri and LibreOffice. README: bundled headless LibreOffice engine, zero telemetry, zero accounts, zero network by default.",
    architecture: markdownHead([
      "## What this repository is\n\nFrom package.json: a local-first, privacy-first, ad-free office suite built on Tauri and LibreOffice, licensed GPL-3.0-or-later.",
      "## Repository layout\n\n- `src/`: React + Vite app; `src-tauri/`: Rust shell with capability manifests\n- `scripts/`: `fetch-libreoffice.mjs`, `package-libreoffice.mjs`, `smoke-convert.mjs`\n- `docs/`: ADR, CONTRACT, RELEASE and TRUST documents\n- Vitest test setup",
      "## Local-first design\n\nPer the README, the bundled LibreOffice process binds only to 127.0.0.1, has no network capability, and the app ships without telemetry or accounts.",
    ]),
    stack: ["TypeScript", "Rust", "Tauri", "React"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "LumenSuite",
    featured: true,
    scaffold: false,
    documented: true,
    published: true,
    order: 6,
  },
  {
    slug: "fairmeter",
    title: "FairMeter",
    summary:
      "Independent, unofficial auto-rickshaw fare meter for Indian cities, built with Kotlin and Jetpack Compose. README carries no affiliation with any RTA or government body.",
    architecture: markdownHead([
      "## What this repository is\n\nFrom the README: an independent, unofficial auto-rickshaw fare meter for Indian cities built with Kotlin and Jetpack Compose.",
      "## Repository layout\n\nSingle Android project under `app/src` with Gradle Kotlin DSL build files, CI via `.github/workflows`.",
      "## Fare tariff data\n\nThe README tables published tariff sources per city with effective dates, for example Bengaluru (Karnataka DTA notification, August 2025, verified July 2025) and Mumbai (Maharashtra tariff card PDF).",
    ]),
    stack: ["Kotlin", "Jetpack Compose", "Android"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "FairMeter",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 7,
  },
  {
    slug: "cbse-study-assistant",
    title: "CBSE Study Assistant",
    summary:
      "Repository combining Python scripts and a Flutter app under cbse_study_app. No README is committed, so no product claims are made beyond the repository contents.",
    architecture: markdownHead([
      "## Documentation status\n\nNo README is committed to this repository. The description below is limited to what the files show.",
      "## Repository layout\n\n- Root level: `main.py`, `data_loader.py`, `recommender.py`, `requirements.txt` and `cbse_chapters.csv`\n- `build_apk_colab.ipynb` and `buildozer.spec` for building an Android APK from Colab\n- `cbse_study_app/`: Flutter app with its own pubspec and lib source\n- CI via `.github/workflows`",
    ]),
    stack: ["Dart", "Flutter", "Python"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "cbse-study-assistant",
    featured: false,
    scaffold: false,
    documented: false,
    published: true,
    order: 8,
  },
  {
    slug: "mirage",
    title: "Mirage",
    summary:
      "C# desktop project organized as Mirage.App, Mirage.Core, Mirage.Native and Mirage.Tests, with an ARCHITECTURE.md document in docs/.",
    architecture: markdownHead([
      "## Documentation\n\nA README and docs/ARCHITECTURE.md exist in the repository.",
      "## Repository layout\n\n- `src/Mirage.App`: application project (XAML UI)\n- `src/Mirage.Core`: core logic\n- `src/Mirage.Native`: native integration layer\n- `src/Mirage.Tests`: tests\n- `global.json` pins the SDK",
    ]),
    stack: ["C#", ".NET", "XAML"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "Mirage",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 9,
  },
  {
    slug: "backdrop",
    title: "BackDrop",
    summary:
      "C# desktop solution with BackDrop.App, BackDrop.Core and BackDrop.Tests projects plus shared build props and a tools/ folder.",
    architecture: markdownHead([
      "## Documentation\n\nA README and docs/ exist in the repository.",
      "## Repository layout\n\n- `BackDrop.sln` with `src/BackDrop.App`, `src/BackDrop.Core` and `src/BackDrop.Tests`\n- `Directory.Build.props` and `global.json` for shared build configuration\n- `tools/make-icon.sh` for icon generation",
    ]),
    stack: ["C#", ".NET", "XAML"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "BackDrop",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 10,
  },
  {
    slug: "dreamteam",
    title: "DreamTeam",
    summary:
      "Multi-module Kotlin Android project: feature modules for circadian rhythm, sleep debt, smart alarm and dashboard sit on shared core modules.",
    architecture: markdownHead([
      "## Documentation\n\nA README exists at the repository root.",
      "## Repository layout\n\n- `core/`: `core-common`, `core-database`, `core-ui`\n- `feature/`: `circadian`, `dashboard`, `logger`, `sleepdebt`, `smartalarm`\n- `app/`: application module\n- Gradle version catalog in `gradle/libs.versions.toml`, CI in `.github/workflows`",
      "## Notes\n\nThe module names indicate a sleep and circadian rhythm product. Claims beyond the module structure are not made here.",
    ]),
    stack: ["Kotlin", "Android", "Jetpack Compose"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "DreamTeam",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 11,
  },
  {
    slug: "awake",
    title: "Awake",
    summary:
      "Kotlin Android project with a local SQLite store committed under .freebuff/desktop-v2.db, a single app module and CI workflow.",
    architecture: markdownHead([
      "## Documentation\n\nA README exists at the repository root.",
      "## Repository layout\n\n- `app/src` with Kotlin sources and XML resources\n- Local SQLite database files under `.freebuff/`\n- Gradle wrapper and version catalog, CI in `.github/workflows`",
    ]),
    stack: ["Kotlin", "Android", "SQLite"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "Awake",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 12,
  },
  {
    slug: "housiness",
    title: "Housiness",
    summary:
      "Kotlin Android project with a single app module under app/src. No README is committed, so the entry is limited to repository facts.",
    architecture: markdownHead([
      "## Documentation status\n\nNo README is committed to this repository. The description below is limited to what the files show.",
      "## Repository layout\n\n- `app/src` with Kotlin sources and XML resources\n- Gradle wrapper, version catalog and CI in `.github/workflows`",
    ]),
    stack: ["Kotlin", "Android"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "housiness",
    featured: false,
    scaffold: false,
    documented: false,
    published: true,
    order: 13,
  },
  {
    slug: "springboard",
    title: "Springboard",
    summary:
      "Kotlin Android project with a single app module under app/src. No README is committed, so the entry is limited to repository facts.",
    architecture: markdownHead([
      "## Documentation status\n\nNo README is committed to this repository. The description below is limited to what the files show.",
      "## Repository layout\n\n- `app/src` with Kotlin sources and resources\n- `app/proguard-rules.pro`, Gradle version catalog and CI in `.github/workflows`",
    ]),
    stack: ["Kotlin", "Android"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "Springboard",
    featured: false,
    scaffold: false,
    documented: false,
    published: true,
    order: 14,
  },
  {
    slug: "blank-slate",
    title: "BlankSlate",
    summary:
      "Two-part project: a Python daemon (with pyinstaller build and tests) plus a desktop HUD built with Svelte, Tauri and pnpm.",
    architecture: markdownHead([
      "## Documentation\n\nA README and third-party notices exist at the repository root.",
      "## Repository layout\n\n- `daemon/`: Python with `pyproject.toml`, `src/` and `tests/`, built via `build_daemon.ps1` and pyinstaller\n- `hud/`: Svelte frontend (`hud/src`, Svelte config) with a Tauri shell (`hud/src-tauri`) and pnpm workspace\n- Root LICENSE, NOTICE and THIRD_PARTY_NOTICES.md",
    ]),
    stack: ["Python", "Svelte", "Tauri", "TypeScript"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "BlankSlate",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 15,
  },
  {
    slug: "darshbuilds",
    title: "darshbuilds",
    summary: "Planned / not yet started. No code committed.",
    architecture: "",
    stack: [],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "darshbuilds",
    featured: false,
    scaffold: true,
    documented: false,
    published: true,
    order: 16,
  },
  {
    slug: "neon-drift",
    title: "Neon-Drift",
    summary: "Planned / not yet started. No code committed.",
    architecture: "",
    stack: [],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "Neon-Drift",
    featured: false,
    scaffold: true,
    documented: false,
    published: true,
    order: 17,
  },
  {
    slug: "pothole",
    title: "Pothole",
    summary: "Planned / not yet started. No code committed.",
    architecture: "",
    stack: [],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "pothole",
    featured: false,
    scaffold: true,
    documented: false,
    published: true,
    order: 18,
  },
  {
    slug: "access_path",
    title: "AccessPath (legacy name)",
    summary:
      "Earlier copy of the AccessPath codebase kept under the older snake_case name, pointing at the same Vercel demo URL.",
    architecture: markdownHead([
      "## Relationship to AccessPath\n\nThis repository mirrors the AccessPath codebase (Next.js 16, Supabase, recharts) under the older `access_path` name. Its homepage field points at the same demo deployment.",
    ]),
    stack: ["TypeScript", "Next.js", "Supabase"],
    repoOwner: SITE_GITHUB_OWNER,
    repoName: "access_path",
    demoUrl: "https://accesspath-jade.vercel.app",
    featured: false,
    scaffold: false,
    documented: true,
    published: true,
    order: 19,
  },
];

export type StarterAcademic = {
  slug: string;
  kind: "coursework" | "research";
  title: string;
  institution: string;
  context?: string;
  year: string;
  concepts: string[];
  abstract?: string;
  artifacts: { label: string; url: string }[];
  published: boolean;
  order: number;
};

export const starterAcademic: StarterAcademic[] = [
  {
    slug: "grade-11-amaatra",
    kind: "coursework",
    title: "Grade 11, PCMC stream",
    institution: "The Amaatra Academy, Bengaluru",
    context: "Current",
    year: "2026",
    concepts: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
    artifacts: [],
    published: true,
    order: 1,
  },
];

export const starterBlog: {
  slug: string;
  title: string;
  date: number;
  summary: string;
  body: string;
  published: boolean;
}[] = [];
