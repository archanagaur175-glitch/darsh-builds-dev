import { Link } from "react-router";
import { Github, Mail, Terminal } from "lucide-react";
import { ADMIN_EMAIL, GITHUB_URL, LOCATION } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-[3px] border border-white/20 bg-black">
              <Terminal className="size-3.5 text-white" />
            </span>
            <span className="font-mono text-sm font-semibold">
              darsh<span className="text-accent">.</span>builds
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Darsh Gaur builds free open-source tools for developers from
            Bengaluru. Creator of ClarityCrew and 18 more public repositories,
            all linked below.
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground/60">
            Repository statistics load live from the GitHub API.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sections
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/projects" className="text-foreground/80 hover:text-accent">Projects</Link></li>
            <li><Link to="/academic" className="text-foreground/80 hover:text-accent">Academic record</Link></li>
            <li><Link to="/blog" className="text-foreground/80 hover:text-accent">Blog</Link></li>
            <li><Link to="/privacy" className="text-foreground/80 hover:text-accent">Privacy policy</Link></li>
            <li><Link to="/terms" className="text-foreground/80 hover:text-accent">Terms of use</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${ADMIN_EMAIL}`}
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-accent"
              >
                <Mail className="size-3.5" /> {ADMIN_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-accent"
              >
                <Github className="size-3.5" /> github.com/archanagaur175-glitch
              </a>
            </li>
            <li className="font-mono text-xs text-muted-foreground/70">
              {LOCATION}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 font-mono text-xs text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Darsh Gaur. All rights reserved.</p>
          <p>Built with Next.js-free sincerity. Open source by default.</p>
        </div>
      </div>
    </footer>
  );
}
