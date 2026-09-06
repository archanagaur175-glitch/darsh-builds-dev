import { useState, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { Link } from "react-router";
import { Loader2, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GITHUB_OWNER } from "@/lib/site";
import type { Id } from "@/convex/_generated/dataModel";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <span className="mt-1 block font-mono text-[10px] text-muted-foreground/60">
          {hint}
        </span>
      )}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-[2px] border px-2.5 py-1 font-mono text-xs transition-colors ${
        checked
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`size-1.5 rounded-full ${checked ? "bg-accent" : "bg-border"}`}
      />
      {label}
    </button>
  );
}

type Notice = { kind: "ok" | "err"; text: string } | null;

function NoticeBar({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p
      className={`rounded-[2px] border px-3 py-2 font-mono text-xs ${
        notice.kind === "ok"
          ? "border-accent/40 bg-accent/5 text-accent"
          : "border-destructive/50 bg-destructive/10 text-destructive"
      }`}
    >
      {notice.text}
    </p>
  );
}

const emptyProject = {
  slug: "",
  title: "",
  summary: "",
  architecture: "",
  stack: "",
  repoOwner: GITHUB_OWNER,
  repoName: "",
  demoUrl: "",
  docsUrl: "",
  featured: false,
  scaffold: false,
  documented: true,
  published: true,
  order: 99,
};

