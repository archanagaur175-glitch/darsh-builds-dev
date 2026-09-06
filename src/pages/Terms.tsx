import { Seo } from "@/components/Seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ADMIN_EMAIL, GITHUB_URL } from "@/lib/site";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Acceptance of these terms",
    body: [
      "By accessing this website you agree to these terms of use. If you do not agree, do not use the site.",
    ],
  },
  {
    title: "2. Description of service",
    body: [
      "This site is a personal portfolio operated by Darsh Gaur. It publishes information about open-source software, an academic record and blog posts. Everything on it is provided for informational purposes.",
    ],
  },
  {
    title: "3. Acceptable use",
    body: [
      "You may browse the site freely. You may not scrape it at scale, attempt to break or bypass its security or rate limits, impersonate the owner, or use it to distribute malware or unlawful content. The owner account and the /admin editing system are restricted to the site owner; attempting to access or alter them is prohibited.",
    ],
  },
  {
    title: "4. Intellectual property",
    body: [
      "The site content (text, layout, design) is owned by Darsh Gaur unless stated otherwise. The open-source projects displayed here are independent repositories, each governed by the license published inside that repository, and the owner makes no claim over third-party code or assets inside them.",
    ],
  },
  {
    title: "5. Third-party links",
    body: [
      "The site links to external services including GitHub, live demos and documentation. Those services have their own terms and privacy policies, and this site is not responsible for their content or operation.",
    ],
  },
  {
    title: "6. Disclaimer of warranties",
    body: [
      "The site and its content are provided as is and as available, without warranties of any kind, express or implied, including accuracy, completeness or fitness for a particular purpose. Project descriptions are written to reflect the repositories at the time of writing; code evolves and details may become outdated.",
    ],
  },
  {
    title: "7. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, the site owner is not liable for any indirect, incidental or consequential damages arising from use of this site or from reliance on its content.",
    ],
  },
  {
    title: "8. Governing law and jurisdiction",
    body: [
      `These terms are governed by the laws of India. [PLACEHOLDER: jurisdiction to be confirmed by the site owner. Pending confirmation, disputes fall under the courts of Bengaluru, Karnataka, India.]`,
    ],
  },
  {
    title: "9. Changes to these terms",
    body: [
      "These terms may be updated as the site changes. The effective date above reflects the latest revision.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      `Questions about these terms: ${ADMIN_EMAIL}. Source repositories referenced on this site: ${GITHUB_URL}.`,
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Terms of Use"
        description="Terms governing use of darshbuilds.dev."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated September 2026
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
