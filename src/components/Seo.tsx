import { useEffect } from "react";
import { useLocation } from "react-router";
import { SITE_NAME, SITE_URL } from "@/lib/site";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }
    upsertMeta("property", "og:title", document.title);
    upsertMeta("property", "og:url", `${SITE_URL}${pathname}`);
    upsertMeta("property", "og:site_name", SITE_NAME);

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${pathname}`);
  }, [title, description, pathname]);

  return null;
}