function ProjectsManager() {
  const all = useQuery(api.projects.listAll);
  const save = useMutation(api.projects.save);
  const remove = useMutation(api.projects.remove);
  const [draft, setDraft] = useState<typeof emptyProject | null>(null);
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const startEdit = (p: NonNullable<typeof all>[number]) => {
    setEditingId(p._id);
    setDraft({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      architecture: p.architecture,
      stack: p.stack.join(", "),
      repoOwner: p.repoOwner,
      repoName: p.repoName,
      demoUrl: p.demoUrl ?? "",
      docsUrl: p.docsUrl ?? "",
      featured: p.featured,
      scaffold: p.scaffold,
      documented: p.documented ?? true,
      published: p.published,
      order: p.order,
    });
  };

  const submit = async () => {
    if (!draft) return;
    if (!draft.title || !draft.repoName) {
      setNotice({ kind: "err", text: "title and repo name are required" });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await save({
        id: editingId ?? undefined,
        slug: draft.slug || draft.repoName.toLowerCase().replace(/\s+/g, "-"),
        title: draft.title,
        summary: draft.summary,
        architecture: draft.architecture,
        stack: draft.stack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        repoOwner: draft.repoOwner || GITHUB_OWNER,
        repoName: draft.repoName.trim(),
        demoUrl: draft.demoUrl.trim() || undefined,
        docsUrl: draft.docsUrl.trim() || undefined,
        featured: draft.featured,
        scaffold: draft.scaffold,
        documented: draft.documented,
        published: draft.published,
        order: Number(draft.order) || 99,
      });
      setNotice({ kind: "ok", text: "saved" });
      setDraft(null);
      setEditingId(null);
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "save failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          {all?.length ?? "..."} projects in the database
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setDraft({ ...emptyProject });
          }}
        >
          <Plus className="size-3.5" /> New project
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {draft && (
        <div className="mt-4 space-y-4 rounded-[3px] border border-accent/30 bg-muted/30 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            {editingId ? "edit" : "new"} project
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title *">
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Repo name *" hint="without the owner prefix">
              <Input
                value={draft.repoName}
                onChange={(e) =>
                  setDraft({ ...draft, repoName: e.target.value })
                }
              />
            </Field>
            <Field label="Slug" hint="defaults to the repo name">
              <Input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </Field>
            <Field label="Stack" hint="comma separated">
              <Input
                value={draft.stack}
                onChange={(e) => setDraft({ ...draft, stack: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Summary">
            <Textarea
              rows={2}
              value={draft.summary}
              onChange={(e) =>
                setDraft({ ...draft, summary: e.target.value })
              }
            />
          </Field>
          <Field label="Architecture writeup" hint="markdown">
            <Textarea
              rows={7}
              value={draft.architecture}
              onChange={(e) =>
                setDraft({ ...draft, architecture: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Demo URL">
              <Input
                value={draft.demoUrl}
                onChange={(e) =>
                  setDraft({ ...draft, demoUrl: e.target.value })
                }
              />
            </Field>
            <Field label="Docs URL">
              <Input
                value={draft.docsUrl}
                onChange={(e) =>
                  setDraft({ ...draft, docsUrl: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Toggle
              label="featured"
              checked={draft.featured}
              onChange={(v) => setDraft({ ...draft, featured: v })}
            />
            <Toggle
              label="scaffold"
              checked={draft.scaffold}
              onChange={(v) => setDraft({ ...draft, scaffold: v })}
            />
            <Toggle
              label="documented"
              checked={draft.documented}
              onChange={(v) => setDraft({ ...draft, documented: v })}
            />
            <Toggle
              label="published"
              checked={draft.published}
              onChange={(v) => setDraft({ ...draft, published: v })}
            />
            <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              order
              <Input
                type="number"
                className="w-20"
                value={draft.order}
                onChange={(e) =>
                  setDraft({ ...draft, order: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={submit}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft(null);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-[3px] border border-border">
        {all === undefined ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            loading...
          </p>
        ) : all.length === 0 ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            No projects yet. Create one above.
          </p>
        ) : (
          all.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm">
                  <span className="text-muted-foreground/50">
                    {String(p.order).padStart(2, "0")}
                  </span>{" "}
                  {p.title}
                  {!p.published && (
                    <span className="ml-2 text-[10px] uppercase text-destructive">
                      hidden
                    </span>
                  )}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {p.repoOwner}/{p.repoName}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete project"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${p.title}?`)) return;
                    await remove({ id: p._id });
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const emptyAcademic = {
  slug: "",
  kind: "coursework" as "coursework" | "research",
  title: "",
  institution: "",
  context: "",
  year: "",
  concepts: "",
  abstract: "",
  artifacts: "",
  published: true,
  order: 99,
};

function AcademicManager() {
  const all = useQuery(api.academic.listAll);
  const save = useMutation(api.academic.save);
  const remove = useMutation(api.academic.remove);
  const [draft, setDraft] = useState<typeof emptyAcademic | null>(null);
  const [editingId, setEditingId] = useState<Id<"academicEntries"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const startEdit = (p: NonNullable<typeof all>[number]) => {
    setEditingId(p._id);
    setDraft({
      slug: p.slug,
      kind: p.kind,
      title: p.title,
      institution: p.institution,
      context: p.context ?? "",
      year: p.year,
      concepts: p.concepts.join(", "),
      abstract: p.abstract ?? "",
      artifacts: p.artifacts.map((a) => `${a.label}|${a.url}`).join("\n"),
      published: p.published,
      order: p.order,
    });
  };

  const submit = async () => {
    if (!draft || !draft.title) {
      setNotice({ kind: "err", text: "title is required" });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await save({
        id: editingId ?? undefined,
        slug:
          draft.slug ||
          draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        kind: draft.kind,
        title: draft.title,
        institution: draft.institution,
        context: draft.context.trim() || undefined,
        year: draft.year,
        concepts: draft.concepts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        abstract: draft.abstract.trim() || undefined,
        artifacts: draft.artifacts
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [label, url] = l.split("|");
            return { label: label?.trim() || url, url: (url ?? label).trim() };
          }),
        published: draft.published,
        order: Number(draft.order) || 99,
      });
      setNotice({ kind: "ok", text: "saved" });
      setDraft(null);
      setEditingId(null);
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "save failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          {all?.length ?? "..."} entries
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setDraft({ ...emptyAcademic });
          }}
        >
          <Plus className="size-3.5" /> New entry
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {draft && (
        <div className="mt-4 space-y-4 rounded-[3px] border border-accent/30 bg-muted/30 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            {editingId ? "edit" : "new"} academic entry
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title *">
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Kind">
              <select
                value={draft.kind}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    kind: e.target.value as "coursework" | "research",
                  })
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-ring"
              >
                <option value="coursework">coursework</option>
                <option value="research">research</option>
              </select>
            </Field>
            <Field label="Institution">
              <Input
                value={draft.institution}
                onChange={(e) =>
                  setDraft({ ...draft, institution: e.target.value })
                }
              />
            </Field>
            <Field label="Context" hint="grade, programme">
              <Input
                value={draft.context}
                onChange={(e) =>
                  setDraft({ ...draft, context: e.target.value })
                }
              />
            </Field>
            <Field label="Year">
              <Input
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
              />
            </Field>
            <Field label="Concepts" hint="comma separated">
              <Input
                value={draft.concepts}
                onChange={(e) =>
                  setDraft({ ...draft, concepts: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Abstract" hint="markdown, research only">
            <Textarea
              rows={4}
              value={draft.abstract}
              onChange={(e) =>
                setDraft({ ...draft, abstract: e.target.value })
              }
            />
          </Field>
          <Field label="Artifacts" hint="one per line as label|url">
            <Textarea
              rows={3}
              value={draft.artifacts}
              onChange={(e) =>
                setDraft({ ...draft, artifacts: e.target.value })
              }
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Toggle
              label="published"
              checked={draft.published}
              onChange={(v) => setDraft({ ...draft, published: v })}
            />
            <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              order
              <Input
                type="number"
                className="w-20"
                value={draft.order}
                onChange={(e) =>
                  setDraft({ ...draft, order: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={submit} disabled={busy}>
              {busy ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft(null);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-[3px] border border-border">
        {all === undefined ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            loading...
          </p>
        ) : all.length === 0 ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            No academic entries yet.
          </p>
        ) : (
          all.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm">
                  <span className="mr-2 rounded-[2px] border border-border/70 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {p.kind}
                  </span>
                  {p.title}
                  {!p.published && (
                    <span className="ml-2 text-[10px] uppercase text-destructive">
                      hidden
                    </span>
                  )}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {p.institution} · {p.year}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete entry"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${p.title}?`)) return;
                    await remove({ id: p._id });
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const emptyBlog = {
  slug: "",
  title: "",
  date: "",
  summary: "",
  body: "",
  published: true,
};

function BlogManager() {
  const all = useQuery(api.blog.listAll);
  const save = useMutation(api.blog.save);
  const remove = useMutation(api.blog.remove);
  const [draft, setDraft] = useState<typeof emptyBlog | null>(null);
  const [editingId, setEditingId] = useState<Id<"blogPosts"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const startEdit = (p: NonNullable<typeof all>[number]) => {
    setEditingId(p._id);
    setDraft({
      slug: p.slug,
      title: p.title,
      date: new Date(p.date).toISOString().slice(0, 10),
      summary: p.summary,
      body: p.body,
      published: p.published,
    });
  };

  const submit = async () => {
    if (!draft || !draft.title || !draft.date) {
      setNotice({ kind: "err", text: "title and date are required" });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await save({
        id: editingId ?? undefined,
        slug: draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: draft.title,
        date: new Date(draft.date).getTime(),
        summary: draft.summary,
        body: draft.body,
        published: draft.published,
      });
      setNotice({ kind: "ok", text: "saved" });
      setDraft(null);
      setEditingId(null);
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "save failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          {all?.length ?? "..."} posts
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setDraft({ ...emptyBlog });
          }}
        >
          <Plus className="size-3.5" /> New post
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {draft && (
        <div className="mt-4 space-y-4 rounded-[3px] border border-accent/30 bg-muted/30 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            {editingId ? "edit" : "new"} post
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title *">
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Date *" hint="yyyy-mm-dd">
              <Input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Slug" hint="defaults to the title">
            <Input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
          </Field>
          <Field label="Summary">
            <Textarea
              rows={2}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </Field>
          <Field label="Body" hint="markdown">
            <Textarea
              rows={9}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </Field>
          <div className="flex items-center gap-2">
            <Toggle
              label="published"
              checked={draft.published}
              onChange={(v) => setDraft({ ...draft, published: v })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={submit} disabled={busy}>
              {busy ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft(null);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-[3px] border border-border">
        {all === undefined ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            loading...
          </p>
        ) : all.length === 0 ? (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            No posts yet.
          </p>
        ) : (
          all.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm">
                  {p.title}
                  {!p.published && (
                    <span className="ml-2 text-[10px] uppercase text-destructive">
                      hidden
                    </span>
                  )}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {new Date(p.date).toISOString().slice(0, 10)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete post"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${p.title}?`)) return;
                    await remove({ id: p._id });
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AdminWorkspace() {
  const { signOut } = useAuth();
  const restoreContent = useMutation(api.admin.restoreContent);
  const [restoring, setRestoring] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<"projects" | "academic" | "blog">("projects");

  const handleRestore = async () => {
    const ok = window.confirm(
      "This deletes every project, academic entry and blog post in the database and reloads the starter set. Any edits you made will be lost. Continue?",
    );
    if (!ok) return;
    setRestoring(true);
    setRestoreNotice(null);
    try {
      const r = await restoreContent();
      setRestoreNotice(
        `Starter set restored: ${r.restored.projects} projects, ${r.restored.academic} academic entries, ${r.restored.blog} posts.`,
      );
    } catch (e) {
      setRestoreNotice(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setRestoring(false);
    }
  };
  const tabs = [
    { id: "projects" as const, label: "Projects" },
    { id: "academic" as const, label: "Academic" },
    { id: "blog" as const, label: "Blog" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-[3px] border border-border p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-[2px] px-3 py-1.5 font-mono text-xs transition-colors ${
                tab === t.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRestore}
          disabled={restoring}
          title="Deletes all content and reloads the curated starter set"
        >
          {restoring ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          Restore starter set
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void signOut()}
        >
          <LogOut className="size-3.5" /> Sign out
        </Button>
      </div>
      {restoreNotice && (
        <p className="mt-3 rounded-[2px] border border-accent/40 bg-accent/5 px-3 py-2 font-mono text-xs text-accent">
          {restoreNotice}
        </p>
      )}

      <div className="mt-6">
        {tab === "projects" && <ProjectsManager />}
        {tab === "academic" && <AcademicManager />}
        {tab === "blog" && <BlogManager />}
      </div>
    </div>
  );
}

export default function Admin() {
  const overview = useQuery(api.admin.overview);
  const { user, isLoading } = useAuth();
  const claimAdmin = useMutation(api.admin.claimAdmin);
  const seedContent = useMutation(api.admin.seedContent);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Admin" />
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          {`~/admin`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Headless CMS
        </h1>

        <div className="mt-8">
          {isLoading || overview === undefined || !user ? (
            <div className="flex h-40 items-center justify-center rounded-[3px] border border-border">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : overview.isAdmin ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 rounded-[3px] border border-border bg-card px-4 py-3">
                {[
                  { label: "projects", value: overview.counts.projects },
                  { label: "academic", value: overview.counts.academic },
                  { label: "blog", value: overview.counts.blog },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {c.value} {c.label}
                  </span>
                ))}
                <span className="font-mono text-xs text-accent">
                  signed in as {overview.email}
                </span>
              </div>
              {overview.counts.projects === 0 &&
                overview.counts.academic === 0 &&
                overview.counts.blog === 0 && (
                  <div className="rounded-[3px] border border-dashed border-accent/50 px-4 py-3">
                    <p className="font-mono text-xs text-muted-foreground">
                      The database is empty. Load the starter content set to
                      publish the real repositories and academic entries.
                    </p>
                  </div>
                )}
              <AdminWorkspace />
            </div>
          ) : overview.isOwnerEmail ? (
            <div className="max-w-xl space-y-4 rounded-[3px] border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">
                Set up the admin account
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Signed in as <span className="text-foreground">{overview.email}</span>.
                {" "}This email matches the owner allowlist, so you can claim the
                single admin role and load the starter content.
              </p>
              <NoticeBar notice={notice} />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={async () => {
                    setBusy("claim");
                    setNotice(null);
                    try {
                      const r = await claimAdmin();
                      if (r.claimed) {
                        const seeded = await seedContent().catch(() => null);
                        setNotice({
                          kind: "ok",
                          text: seeded
                            ? `${r.message} Starter content loaded (${seeded.inserted.projects} projects, ${seeded.inserted.academic} academic entries).`
                            : r.message,
                        });
                      } else {
                        setNotice({ kind: "ok", text: r.message });
                      }
                    } catch (e) {
                      setNotice({
                        kind: "err",
                        text: e instanceof Error ? e.message : "claim failed",
                      });
                    } finally {
                      setBusy(null);
                    }
                  }}
                  disabled={busy !== null}
                >
                  {busy === "claim" && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Claim admin role
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setBusy("seed");
                    setNotice(null);
                    try {
                      const r = await seedContent();
                      setNotice({
                        kind: "ok",
                        text: `inserted ${r.inserted.projects} projects, ${r.inserted.academic} academic entries, ${r.inserted.blog} posts`,
                      });
                    } catch (e) {
                      setNotice({
                        kind: "err",
                        text: e instanceof Error ? e.message : "seed failed",
                      });
                    } finally {
                      setBusy(null);
                    }
                  }}
                  disabled={busy !== null}
                >
                  {busy === "seed" && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Load starter content
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl rounded-[3px] border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Access restricted</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You are signed in as {overview.email}, which is not the owner
                email for this site. Content management is limited to the owner
                account only.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block font-mono text-sm text-accent hover:underline"
              >
                Return to the site
              </Link>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
