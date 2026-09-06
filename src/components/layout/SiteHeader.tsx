import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Github, Menu, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GITHUB_URL } from "@/lib/site";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/academic", label: "Academic" },
  { to: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Darsh Builds home"
        >
          <span className="flex size-6 items-center justify-center rounded-[3px] border border-white/20 bg-black">
            <Terminal className="size-3.5 text-white" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            darsh<span className="text-accent">.</span>builds
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-[3px] px-3 py-1.5 font-mono text-[13px] transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-[3px] px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub profile"
          >
            <Github className="size-4" />
          </a>
          <Link
            to="/admin"
            className="rounded-[3px] px-2.5 py-1.5 font-mono text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            ~/admin
          </Link>
        </nav>

        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-[3px] text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-border/80 bg-background px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-[3px] px-3 py-2 font-mono text-sm",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-border/60 pt-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="size-4" />
              </a>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="font-mono text-xs text-muted-foreground/70 hover:text-foreground"
              >
                ~/admin
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
