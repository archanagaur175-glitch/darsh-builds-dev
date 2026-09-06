import { Link } from "react-router";
import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="404" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          exit code 404
        </p>
        <h1 className="mt-4 font-mono text-5xl font-bold tracking-tight sm:text-6xl">
          Not found
        </h1>
        <p className="mt-4 max-w-md font-mono text-sm leading-6 text-muted-foreground">
          The route you requested does not exist on this server. Check the
          spelling and try again.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[2px] bg-foreground px-5 py-2.5 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          cd ~/
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
