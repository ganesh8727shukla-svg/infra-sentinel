import { APP_NAME } from "@/config";

/** Builds a consistent per-route meta block. */
export function seo(title: string, description: string) {
  const fullTitle = `${title} · ${APP_NAME}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
