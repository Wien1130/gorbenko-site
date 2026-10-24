import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/andrii", "/kunden", "/olya", "/crm", "/reports", "/bi-markt", "/angebot", "/anton", "/api", "/deutsch", "/p/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
