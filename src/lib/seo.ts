// Shared SEO constants/helpers, used by every route's `head()`.
//
// Centralised so canonical/og:url/og:image are always built from one
// absolute base — a relative "/" canonical or og:url is ambiguous to search
// engines and social platforms, which is exactly the bug this replaced (see
// src/routes/index.tsx history).
export const SITE_URL = "https://alphapresence.studio";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

/** Builds the standard meta/link head entries every page needs, given a
 * page's own title, description and path (e.g. "/" or "/work/onomz-investments"). */
export function pageHead(input: { title: string; description: string; path: string }) {
  const url = `${SITE_URL}${input.path}`;
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:type", content: "website" as const },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Alpha Presence" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Alpha Presence — UK digital agency for local businesses",
      },
      { name: "twitter:card", content: "summary_large_image" as const },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical" as const, href: url }],
  };
}

/** BreadcrumbList JSON-LD — `crumbs` excludes the trailing current page's
 * own name/url pairing convention: pass every crumb including the current
 * page as the last entry. */
export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}
