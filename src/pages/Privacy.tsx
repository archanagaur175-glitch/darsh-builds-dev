import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ADMIN_EMAIL, SITE_DOMAIN } from "@/lib/site";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. What this site is",
    body: [
      `${SITE_DOMAIN} is the personal portfolio of Darsh Gaur. It presents public open-source repositories, an academic record and occasional blog posts. It is a static web application with no account system for visitors.`,
    ],
  },
  {
    title: "2. Data this site collects",
    body: [
      "Visitor data: none by default. The site sets no tracking cookies and runs no analytics scripts. Your browser may store a small preference value (for example, whether the project map renders as a spatial view or a static list) in local storage on your own device.",
      "Admin data: the single site owner has an account used only to edit content at the /admin route. That account stores an email address, authentication timestamps and session records so that only the owner can change published content.",
      "Content data: the projects, academic entries and blog posts shown here are stored in the site's database and were authored by the site owner.",
    ],
  },
  {
    title: "3. GitHub API data",
    body: [
      "Repository statistics on this site (stars, forks, open issues, language, last push) are fetched live from the public GitHub REST API by your browser. GitHub processes those requests under GitHub's own privacy policy. Results are cached on your device for up to one hour so the site keeps working when the API is rate limited or unreachable.",
    ],
  },
  {
    title: "4. Third-party services",
    body: [
      `Convex: database, authentication and backend hosting. Convex stores the owner account and the content records described above on its infrastructure. See convex.dev/privacy for how Convex handles data.`,
      "Email delivery: one-time sign-in codes for the owner account are sent by the email provider configured with the authentication service. That provider sees the owner's email address and the code message.",
      "Hosting platform: the platform that serves this site logs standard technical request data (IP address, user agent, requested page) for operational purposes, as any web host does.",
      "GitHub: see section 3. GitHub is not affiliated with this site.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "This site does not use cookies for advertising, tracking or analytics. Authentication for the owner account may use browser storage managed by the authentication library to keep the owner signed in.",
    ],
  },
  {
    title: "6. Data retention",
    body: [
      "Visitor preference values in local storage stay on your device until you clear them. Owner account records remain until the account is deleted, which the owner can request through the contact address below. Published content remains until the owner edits or removes it.",
    ],
  },
  {
    title: "7. Your choices and rights",
    body: [
      "If you live in a jurisdiction with data protection rights (for example the GDPR or India's Digital Personal Data Protection Act), you may request access to, correction of, or deletion of any personal data this site holds about you. In practice, the only personal data this site holds is the owner's own.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      `For privacy requests, write to ${ADMIN_EMAIL}.`,
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Privacy Policy"
        description="What data darshbuilds.dev collects, and how it is used."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated September 2026 · {SITE_DOMAIN}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider">
                {s.title}
              </h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p) => (
                  <p key={p} className="text-sm leading-7 text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
