import { useQuery } from "convex/react";
import { Link } from "react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarkdownBody } from "@/components/Markdown";

export default function Academic() {
  const entries = useQuery(api.academic.list);
  const coursework = (entries ?? []).filter((e) => e.kind === "coursework");
  const research = (entries ?? []).filter((e) => e.kind === "research");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Academic record"
        description="Coursework and self-directed research by Darsh Gaur, kept as a structured record."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {`../`}
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-accent">
          {`~/education`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Academic record
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          A factual, verifiable record of coursework and self-directed work. It
          is maintained as structured data through the admin system and is
          updated as Darsh progresses through school and university
          admissions.
        </p>

        <section className="mt-12">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider">
            Coursework
          </h2>
          <div className="mt-4 overflow-hidden rounded-[3px] border border-border">
            {entries === undefined ? (
              <div className="h-24 animate-pulse bg-card" />
            ) : coursework.length === 0 ? (
              <p className="px-4 py-8 text-center font-mono text-sm text-muted-foreground">
                No coursework entries published yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Course</th>
                    <th className="px-4 py-2.5 font-medium">Institution</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                      Context
                    </th>
                    <th className="px-4 py-2.5 font-medium">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {coursework.map((e) => (
                    <tr
                      key={e._id}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{e.title}</p>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                          {e.concepts.join(" · ")}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.institution}
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                        {e.context ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {e.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider">
            Self-directed research
          </h2>
          <div className="mt-4 space-y-4">
            {entries === undefined ? (
              <div className="h-24 animate-pulse rounded-[3px] border border-border/70 bg-card" />
            ) : research.length === 0 ? (
              <p className="rounded-[3px] border border-dashed border-border px-4 py-8 text-center font-mono text-sm text-muted-foreground">
                No research entries published yet. This section is reserved for
                documented projects with artifacts and links.
              </p>
            ) : (
              research.map((e) => (
                <article
                  key={e._id}
                  className="rounded-[3px] border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{e.title}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {e.institution} · {e.year}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {e.concepts.join(" · ")}
                  </p>
                  {e.abstract && (
                    <div className="mt-3 text-sm leading-6 text-muted-foreground">
                      <MarkdownBody>{e.abstract}</MarkdownBody>
                    </div>
                  )}
                  {e.artifacts.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.artifacts.map((a) => (
                        <a
                          key={a.url}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-2.5 py-1 font-mono text-xs text-foreground/80 transition-colors hover:border-accent hover:text-accent"
                        >
                          {a.label} <ExternalLink className="size-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mt-14 rounded-[3px] border border-border bg-card p-6">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider">
            Engineering profile
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Darsh is currently a Grade 11 student in the PCMC stream at The
            Amaatra Academy, Bengaluru. Outside the classroom he publishes and
            maintains open-source software across Rust, TypeScript, Kotlin,
            Dart, C# and Python. The public repositories on this site are the
            primary evidence for that work: each one links to its source, its
            commit history and its CI status. Coursework supplies the academic
            structure around an independent practice that is visible, dated and
            reviewable on GitHub.
          </p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
          >
            Review the repositories <ExternalLink className="size-3.5" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
